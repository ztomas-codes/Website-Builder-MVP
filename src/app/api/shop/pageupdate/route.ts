import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';
import { prisma } from '../../../../../prisma/prisma';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const {id, content} = await request.json();

        if (!id) throw new Error('No id provided');
        if (!content) throw new Error('No content provided');

        const page = await prisma.site_page.findFirst({
            where: {id: id}
        });

        if (!page) throw new Error('Page not found');

        await prisma.site_page.update({
            where: {id: id},
            data: {
                html: content
            }
        });

        return NextResponse.json({ success: true });

    }
    catch (e) {
        return NextResponse.json({ error: (e as any).message }, { status: 500 });
    }
}