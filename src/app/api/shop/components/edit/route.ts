import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";
import { componentForm, productForm } from '@/types/dashboard/dashboardForms';
import { prisma } from '../../../../../../prisma/prisma';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';


    try {

        const {name, categories, id} = componentForm.parse(await request.json());

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

        await prisma.site_component.update({
            where: {id: id},
            data: {
                name: name,
                categories: categories,
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
