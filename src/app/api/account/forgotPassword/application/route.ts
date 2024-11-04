import { NextRequest, NextResponse } from 'next/server';
import {emailSchema} from "@/types/account/account";
import {createActionToken} from "@/features/api/actionToken/createActionToken";
import {sendEmail} from "@/features/api/mailer/sendEmail";
import {
    accountWantToResetPasswordEmailTemplate
} from "@/features/api/mailer/emailTemplates/accountWantToResetPasswordEmailTemplate";
import {prisma} from "../../../../../../prisma/prisma";
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const { email } = emailSchema.parse(await request.json());
        const user = await prisma.app_user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.json({ success: true});
        }
        else
        {

            const firstname = user.firstname;
            if (!firstname) {
                return NextResponse.json({ success: true});
            }
            const token =
            await createActionToken(user.id, "resetPassword", new Date(Date.now() + 1000 * 60 * 60 * 24));
            await sendEmail(accountWantToResetPasswordEmailTemplate({
                email: email,
                token: token,
                firstName: firstname
            }), email);
        }

        return NextResponse.json({ success: true});
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
