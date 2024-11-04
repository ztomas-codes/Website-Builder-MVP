import { NextRequest, NextResponse } from 'next/server';
import {emailSchema} from "@/types/account/account";
import { prisma } from '../../../../../prisma/prisma';
import { subscriptionEmailTemplate } from '@/features/api/mailer/emailTemplates/subscriptionNewEmail';
import { generateDiscountCode } from '@/features/api/discountCode/generateDiscountCode';
import { sendEmail } from '@/features/api/mailer/sendEmail';
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const {email} = emailSchema.parse(await request.json());
        await prisma.app_user.create({
            data: {
                email,
            }
        })

        const codeData = {
            discount: 15,
            expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }

        const code = await generateDiscountCode({
            discount: codeData.discount,
            expiration: codeData.expiration,
        })

        await sendEmail(subscriptionEmailTemplate(
            {code, discount: codeData.discount, expiration: codeData.expiration}
        ), email);

        return NextResponse.json({ success: true, });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
