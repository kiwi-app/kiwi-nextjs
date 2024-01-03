import React from 'react';
import { Manifest, Page } from '../../types';

export type CatchAllServerProps = { page: Page; manifest: Manifest };

export default function CatchAllServer({ page, manifest }: CatchAllServerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col w-full">
        {page?.sections?.map((section, idx) => {
          const id = `${section.type}-${idx}`;
          const sectionModule = manifest.sections[section.type];
          const Component = sectionModule?.module.default;

          if (!Component) return null;
          return (
            <section key={id} id={id}>
              {/* @ts-ignore */}
              <Component {...section.props} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
