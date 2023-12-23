import React from 'react';
import { Page, LoaderRequest } from '../types';
export type CatchAllClientProps = {
    page: Page;
    requestInfo: LoaderRequest;
};
export default function CatchAllClient({ page: initialPage, requestInfo }: CatchAllClientProps): React.JSX.Element;
