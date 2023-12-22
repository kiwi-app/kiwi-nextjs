import React from 'react';
import { cookies, headers } from 'next/headers';
import { mergeManifestSections } from '../helpers';
import CatchAllLive from './CatchAllLive';
import CatchAllServer from './CatchAllServer';
import { LoaderRequest } from '../types';

export type CatchAllProps = { params: { kiwi: string[] } };

export default function KiwiCatchAll(manifest: any, live: boolean = false) {
  return function CatchAll({ params: { kiwi } }: CatchAllProps) {
    const mergedManifest = mergeManifestSections(manifest);
    let requestInfo: LoaderRequest = {
      cookies: {},
      headers: {},
    };

    console.log('kiwi ->', kiwi);

    if (!live) {
      cookies()
        .getAll()
        .forEach(({ value, name }) => {
          requestInfo.cookies![name] = value;
        });

      headers().forEach((value, key, _) => {
        requestInfo.headers![key] = value;
      });
    }

    if (live) return <CatchAllLive requestInfo={requestInfo} manifest={mergedManifest} />;
    return (
      <CatchAllServer requestInfo={requestInfo} manifest={mergedManifest} kiwi={kiwi.join('/')} />
    );
  };
}
