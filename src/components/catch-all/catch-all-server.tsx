import { Suspense } from 'react';
import { KiwiManifest, Page } from '../../types';

export type CatchAllServerProps = {
  page: Page;
  manifest: KiwiManifest;
  children: Map<string, JSX.Element>;
};

export default function CatchAllServer({ page, manifest, children }: CatchAllServerProps) {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      {page?.sections?.map((section, idx) => {
        const id = `${section.type}-${idx}`;
        const module = manifest.sections[section.type].module;

        // @ts-ignore
        const SuspenseFallback = module.Loading ? <module.Loading /> : '';

        const Component = children.get(section.id);
        if (!Component) return null;
        return (
          <section key={id} id={id}>
            <Suspense fallback={SuspenseFallback}>{Component}</Suspense>
          </section>
        );
      })}
    </div>
  );
}
