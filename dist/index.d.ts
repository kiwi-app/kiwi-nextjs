/// <reference types="react" />
import React from 'react';
import { NextRequest, NextResponse } from 'next/server';

type Page = {
    id: string;
    siteId: string;
    name: string;
    path: string;
    updatedAt: Date;
    sections: {
        type: string;
        props: {
            [key: string]: any;
        };
    }[];
};
type LiveEditorMessage = {
    type: string;
    event: 'hover-section' | 'click-section' | 'remove-section';
    data: {
        [key: string]: any;
    };
};
type SchemaProperty = {
    name: string;
    type: string;
    description?: string;
};
type Schema = {
    properties: SchemaProperty[];
    required: string[];
    type: string;
};
type ExportedModule = {
    module: {
        default: JSX.Element | Function;
        Loader?: (req: LoaderRequest, props: any) => Promise<any>;
    };
    schema: {
        component: Schema;
        loader?: Schema;
    };
};
type LoaderRequest = {
    headers?: {
        [T: string]: string;
    };
    cookies?: {
        [T: string]: string;
    };
};
type Manifest = {
    sections: {
        [S: string]: ExportedModule;
    };
    [B: string]: {
        [T: string]: ExportedModule;
    };
    site: string;
    baseUrl: string;
};

type CatchAllServerProps = {
    page: Page;
    manifest: Manifest;
};
declare function CatchAllServer({ page, manifest }: CatchAllServerProps): React.JSX.Element;

type CatchAllClientProps = {
    page: Page;
    requestInfo: LoaderRequest;
};
declare const _default: (manifest: Manifest) => ({ page: initialPage, requestInfo }: CatchAllClientProps) => React.JSX.Element;

type CatchAllProps = {
    params: {
        kiwi: string[];
    };
};
declare function KiwiCatchAll(manifest: any, ClientComponent: any, ServerComponent: any): ({ params: { kiwi } }: CatchAllProps) => Promise<React.JSX.Element | null>;

declare function LiveRoute(manifest: any): {
    PATCH: (_: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<{}>>;
    GET: (_: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => NextResponse<Manifest> | undefined;
    POST: (req: NextRequest, { params: { kiwi } }: {
        params: {
            kiwi: string[];
        };
    }) => Promise<NextResponse<any>>;
    OPTIONS(_: NextRequest): NextResponse<{}>;
};

interface RichText extends String {
}
interface RichTextComponentProps extends React.HTMLAttributes<HTMLParagraphElement> {
    text: RichText;
}
declare function RichTextComponent({ text, ...props }: RichTextComponentProps): React.JSX.Element;

type EventData = {
    [key: string]: any;
};

export { KiwiCatchAll as CatchAll, _default as CatchAllClient, CatchAllClientProps, CatchAllProps, CatchAllServer, CatchAllServerProps, EventData, LiveEditorMessage, LiveRoute, LoaderRequest, Manifest, Page, RichText, RichTextComponent, RichTextComponentProps, Schema, SchemaProperty };
