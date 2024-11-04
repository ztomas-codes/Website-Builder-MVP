import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildPage } from '@/features/shop/buildPage';
import { prisma } from '../../../../../prisma/prisma';

export const POST = async (request: NextRequest): Promise<NextResponse<object>> => {
    try {
        const {id, content} = await request.json();

        if (!id) throw new Error('No id provided');
        if (!content) throw new Error('No content provided');

        const component = await prisma.site_component.findFirst({
            where: {id: id}
        });

        if (!component) throw new Error('Component not found');

        await prisma.site_component.update({
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