import { NextRequest, NextResponse } from 'next/server';
import {userLoginSchema} from "@/types/account/account";
import {MD5} from "@/features/api/md5";
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { mainInfo } from '@/types/dashboard/dashboardForms';
import { parse } from 'path';
import { encrypt } from '@/features/stripe/stripeCryptography';
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site_id = cookies().get('site')?.value || '';

    try {

        const { smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, domain, currency, stripe } = mainInfo.parse(await request.json());

        const session = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {email: true, firstname: true, lastname: true, nickname: true, id: true}}}
        });

        if (session?.app_user === null) throw new Error('No user found');
        if (session === null) throw new Error('No session found');

        const site = await prisma.site.findFirst({
            where: {
                id: parseInt(site_id),
                userid: session.app_user.id
            }
        });

        if (site === null) throw new Error('No site found');

        await prisma.site.update({
            where: {id: site.id},
            data: {
                smtp_host: smtp_host,
                smtp_port: parseInt(smtp_port),
                smtp_secure: Boolean(smtp_secure),
                smtp_user: smtp_user,
                smtp_pass: smtp_pass,
                domain: domain,
                currency: currency,
                stripeKey: encrypt(stripe)
            }
        });


        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
