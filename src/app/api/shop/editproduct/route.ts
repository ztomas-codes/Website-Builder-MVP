import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { productForm } from '@/types/dashboard/dashboardForms';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';


    try {

        const product = await request.json();

        product.id = parseInt(product.id);

        const { id, name, cost, category_id, description, visible, image } = productForm.parse(product);

        if (!session_id) {
            throw new Error("Unauthorized");
        }
        if (!id) {
            throw new Error("Invalid product id");
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

        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(cookies().get("site")?.value || ''),
                userid: sessions.app_user.id
            }
        });

        if (!siteDb) {
            throw new Error("No site found");
        }

        const productDb = await prisma.app_product.findFirst({
            where: {
                id: id,
                site_id: siteDb.id
            }
        });

        if (!productDb) {
            throw new Error("No product found");
        }

        await prisma.app_product.update({
            where: {
                id: id
            },
            data: {
                name: name,
                cost: cost,
                category_id: category_id,
                description: description,
                visible: visible,
                image: image
            }
        });

        return NextResponse.json({success: true }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
    } );
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
