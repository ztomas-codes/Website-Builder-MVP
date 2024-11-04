import { pageForm } from "@/types/dashboard/dashboardForms";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import { z } from "zod";

const deleteMessageSchema = z.object({
    id: z.number(),
    order_id: z.number(),
})

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';

    try {

        const { id , order_id} = deleteMessageSchema.parse(await request.json());

        const session = await prisma.app_sessions.findFirst({
            where: { session_id: session_id },
        });

        if (!session) throw new Error("Invalid session");

        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: session.user_id || 0
            }
        });
        if (!siteDb) throw new Error("Invalid session");

        const order = await prisma.orders.findFirst({
            where: {
                id: order_id,
                site_id: siteDb.id
            }
        });

        if (!order) throw new Error("Invalid order");

        await prisma.order_logs.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }


}