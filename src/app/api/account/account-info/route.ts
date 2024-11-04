import { NextRequest, NextResponse } from 'next/server';
import {userAccountInfoSchema} from "@/types/account/account";
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {

        const cookie_name: any = "APP_SESSION";
        const session_id = cookies().get(cookie_name)?.value || '';

        const session = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {email: true, firstname: true, lastname: true, nickname: true, id: true}}}
        });

        if(session) {
            return NextResponse.json({success: true, user: {...session}});
        }
        return NextResponse.json({ success: false, error: "Invalid session" });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
