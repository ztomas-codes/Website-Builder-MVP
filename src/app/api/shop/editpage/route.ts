import { pageForm } from "@/types/dashboard/dashboardForms";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';

    try {
        const { id, name, description, slug } = pageForm.parse(await request.json());

        if (!session_id) {
            throw new Error('No session provided');
        }
        if (!site) {
            throw new Error('No site provided');
        }

        const session = await prisma.app_sessions.findFirst({
            where: { session_id },
            include: { app_user: { select: { id: true } } }
        });

        if (!session) {
            throw new Error('No session found');
        }

        if (session.app_user === null) {
            throw new Error('No user found');
        }

        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: session.app_user.id
            }
        });

        if (!siteDb) {
            throw new Error('No site found');
        }

        const page = await prisma.site_page.findFirst({
            where: {
                id: id,
                siteid: siteDb.id
            }
        });

        if (!page) {
            throw new Error('No page found');
        }

        await prisma.site_page.update({
            where: {
                id: page.id
            },
            data: {
                name,
                description,
                slug
            }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }


}