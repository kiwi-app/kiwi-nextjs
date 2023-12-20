import { NextRequest, NextResponse } from 'next/server';
export declare function LiveRoute(manifest: any): {
    PATCH: (_: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<{}>>;
    GET: (_: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => NextResponse<import("..").Manifest> | undefined;
    POST: (req: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<any>>;
    OPTIONS(_: NextRequest): NextResponse<{}>;
};
