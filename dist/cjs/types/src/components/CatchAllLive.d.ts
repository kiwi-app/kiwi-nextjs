import React from 'react';
import { Manifest, LoaderRequest } from '../types';
export type CatchAllLiveProps = {
    requestInfo: LoaderRequest;
    manifest: Manifest;
};
export default function CatchAllLive({ requestInfo, manifest }: CatchAllLiveProps): React.JSX.Element | null;
