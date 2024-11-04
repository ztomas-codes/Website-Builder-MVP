import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import { parse } from "path";
import { decrypt } from "@/features/stripe/stripeCryptography";
import { stat } from "fs";
import { Order } from "../orders/route";

export type Customer = {
    email: string;
    name: string;
    phone: string;
    address: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        state: string;
    };
    spent: number;
    customer_since: number;
    customer_since_readable: string;
    last_order: number;
    last_order_readable: string;
    sessions: Order[];
};

export type CustomerResponse = {
    success: boolean;
    customers: Customer[];
};

const buildSession = async (session: any) => {
    let items = [];
    const itemsString = session.metadata.items;
    if (itemsString) {
        items = JSON.parse(itemsString);
    }

    let logs = [] as any;

    if (session.metadata.id != null && session.metadata.id !== '') {
        let logs2 = await prisma.order_logs.findMany({
            where: {
                order_id: parseInt( session.metadata.id)
            }
        });

        logs = logs2.map((log: any) => {
            return {
                id: log.id,
                message: log.log_message,
                date: log.log_date,
            };
        });
    }

    return {
        items: items.map((item: any) => {
            return {
                name: item.name,
                cost: item.cost,
                costPerItem: item.costPerItem,
                quantity: item.quantity,
            };
        }) as any,
        logs: logs,
        notifications: [] as any,
        currency: session.currency || '',
        status: session.payment_status || '',
        total: session.amount_total / 100 || 0,
        created: session.created || 0,
        id: session.id || '',
        customer: {
            name: session.customer_details?.name || '',
            email: session.customer_details?.email || '',
            phone: session.customer_details?.phone || '',
        },
    } as Order;
}

export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {

    const cookie_name: any = "APP_SESSION";
    const session_id = cookies().get(cookie_name)?.value || '';
    const site = cookies().get("site")?.value || '';

    try
    {

    const sessionDb = await prisma.app_sessions.findFirst({
        where: {
            session_id: session_id
        }
    });

    if (!sessionDb) {
        throw new Error("Unauthorized");
    }

    if (!sessionDb.user_id) {
        throw new Error("Unauthorized");
    }

    const siteDb = await prisma.site.findFirst({
        where: {
            id: parseInt(site),
            userid: sessionDb.user_id,
        }
    });

    if (!siteDb) {
        throw new Error("Unauthorized"); 
    }

    if (!siteDb.stripeKey) {
        throw new Error("Unauthorized");
    }

    const stripe = require('stripe')(decrypt(siteDb.stripeKey || ''));

    const sessions = await stripe.checkout.sessions.list({
        status: 'complete',
    });

    const customers: Customer[] = [];
    for (const session of sessions.data) {
        if (session.customer_details.email) {
            const customer = customers.find(c => c.email === session.customer_details.email);
            if (customer) {
                customer.spent += (session.amount_total / 100)|| 0;
                if (session.created > customer.last_order) {
                    customer.last_order = session.created;
                    customer.last_order_readable = new Date(session.created * 1000).toLocaleString();
                }

                if (session.created < customer.customer_since) {
                    customer.customer_since = session.created;
                    customer.customer_since_readable = new Date(session.created * 1000).toLocaleString();
                }

                customer.sessions.push(await buildSession(session));
            } else {
                customers.push({
                    email: session.customer_details.email,
                    name: session.customer_details?.name || '',
                    phone: session.customer_details?.phone || '',
                    address: {
                        city: session.customer_details?.address?.city || '',
                        country: session.customer_details?.address?.country || '',
                        line1: session.customer_details?.address?.line1 || '',
                        line2: session.customer_details?.address?.line2 || '',
                        postal_code: session.customer_details?.address?.postal_code || '',
                        state: session.customer_details?.address?.state || '',
                    },
                    spent: session.amount_total /100 || 0,
                    customer_since: session.created,
                    customer_since_readable: new Date(session.created * 1000).toLocaleString(),
                    last_order: session.created,
                    last_order_readable: new Date(session.created * 1000).toLocaleString(),
                    sessions: [await buildSession(session)],
                });
            }
        }
    }

    return NextResponse.json({success: true, customers});

    } catch (error) {
        return NextResponse.json({error: (error as any).message}, {status: 401});
    }
    
}