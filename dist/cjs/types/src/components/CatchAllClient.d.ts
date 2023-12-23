import React from 'react';
import { Manifest, Page, LoaderRequest } from '../types';
export type CatchAllClientProps = {
    page: Page;
    requestInfo: LoaderRequest;
    manifest: Manifest;
};
export default function CatchAllClient({ page: initialPage, requestInfo, manifest, }: CatchAllClientProps): React.JSX.Element;
