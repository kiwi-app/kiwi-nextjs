import { cookies, headers } from 'next/headers';
import { getPageConfig, mergeManifests } from '../../helpers';
import { KiwiOptions, LoaderRequest, SearchParams, Section } from '../../types';
import SuspenseSection from './suspense-section';

export type CatchAllProps = { params: { kiwi: string[] }; searchParams: SearchParams };

export default function KiwiCatchAll(
  options: KiwiOptions,
  ClientComponent: any,
  ServerComponent: any,
) {
  return async function CatchAll({ params: { kiwi }, searchParams }: CatchAllProps) {
    const path = kiwi?.join('/') || '';
    const isLive = path.startsWith('kiwi/live');
    const mergedManifest = mergeManifests(options);
    const draftPageId = (searchParams['kiwiDraftId'] as string) ?? '';

    const requestInfo: LoaderRequest = {
      searchParams,
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

    const page = await getPageConfig(mergedManifest.site, {
      page: path.replace(/kiwi\/live(\/*)/g, ''),
      draftPageId,
    });

    if (!page) return null;

    if (page.path.includes(':')) {
      requestInfo.params = {};
      const paths = path.replace('kiwi/live/', '').split('/');
      const pagePaths = page.path.split('/');

      for (let idx = 0; idx < paths.length; idx++) {
        const currentPath = paths[idx];
        const currentPagePath = pagePaths[idx];

        if (currentPagePath.includes(':')) {
          requestInfo.params[currentPagePath.replace(':', '')] = currentPath;
        }
      }
    }

    const children: Map<string, JSX.Element> = new Map();
    for (let idx = 0; idx < page.sections?.length; idx++) {
      const section = page.sections[idx];
      const sectionModule = mergedManifest.sections[section.type];

      if (!sectionModule) continue;

      children.set(
        section.id,
        <SuspenseSection
          isLive={isLive}
          manifest={mergedManifest}
          request={requestInfo}
          section={section as Section}
          sectionModule={sectionModule}
          key={`suspense_${section.type}_${idx}`}
        />,
      );
    }

    const props = {
      page,
      requestInfo,
    };

    if (isLive) return <ClientComponent {...props} children={children} />;
    return <ServerComponent {...props} children={children} manifest={mergedManifest} />;
  };
}
