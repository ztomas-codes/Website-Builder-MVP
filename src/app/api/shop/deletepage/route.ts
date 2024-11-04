import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { z } from 'zod';

const deleteSchema = z.object({
    id: z.number()
});

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';


    try {

        const { id } = deleteSchema.parse( await request.json());

        const sessionDb = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {id: true}}}
        });

        if (!sessionDb) {
            throw new Error("Unauthorized");
        }

        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: sessionDb.user_id || 0
            }
        });

        if (!siteDb) {
            throw new Error("Unauthorized");
        }

        const pageDb = await prisma.site_page.findFirst({
            where: {
                id: id,
                siteid: siteDb.id
            }
        });

        if (!pageDb) {
            throw new Error("Page not found");
        }

        const page = await prisma.site_page.delete({
            where: {
                id: id
            }
        });

        return NextResponse.json({success: true }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
    } );
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
