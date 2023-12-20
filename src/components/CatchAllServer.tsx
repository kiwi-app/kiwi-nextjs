import React from 'react';
import { getLoaderProps, getPageConfig } from '../helpers';
import { LoaderRequest, Manifest } from '../types';

export type CatchAllServerProps = { requestInfo: LoaderRequest; manifest: Manifest; kiwi: string };

export default async function CatchAllServer({ requestInfo, manifest, kiwi }: CatchAllServerProps) {
  const page = await getPageConfig(manifest.site, kiwi);
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col w-full">
        {page?.sections?.map((section, idx) => {
          const id = `${section.type}-${idx}`;
          const sectionModule = manifest.sections[section.type];
          const Component = sectionModule?.module.default;

          if (!Component) return null;
          return (
            <section key={id} id={id} className="relative">
              {/* @ts-ignore */}
              <Component {...section.props} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
