import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import { fileForm } from "@/types/dashboard/dashboardForms";


export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const siteId = cookies().get("site")?.value || '';

    try {


        const { type }= await request.json();

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


        //if type is not Product or Element
        if (!["Product", "Element"].includes(type)) {
            return NextResponse.json({ success: false, error: "Invalid type" });
        }


        await prisma.site_component.create({
            data: {
                html: "",
                name: "NEW COMPONENT EDIT HERE",
                type: type,
                siteid: site.id,
                categories: type === "Product" ? "" : null,
            }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }


}