import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { productForm } from '@/types/dashboard/dashboardForms';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';


    try {

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

        //create new page 
        const page = await prisma.site_page.create({
            data: {
                siteid: siteDb.id,
                slug: "/new-page",
                description: "New Page",
                html: "<h1>Welcome to your new page</h1>",
                name: "New Page - Click to edit",
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
