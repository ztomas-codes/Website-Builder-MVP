import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { productForm } from '@/types/dashboard/dashboardForms';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';


    try {

        const product = await request.json();
        const { name, cost, category_id, description, visible, image } = productForm.parse(product);

        if (!session_id) {
            throw new Error("Unauthorized");
        }
        const sessions = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {id: true}}}
        });

        if (!sessions) {
            throw new Error("Unauthorized");
        }

        if (sessions.app_user === null) {
            throw new Error("Unauthorized");
        }

        const site = cookies().get("site")?.value || '';
        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: sessions.app_user.id
            }
        });

        if (!siteDb) {
            throw new Error("Unauthorized");
        }

        const newProduct = await prisma.app_product.create({
            data: {
                category_id: category_id,
                cost: cost,
                description: description,
                image: image,
                name: name,
                site_id: siteDb.id,
                visible: visible
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
