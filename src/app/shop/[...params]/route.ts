import { headers } from 'next/headers';
import { prisma } from '../../../../prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';

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

    const args = fullPath.split('/');
    args.shift();
    args.shift();

    const page = await prisma.site_page.findFirst({
        where: {
            AND: [
                {
                    siteid: site?.id
                },
                {
                    slug: "/" + args.join('/')
                }
            ]
        }
    });


    if (!page) {
        return new NextResponse("Page not found", {
            status: 404
        });
    }

    const {content, cssFiles, jsFiles} = await buildPage(host, '/'+ args.join('/'), true);
    
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
    ${content}
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