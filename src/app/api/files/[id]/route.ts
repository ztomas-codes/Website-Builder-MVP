import { NextRequest, NextResponse } from 'next/server';
import {userAccountInfoSchema} from "@/types/account/account";
import {cookies} from "next/headers";
import { prisma } from '../../../../../prisma/prisma';

export const GET = async (request: NextRequest): Promise<NextResponse<string | object>> => {
    try {

        const file = await prisma.site_files.findFirst({
            where: {id: parseInt(request.url.split('/').pop() || '')}
        });

        const site = await prisma.site.findFirst({
            where: {id: file?.siteid}
        });

        if (!site) {
            return new NextResponse("Site not found", {
                status: 404
            });
        }

        if (!file) {
            return new NextResponse("File not found", {
                status: 404
            });
        }


        return new NextResponse(file.content || '', {
            headers: {
                'Content-Type': (file?.type === 'CSS') ? 'text/css' : 'text/javascript'
            }   
        });
        

    } catch (e) {
        return NextResponse.json({ success: false, error: (e as any).message });
    }
};
