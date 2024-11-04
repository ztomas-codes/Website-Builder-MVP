import { prisma } from '../../../prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';
import { headers } from 'next/headers';

export const GET = async (request: NextRequest,
): Promise<NextResponse<object>> => {


    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") as string );
    const session = searchParams.get("session") as string;
    const type = searchParams.get("type") as string;


    if (!id) {
        return new NextResponse("Id not found", {
            status: 404
        });
    }

    //if type not component or page
    if (type !== 'component' && type !== 'page') {
        return new NextResponse("Type not found", {
            status: 404
        });
    }

    const sessionDb = await prisma.app_sessions.findFirst({
        where: {
            session_id: session
        }
    });

    if (!sessionDb) {
        return new NextResponse("Session not found", {
            status: 404
        });
    }

    const headersList = headers();
    let host = headersList.get('originhost');

    if (headersList.has('host')) {
        if (headersList.get('host') === 'localhost:3000') {
            host = 'localhost';
        }
    }

    if (!sessionDb.user_id) {
        return new NextResponse("User not found", {
            status: 404
        });
    }

    const site = await prisma.site.findFirst({
        where: {
            domain: host,
            userid: sessionDb.user_id
        }
    });


    if (!site) {
        return new NextResponse("Site not found", {
            status: 404
        });
    }


    let finalContent = '' as any;
    let finalCssFiles = [] as {
        id: number;
        siteid: number;
        type: string;
        content: string;
    }[];
    let finalJsFiles = [] as {
        id: number;
        siteid: number;
        type: string;
        content: string;
    }[];

    if (type === 'page') {
        const page = await prisma.site_page.findFirst({
            where: {
                id: id,
                siteid: site.id
            }
        });

        if (!page) {
            return new NextResponse("Page not found", {
                status: 404
            });
        }
        const {content, cssFiles, jsFiles, pageId} = await buildPage(site.domain, '/', false, page);

        finalContent = content;
        finalCssFiles = cssFiles;
        finalJsFiles = jsFiles;
    }
    if (type === 'component') {
        const component = await prisma.site_component.findFirst({
            where: {
                id: id,
                siteid: site.id
            }
        });

        if (!component) {
            return new NextResponse("Component not found", {
                status: 404
            });
        }

        const content = await prisma.site_component.findFirst({
            where: {
                id: id,
                siteid: site.id
            }
        });

        const cssFiles = await prisma.site_files.findMany({
            where: {
                siteid: site.id,
                type: 'CSS'
            }
        });

        const jsFiles = await prisma.site_files.findMany({
            where: {
                siteid: site.id,
                type: 'SCRIPT'
            }
        });

        finalContent = content?.html;
        finalCssFiles = cssFiles as any;
        finalJsFiles = jsFiles as any;
    }

    const url = type === 'page' ? `/api/shop/pageupdate` : `/api/shop/componentupdate`;
    
    const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="//unpkg.com/grapesjs/dist/css/grapes.min.css">
                <style>
                    body{
                        margin: 0;
                        padding: 0;
                    }
                    .mainfixedbutton
                    {
                        position: fixed;
                        top: 10%;
                        right: 20%;
                        z-index: 100;
                        transition: all 270ms;
                        background-color: #35D7BB;
                        border: none;
                        color: white;
                        text-align: center;
                        padding: 15px 32px;
                        border-radius: 12px;
                        cursor: pointer;
                    }
                    .mainfixedbutton:hover {
                        opacity: 0.5;
                    }
                    .mainfixedbutton .notActive {
                        display: none;
                    }
                </style>
            </head>
            <body>
            <div id="gjs">
                <style>
                    ${finalCssFiles.map((file) => file.content).join(' ')}
                </style>
                ${finalContent}
                ${finalJsFiles.map((file) => `<script>${file.content}</script>`).join(' ')}
            </div>
            <button class="mainfixedbutton">Save</button>
            <script id="a" src="https://unpkg.com/grapesjs-preset-newsletter" > </script>
            <script id="t" src="https://unpkg.com/grapesjs"> </script>
            <script id="b">
                const id = ${id};
                const editor = grapesjs.init({
                    height: '100vh',
                    container: '#gjs',
                    fromElement: true,
                    storageManager: false,
                    plugins: ['grapesjs-preset-newsletter'],
                    pluginsOpts: {
                    'grapesjs-preset-newsletter': {
                        // options
                    }
                    },
                });

                editor.BlockManager.add('my-first-block', {
                    label: 'Simple block',
                    content: '<div class="my-block">This is a simple block</div>',
                });

                document.querySelector('.mainfixedbutton').addEventListener('click', () => {
                    document.querySelector('.mainfixedbutton').classList.add('notActive');
                    fetch('${url}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id,
                            content: editor.getHtml()
                        })
                    }).then((res) => {
                        document.querySelector('.mainfixedbutton').classList.remove('notActive');
                        alert('Saved');
                    }).catch((err) => {
                        document.querySelector('.mainfixedbutton').classList.remove('notActive');
                        alert('Error while saving');
                    });
                });
            </script>
            </body>
            </html>
    `;

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
};