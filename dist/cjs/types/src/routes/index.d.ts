import { NextResponse, type NextRequest } from 'next/server';
export declare function LiveRoute(manifest: any): {
    PATCH: (_: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<{}>>;
    GET: (request: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => NextResponse<{}> | undefined;
    POST: (req: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<any>>;
    OPTIONS(_: NextRequest): NextResponse<{}>;
};
