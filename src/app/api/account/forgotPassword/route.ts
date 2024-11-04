import { NextRequest, NextResponse } from 'next/server';
import {MD5} from "@/features/api/md5";
import {prisma} from "../../../../../prisma/prisma";
import { getActionToken } from '@/features/api/actionToken/getActionToken';
import { removeActionToken } from '@/features/api/actionToken/removeActionToken';
import { sendEmail } from '@/features/api/mailer/sendEmail';
import { accountResetPasswordEmailTemplate } from '@/features/api/mailer/emailTemplates/accountResetPasswordEmailTemplate';
export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {
    const token = request.nextUrl.searchParams.get('token');
    
    try {

        if (!token) {
            return NextResponse.json({success: false});
        }

        const actionToken = await getActionToken(token);
        if (!actionToken) {
            return NextResponse.json({success: false});
        }
        else {
            if (!actionToken.app_user) return NextResponse.json({success: false});
            const { id, email, firstname } = actionToken.app_user;
            if (!firstname) return NextResponse.json({success: false});

            const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            await prisma.app_user.update({
                where: {
                    id: id
                },
                data: {
                    password: MD5(encodeURIComponent(randomPassword))
                }
            })
            await removeActionToken(token)

            await sendEmail(accountResetPasswordEmailTemplate({newPassword: randomPassword, firstName: firstname}), email)

        }

        return NextResponse.json({ success: true});
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
