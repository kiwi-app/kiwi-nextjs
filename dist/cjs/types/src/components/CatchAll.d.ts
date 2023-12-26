import React from 'react';
import { SearchParams } from '../types';
export type CatchAllProps = {
    params: {
        kiwi: string[];
    };
    searchParams: SearchParams;
};
export default function KiwiCatchAll(manifest: any, ClientComponent: any, ServerComponent: any): ({ params: { kiwi }, searchParams }: CatchAllProps) => Promise<React.JSX.Element | null>;
