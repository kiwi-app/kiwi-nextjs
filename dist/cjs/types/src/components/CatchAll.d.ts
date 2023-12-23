/// <reference types="react" />
export type CatchAllProps = {
    params: {
        kiwi: string[];
    };
};
export default function KiwiCatchAll(manifest: any, ClientComponent: React.JSX.Element, ServerComponent: React.JSX.Element): ({ params: { kiwi } }: CatchAllProps) => Promise<import("react").JSX.Element | null>;
