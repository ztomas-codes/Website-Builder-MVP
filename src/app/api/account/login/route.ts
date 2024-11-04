import { NextRequest, NextResponse } from 'next/server';
import {userLoginSchema} from "@/types/account/account";
import {MD5} from "@/features/api/md5";
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const {password, email} = userLoginSchema.parse(await request.json());

        const user = await prisma.app_user.findFirst({
            where: {password: MD5(encodeURIComponent(password)), email: email},
            select: {id: true, email: true, firstname: true, lastname: true, nickname: true}
        });

        if(!user) {
            return NextResponse.json({ success: false, error: "Invalid email or password" });
        }

        const session_id = MD5(Date.now().toString() + user.id.toString());

        await prisma.app_sessions.create({
            data: {
                expiration_date: new Date(Date.now() + 1 * 60 * 60 * 24 * 7),
                session_id,
                active: true,
                app_user: {
                    connect: {id: user.id}
                },
            }
        })

        const cookieString : any = {
            name: 'APP_SESSION',
            value: session_id,
            secure: true,
            httpOnly: true,
            path: '/',
            expires: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        }
        cookies().set(cookieString);


        return NextResponse.json({ success: true, session_id });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
