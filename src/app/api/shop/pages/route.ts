import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";

export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';

    if (!session_id) return NextResponse.json({ success: false, error: 'No session provided' });

    const session = await prisma.app_sessions.findFirst({
        where: {session_id: session_id},
        include: {app_user: {select: {email: true, firstname: true, lastname: true, nickname: true, id: true}}}
    });

    if (session?.app_user === null) return NextResponse.json({ success: false, error: 'No user found' });
    if (session === null) return NextResponse.json({ success: false, error: 'No session found' });

    const site = cookies().get("site")?.value || '';

    const siteDb = await prisma.site.findFirst({
        where: {
            id: parseInt(site),
            userid: session.app_user.id
        }
    });
    if (!siteDb) throw new Error('No site found');
    
    const pages = await prisma.site_page.findMany({
        where: {
            siteid: siteDb.id,
        },
        orderBy: [
            {
                id: 'asc',
            },
        ]
    });

    
    try {
        return NextResponse.json({success: true, pages, session: session_id ,domain: `https://${siteDb.domain}` }, {
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
