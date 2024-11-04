import { NextRequest, NextResponse } from 'next/server';
import {userLoginSchema} from "@/types/account/account";
import {MD5} from "@/features/api/md5";
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { decrypt, encrypt } from '@/features/stripe/stripeCryptography';
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';

    try {

        const session = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {email: true, firstname: true, lastname: true, nickname: true, id: true}}}
        });

        if (session?.app_user === null) throw new Error('No user found');
        if (session === null) throw new Error('No session found');

        const site = cookies().get('site')?.value || '';

        let siteInfo = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: session.app_user.id
            },
        });


        if (siteInfo === null) throw new Error('No user info found');
        siteInfo.stripeKey = decrypt(siteInfo.stripeKey);
        return NextResponse.json({ success: true, siteInfo });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
