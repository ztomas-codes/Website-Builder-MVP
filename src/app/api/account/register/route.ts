import { NextRequest, NextResponse } from 'next/server';
import {userRegisterSchema} from "@/types/account/account";
import {MD5} from "@/features/api/md5";
import { prisma } from '../../../../../prisma/prisma';
import { sendEmail } from '@/features/api/mailer/sendEmail';
import { accountRegisterEmailTemplate } from '@/features/api/mailer/emailTemplates/accountRegisterEmailTemplate';
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const {firstname, lastname, nickname, password, email} = userRegisterSchema.parse(await request.json());

        const user = await prisma.app_user.findFirst({
            where: {email: email}
        })

        if (user != null)
        {
            if (user.firstname != null) throw new Error("User already exists");
            else await prisma.app_user.update({
                where: {email: email},
                data: {
                    firstname,
                    lastname,
                    nickname,
                    password: MD5(encodeURIComponent(password))
                }
            })
        }
        else {
            await prisma.app_user.create({
                data: {
                    email,
                    firstname,
                    lastname,
                    nickname,
                    password: MD5(encodeURIComponent(password))
                }
            })

        }

        await sendEmail(accountRegisterEmailTemplate({firstName: firstname}), email);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
