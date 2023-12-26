import React from 'react';
import { cookies, headers } from 'next/headers';
import { getLoaderProps, getPageConfig, mergeManifest } from '../helpers';
import { LoaderRequest } from '../types';

export type CatchAllProps = { params: { kiwi: string[] } };

export default function KiwiCatchAll(manifest: any, ClientComponent: any, ServerComponent: any) {
  return async function CatchAll({ params: { kiwi } }: CatchAllProps) {
    const path = kiwi.join('/');
    const isLive = path.startsWith('kiwi/live');
    const mergedManifest = mergeManifest(manifest);

    const requestInfo: LoaderRequest = {
      cookies: {},
      headers: {},
    };

    cookies()
      .getAll()
      .forEach(({ value, name }) => {
        requestInfo.cookies![name] = value;
      });

    headers().forEach((value, key, _) => {
      requestInfo.headers![key] = value;
    });

    const page = await getPageConfig(manifest.site, path);
    if (!page) return null;

    for (let idx = 0; idx < page.sections?.length; idx++) {
      const section = page.sections[idx];
      const sectionModule = manifest.sections[section.type];

      page.sections[idx].props = await getLoaderProps(
        requestInfo,
        section.props,
        {},
        sectionModule,
        manifest,
      );
    }

    const props = {
      page,
      requestInfo,
    };

    if (isLive) return <ClientComponent {...props} />;
    return <ServerComponent {...props} manifest={mergedManifest} />;
  };
}
