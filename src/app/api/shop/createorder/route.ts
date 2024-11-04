import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';
import { prisma } from '../../../../../prisma/prisma';
import { decrypt } from '@/features/stripe/stripeCryptography';

type Item = {
    id: number;
    quantity: number;
}

type CreateOrderRequest = {
    items: Item[];
    pageId: number;
}

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try
    {
        const {items, pageId} = await request.json() as CreateOrderRequest;
        if (!items) throw new Error('No items provided');
        if (!items.length) throw new Error('No items provided');
        if (items.some((item) => !item.id || !item.quantity)) throw new Error('Invalid items provided');
        if (items.some((item) => item.quantity < 1)) throw new Error('Invalid items provided');
        if (items.some((item) => !Number.isInteger(item.quantity))) throw new Error('Invalid items provided');
        if (items.some((item) => item.id < 1)) throw new Error('Invalid items provided');

        const page = await prisma.site_page.findFirst({
            where: {
                id: pageId
            }
        });

        if (!page) throw new Error('Page not found');
        const site = await prisma.site.findFirst({
            where: {
                id: page.siteid
            }
        });
        if (!site) throw new Error('Site not found');


        const stripe = require('stripe')(decrypt(site.stripeKey));


        const order = await prisma.orders.create({
            data: {
                site_id: site.id,
            }
        });

        const products = await prisma.app_product.findMany({
            where: {
                site_id: site?.id
            }
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            /*custom_fields: [
                {
                    key: 'telefon',
                    label: {
                        type: 'custom',
                        custom: 'Telefon',
                    },
                    type: 'text',
                },
                {
                  key: 'vaha',
                  label: {
                    type: 'custom',
                    custom: 'Váha',
                  },
                  type: 'numeric',
                },
                {
                    key: 'vek',
                    label: {
                        type: 'custom',
                        custom: 'věk',
                    },
                    type: 'numeric',
                }
            ],*/
            line_items: [
                ...items.map((item) => {
                    const product = products.find((product) => product.id === item.id);
                    if (!product) {
                        throw new Error('Product not found');
                    }
                    return {
                        price_data: {
                            currency: 'czk',
                            product_data: {
                                name: product.name,
                            },
                            unit_amount: ((product.cost || 0) as number ) * 100,
                        },
                        quantity: item.quantity,
                    }
                })
            ],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            metadata: {
                items: JSON.stringify(products
                    .filter((product) => items.some((item) => item.id === product.id))
                    .map((product) => ({
                        id: product.id,
                        name: product.name,
                        cost: product.cost,
                        quantity: items.find((item) => item.id === product.id)?.quantity,
                    }))
                ),
                id: order.id,
            },
            phone_number_collection: {
                enabled: true,
            },
            billing_address_collection: 'required',
            invoice_creation: {
                enabled: true,
            },
            shipping_address_collection: {
                allowed_countries: ['CZ'],
            },
        });


        return NextResponse.json({ success: true, session });
    }
    catch (e) {
        return NextResponse.json({ error: (e as any).message }, { status: 500 });
    }
}