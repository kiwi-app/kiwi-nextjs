import React from 'react';
import { Manifest, Page } from '../types';
export type CatchAllServerProps = {
    page: Page;
    manifest: Manifest;
};
export default function CatchAllServer({ page, manifest }: CatchAllServerProps): React.JSX.Element;
