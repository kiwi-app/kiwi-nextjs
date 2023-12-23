/// <reference types="react" />
export type CatchAllProps = {
    params: {
        kiwi: string[];
    };
};
export default function KiwiCatchAll(manifest: any, ClientComponent: any, ServerComponent: any): ({ params: { kiwi } }: CatchAllProps) => Promise<import("react").JSX.Element | null>;
