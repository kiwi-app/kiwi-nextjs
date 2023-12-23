import React from 'react';
import { Manifest, Page, LoaderRequest } from '../types';
export type CatchAllClientProps = {
    page: Page;
    requestInfo: LoaderRequest;
};
declare const _default: (externalManifest: Manifest) => ({ page: initialPage, requestInfo }: CatchAllClientProps) => React.JSX.Element;
export default _default;
