import { Manifest, LiveEditorMessage, Page, ExportedModule, LoaderRequest } from '../types';
import internalManifest from '../../manifest';

const { NEXT_PUBLIC_KIWI_ADMIN_URL, NEXT_PUBLIC_KIWI_API_KEY } = process.env;

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

export async function getLoaderProps(
  loaderRequest: LoaderRequest,
  props: { [key: string]: any },
  oldProps: { [key: string]: any },
  sectionModule: ExportedModule,
  manifest: Manifest,
  isLive: boolean,
): Promise<{ [key: string]: any }> {
  const { schema, module } = sectionModule;
  let newProps: any = { ...props };
  delete newProps._test;

  const loaders: Promise<any>[] = [];
  const loadersProps: string[] = [];
  const _loaderMetadata: { [key: string]: any } = {};

  for (const property of schema?.component?.properties || []) {
    const { name, type } = property;
    const loaderReference = manifest.loaders[`@/loaders/${type}`];

    if (loaderReference && props[name]) {
      loadersProps.push(name);
      loaders.push((loaderReference.module.default as Function)(props[name]));
    }
  }

  let hasExportedLoader = false;
  let hasUpdatedLoaderProps = false;
  if (schema.loader && module.Loader) {
    hasExportedLoader = true;
    let loaderProps: { [T: string]: unknown } = {};

    for (const loaderProperty of schema.loader.properties || []) {
      const { name } = loaderProperty;

      const oldLoaderMetadata = oldProps._loaderMetadata ?? {};
      if (newProps[name] !== oldLoaderMetadata[name]) {
        hasUpdatedLoaderProps = true;
      }

      _loaderMetadata[name] = newProps[name];
      delete newProps[name];
      loaderProps[name] = props[name];
    }

    if (hasUpdatedLoaderProps || schema.loader.propsFromLoaderRequest) {
      loaders.push(
        module.Loader(
          isLive
            ? {
                ...loaderRequest,
                params: props._test,
              }
            : loaderRequest,
          loaderProps,
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
        _loaderMetadata,
      };
    }
  }

  if (!hasUpdatedLoaderProps) return { ...oldProps, ...newProps };
  return newProps;
}

export const getPageConfig = async (site: string, page: string): Promise<Page | null> => {
  if (!NEXT_PUBLIC_KIWI_ADMIN_URL) throw 'kiwi admin url must be informed';
  if (!NEXT_PUBLIC_KIWI_API_KEY) throw 'kiwi api key must be informed';

  try {
    const request = await fetch(
      `${NEXT_PUBLIC_KIWI_ADMIN_URL}/api/sites/${site}/page?page=${page.replace('kiwi/live/', '')}`,
      {
        headers: {
          'x-api-key': `${NEXT_PUBLIC_KIWI_API_KEY}`,
        },
      },
    );
    const response = await request.json();

    return response.page;
  } catch (err) {
    return null;
  }
};

export const mergeManifest = (manifest: any): Manifest => {
  return {
    ...manifest,
    sections: {
      ...manifest.sections,
      ...internalManifest.sections,
    },
    loaders: {
      ...manifest.loaders,
      ...internalManifest.loaders,
    },
  };
};

export const sendSectionHoverEvent = (iframeRef: Window, data: EventData) => {
  iframeRef.postMessage(sectionHoverEvent(data), '*');
};

export const sendSectionClickEvent = (iframeRef: Window, data: EventData) => {
  iframeRef.postMessage(sectionClickEvent(data), '*');
};
