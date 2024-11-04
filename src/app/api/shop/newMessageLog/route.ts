import { pageForm } from "@/types/dashboard/dashboardForms";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import { z } from "zod";

const newMessageSchema = z.object({
    message: z.string(),
    order_id: z.number(),
})

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const siteId = cookies().get("site")?.value || '';

    try {

        const { message, order_id } = newMessageSchema.parse(await request.json());

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



        const order = await prisma.orders.findFirst({
            where: {
                id: order_id,
                site_id: site.id
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Invalid order" });
        }

        const orderLog = await prisma.order_logs.create({
            data: {
                log_message: message,
                order_id: order_id,
            }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }


}