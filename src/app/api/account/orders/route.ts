import { NextRequest, NextResponse } from 'next/server';
import {userLoginSchema} from "@/types/account/account";
import {MD5} from "@/features/api/md5";
import { prisma } from '../../../../../prisma/prisma';
import {cookies} from "next/headers";
import { decrypt } from '@/features/stripe/stripeCryptography';


type OrderData = {
    id: string;
    amount_total: number;
    created: number;
    currency: string;
    payment_status: string;
    metadata: {
        items: string;
    }
}

export type Order = {
    id: number;
    total: number;
    created: number;
    currency: string;
    status: string;
    items: OrderItem[];
    customer: any |
    {
        name: string;
        email: string;
        phone: string;
    }
    logs: {
        id: number;
        message: string;
        date: number;
    }[]
    notifications: {
        message: string;
        date: number;
    }[]
}

type OrderItem = {
    cost: number;
    name: string;
    costPerItem: number;
    quantity: number;
}

export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {
   
   
    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';

    try {

        const session = await prisma.app_sessions.findFirst({
            where: {session_id: session_id},
            include: {app_user: {select: {id: true}}}
        });
        
        if (!session) {
            throw new Error("Unauthorized");
        }

        const siteDb = await prisma.site.findFirst({
            where: {
                id: parseInt(site),
                userid: session.user_id || 0
            }
        });

        if (!siteDb) {
            return NextResponse.json({ success: true, orders: []});
        }

        if (!siteDb.stripeKey) {
            return NextResponse.json({ success: true, orders: [] });
        }


        const stripe = require('stripe')(decrypt(siteDb.stripeKey || ''));

        let sessions = await stripe.checkout.sessions.list({
            limit: 100
        });

        const products = await prisma.app_product.findMany({
            where: {
                site_id: 1
            }
        });

        sessions = sessions.data;

        sessions = sessions.filter((session : any) => session.payment_status === 'paid');

        //add session items
        for (let i = 0; i < sessions.length; i++) {
            if (!sessions[i].metadata.items) continue;
            const session = sessions[i] as any;
            let items = JSON.parse(session.metadata.items);
            items = items.map((item : any) => {
                const product = products.find((product) => product.id === item.id);
                return {
                    cost : parseInt((item.cost * item.quantity) + ""),
                    name : product?.name || 'Unknown',
                    costPerItem : parseInt("" + (product?.cost || 0)),
                    quantity : item.quantity

                }
            });


            sessions[i].items = items;
            const id = parseInt(session.metadata.id);
            session.id = id;
            if (id)
            {
                let logs = await prisma.order_logs.findMany({
                    where: {
                        order_id: id
                    }
                });

                const logsUpdated = logs.map((log: any) => {
                    return {
                        message: log.log_message,
                        date: log.log_date,
                        id: log.id
                    }
                });

                session.logs = logsUpdated;
            }
        }


        return NextResponse.json({ success: true, orders: sessions.map((session : any) => {
            return {
                id: session.id,
                total: session.amount_total / 100,
                created: session.created,
                currency: session.currency,
                status: session.payment_status,
                items: session.items || [],
                customer: session.customer_details ? {
                    name: session.customer_details.name,
                    email: session.customer_details.email,
                    phone: session.customer_details.phone
                } : "Unknown",
                logs: session.logs || [],
            }
        })
     });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
