import React from 'react';
import { Page, LoaderRequest } from '../types';
export type CatchAllClientProps = {
    page: Page;
    requestInfo: LoaderRequest;
};
declare const _default: (externalManifest: any) => ({ page: initialPage, requestInfo }: CatchAllClientProps) => React.JSX.Element;
export default _default;
