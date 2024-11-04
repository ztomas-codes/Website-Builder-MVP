import { pageForm } from "@/types/dashboard/dashboardForms";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import { z } from "zod";


export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const siteId = cookies().get("site")?.value || '';

    try {

        const session = await prisma.app_sessions.findFirst({
            where: { session_id: session_id },
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Invalid session" });
        }

        if (!session.user_id) {
            return NextResponse.json({ success: false, error: "Invalid session" });
        }

        const site = await prisma.site.findFirst({
            where: {
                id: parseInt(siteId),
                userid: session.user_id
            }
        });

        if (!site) {
            return NextResponse.json({ success: false, error: "Invalid session" });
        }

        const files = await prisma.site_files.findMany({
            where: {
                siteid: site.id
            }
        });



        return NextResponse.json({ success: true, files });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }


}