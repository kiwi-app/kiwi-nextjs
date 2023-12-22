import React from 'react';
import { cookies, headers } from 'next/headers';
import { getLoaderProps, getPageConfig, mergeManifestSections } from '../helpers';
import CatchAllLive from './CatchAllLive';
import CatchAllServer from './CatchAllServer';
import { LoaderRequest } from '../types';

export type CatchAllProps = { params: { kiwi: string[] } };

export default function KiwiCatchAll(manifest: any, live: boolean = false) {
  return async function CatchAll({ params: { kiwi } }: CatchAllProps) {
    const mergedManifest = mergeManifestSections(manifest);
    let requestInfo: LoaderRequest = {
      cookies: {},
      headers: {},
    };

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

    const page = await getPageConfig(manifest.site, kiwi.join('/'));
    if (!page) return null;

    for (let idx = 0; idx < page.sections?.length; idx++) {
      const section = page.sections[idx];
      const sectionModule = manifest.sections[section.type];

      page.sections[idx].props = await getLoaderProps(
        requestInfo,
        section.props,
        sectionModule,
        manifest,
      );
    }

    console.log('page', page);

    if (live) return <CatchAllLive requestInfo={requestInfo} manifest={mergedManifest} />;
    return <CatchAllServer page={page} manifest={mergedManifest} />;
  };
}
