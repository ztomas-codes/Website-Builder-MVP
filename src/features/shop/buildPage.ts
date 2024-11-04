import { prisma } from "../../../prisma/prisma";

type Page = {
    content: string;
    cssFiles: any[];
    jsFiles: any[];
    pageId?: number;
}

export const buildPage = async (domain: any, slug: string, wComponents : boolean, page? : any ) : Promise<Page> => {

    const site = await prisma.site.findFirst({
        where: {
            domain: domain
        }
    });
    if (!site) {
        throw new Error("Site not found");
    }

    let mainpage;

    if (page) {
        mainpage = page;
    } else {
        mainpage = await prisma.site_page.findFirst({
            where: {
                AND: [
                    {
                       siteid: site.id
                    },
                    {
                        slug: slug
                    }
                ]
            }
        });
    }



    const cssFiles = await prisma.site_files.findMany({
        where: {
            AND: [
                {
                    siteid: site.id
                },
                {
                    type: 'CSS'
                }
            ]
        }, orderBy: {order: 'asc'}
    });

    const jsFiles = await prisma.site_files.findMany({
        where: {
            AND: [
                {
                    siteid: site.id
                },
                {
                    type: 'SCRIPT'
                }
            ]
        }, orderBy: {order: 'asc'}
    });



    if (!mainpage || !mainpage.html) {
        throw new Error("Main page not found");
    }
    
    if (!wComponents) return {
        content: mainpage.html,
        cssFiles,
        jsFiles,
        pageId: mainpage.id
    }

    const r = /{{(.*?)}}/g;


    const components = await prisma.site_component.findMany({
        where: {
            siteid: site.id,
        }
    });

    let content = mainpage.html;
    if (wComponents) {
        for (const component of components) {
            const r = new RegExp(`{{${component.name}}}`, 'g');

            if (!component) continue;
            if (component.type == 'Product')
            {
                if (!component.categories) {
                    content = content.replace(r, '');
                    continue;
                }

                let categories = component.categories.split(' ');
                let numCat = categories.map(c => parseInt(c));

                if (categories.length <= 0) {
                    content = content.replace(r, '');
                    continue;
                }

                const products = await prisma.app_product.findMany({
                    where: {
                        AND: [
                            {
                                site_id: site.id
                            },
                            {
                                category_id: {
                                    in: numCat
                                }
                            }
                        ]
                    }
                });

                if (!products) continue;
                if (products.length <= 0) continue;

                let html = '';
                for (const product of products) {
                    var baseHTML = component.html;
                    if (!baseHTML) continue;
                    if (baseHTML) {
                        baseHTML = baseHTML.replace('{{name}}', product.name || '');
                        baseHTML = baseHTML.replace('{{cost}}', (product.cost || '').toString());
                        baseHTML = baseHTML.replace('{{description}}', product.description || '');
                        baseHTML = baseHTML.replace('{{image}}', product.image || '');
                        baseHTML = baseHTML.replace('{{id}}', product.id.toString());
                    }

                    const r = /<button(.*?)<\/button>/g;
                    let button = baseHTML.match(r);
                    if (button) {
                        let buttonHTML = button[0];
                        buttonHTML = buttonHTML.replace('>', ` onClick="addToCart(${product.id})" >`);
                        baseHTML = baseHTML.replace(r, buttonHTML);
                    }

                    html += baseHTML;
                }
                content = content.replace(r, html);
            }
            else
            {
                content = content.replace(r, component.html || '');
            }
        }
    }


    return {
        content,
        cssFiles,
        jsFiles,
        pageId: mainpage.id
    }

}

