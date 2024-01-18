import {
  KiwiManifest,
  LiveEditorMessage,
  Page,
  ExportedModule,
  LoaderRequest,
  SectionProps,
  KiwiOptions,
  DraftPage,
} from '../types';
import internalManifest from '../manifest';

const {
  KIWI_ADMIN_URL,
  KIWI_API_KEY,
  /* 1 day */
  KIWI_CACHE_TTL = '86400',
} = process.env;

export type EventData = {
  [key: string]: any;
};

const defaultLiveMessage = {
  type: 'live',
};

const sectionClickEvent = (data: EventData): LiveEditorMessage => ({
  ...defaultLiveMessage,
  event: 'click-section',
  data,
});

const sectionHoverEvent = (data: EventData): LiveEditorMessage => ({
  ...defaultLiveMessage,
  event: 'hover-section',
  data,
});

const objectIsEqual = (obj1: { [key: string]: any }, obj2: { [key: string]: any }) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export async function getLoaderProps(
  loaderRequest: LoaderRequest,
  props: SectionProps,
  oldProps: SectionProps,
  sectionModule: ExportedModule,
  manifest: KiwiManifest,
  isLive: boolean,
): Promise<SectionProps> {
  const { schema, module } = sectionModule;
  let newProps: SectionProps = { ...props };
  delete newProps._test;

  const loaders: Promise<any>[] = [];
  const loadersProps: string[] = [];

  if (manifest.loaders) {
    for (const property of schema?.component?.properties || []) {
      const { name, type } = property;
      const loaderReference = manifest.loaders[`@/loaders/${type}`];

      if (loaderReference && props[name]) {
        loadersProps.push(name);
        loaders.push((loaderReference.module.default as Function)(props[name]));
      }
    }
  }

  let hasExportedLoader = false;
  let hasUpdatedLoaderProps = false;
  if (schema.loader && module.Loader) {
    const oldLoaderMetadata = oldProps._loaderMetadata ?? {};
    const newLoaderMedata = newProps._loaderMetadata ?? {};

    hasExportedLoader = true;
    hasUpdatedLoaderProps = !objectIsEqual(newLoaderMedata, oldLoaderMetadata);
    if (hasUpdatedLoaderProps || schema.loader?.propsFromLoaderRequest) {
      loaders.push(
        module.Loader(
          isLive
            ? {
                ...loaderRequest,
                params: props._test,
              }
            : loaderRequest,
          newProps._loaderMetadata,
        ),
      );
    }
  }

  const loadersResponses = await Promise.all(loaders);
  for (let i = 0; i < loadersResponses.length; i++) {
    const propName = loadersProps[i];
    const loaderResponse = loadersResponses[i];

    if (propName) {
      newProps[propName] = loaderResponse;
    } else if (hasExportedLoader) {
      newProps = {
        ...newProps,
        loader: loaderResponse,
      };
    }
  }

  if (!hasUpdatedLoaderProps && hasExportedLoader && oldProps.loader) {
    newProps = {
      ...newProps,
      loader: oldProps.loader,
    };
  }

  return newProps;
}

export const getPageConfig = async (
  site: string,
  options: { page: string; draftPageId: string },
): Promise<Page | null> => {
  if (!KIWI_ADMIN_URL) throw 'kiwi admin url must be informed';
  if (!KIWI_API_KEY) throw 'kiwi api key must be informed';

  const params = new URLSearchParams(options);

  const isDraftPage = (params.get('kiwiDraftId') as string)?.length > 0;
  const cacheConfig: RequestInit = isDraftPage
    ? {
        cache: 'no-cache',
      }
    : {
        // @ts-ignore
        next: {
          revalidate: Number(KIWI_CACHE_TTL),
        },
      };

  try {
    const request = await fetch(`${KIWI_ADMIN_URL}/api/sites/${site}/pages?${params}`, {
      ...cacheConfig,
      headers: {
        'x-api-key': `${KIWI_API_KEY}`,
      },
    });
    const response = await request.json();

    return response.page;
  } catch (err) {
    return null;
  }
};

export const mergeManifests = (options: KiwiOptions): KiwiManifest => {
  const { manifest, externalManifests = [] } = options;

  const allManifests = [...externalManifests, internalManifest];
  const mainManifest: KiwiManifest = {
    ...manifest,
  };

  for (const manifest of allManifests) {
    for (const [key, value] of Object.entries(manifest.sections)) {
      const sectionKey = key.replace('@', `@${manifest.site}`);

      mainManifest.sections[sectionKey] = value;
    }
  }

  return mainManifest;
};

export const sendSectionHoverEvent = (iframeRef: Window, data: EventData) => {
  iframeRef.postMessage(sectionHoverEvent(data), '*');
};

export const sendSectionClickEvent = (iframeRef: Window, data: EventData) => {
  iframeRef.postMessage(sectionClickEvent(data), '*');
};
