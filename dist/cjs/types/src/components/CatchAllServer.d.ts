import React from 'react';
import { LoaderRequest, Manifest } from '../types';
export type CatchAllServerProps = {
    requestInfo: LoaderRequest;
    manifest: Manifest;
    kiwi: string;
};
export default function CatchAllServer({ requestInfo, manifest, kiwi }: CatchAllServerProps): Promise<React.JSX.Element | null>;
