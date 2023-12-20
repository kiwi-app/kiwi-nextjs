import React from 'react';
export type CatchAllProps = {
    params: {
        kiwi: string[];
    };
};
export default function KiwiCatchAll(manifest: any, live?: boolean): ({ params: { kiwi } }: CatchAllProps) => React.JSX.Element;