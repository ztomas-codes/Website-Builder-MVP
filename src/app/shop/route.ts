import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';
import { prisma } from '../../../prisma/prisma';

export const GET = async (request: NextRequest): Promise<NextResponse<object>> => {

    const fullPath = request.nextUrl.pathname;

    const headersList = headers();
    let host = headersList.get('originhost');
    

    if (headersList.has('host')) {
        if (headersList.get('host') === 'localhost:3000') {
            host = 'localhost';
        }
    }

    const site = await prisma.site.findFirst({
        where: {
            domain: host
        }
    });

    const {content,cssFiles, jsFiles, pageId} = await buildPage(host, '/', true);
    const products = await prisma.app_product.findMany({
        where: {
            site_id: site?.id
        }
    });
    
    const html = 
    `
    <!DOCTYPE html>
    <html>

    <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="author" content="" />

    <title>Neogym</title>
    <style>
    ${
        cssFiles.map((file) => {
            return file.content;
        }).join('')
    }
    </style>
    </head>
    <body>
    <script>
    const pageId = ${pageId};
    let ShopStorage = {
        products : [
            ${products.map((product) => {
                return `{id: ${product.id}, name: '${product.name}', cost: ${product.cost}, description: '${product.description}', image: '${product.image}'}`;
            }).join(',')}
        ],
        cart: []
    } 
    </script>
    ${content}
    <script src="/script.js"></script>
    ${
        jsFiles.map((file) => {
            return `<script>${file.content}</script>`;
        }).join('')
    }
    </body>
    </html>
    `

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}