export interface DraftPage extends Page {
  pageId?: string;
  original?: Page;
}

export interface Page {
  id: string;
  siteId: string;
  name: string;
  path: string;
  updatedAt: Date;
  sections: Section[];
}

export interface LiveEditorMessage {
  type: string;
  event: 'hover-section' | 'click-section' | 'remove-section' | 'page-update';
  data: { [key: string]: any };
}

export const primitiveTypes = ['string', 'symbol', 'bigint', 'number', 'boolean'] as const;
export const customTypes = ['RichText'] as const;

export interface ObjectSchema {
  type: 'object';
  name: string;
  description?: string;
  properties?: SchemaProperty[];
  required?: string[];
}

export interface ArraySchema {
  type: 'array';
  name: string;
  items: Partial<SchemaProperty>;
  description?: string;
}

export interface PrimitiveSchema {
  type: (typeof primitiveTypes)[number];
  name: string;
  description?: string;
}

export interface CustomSchema {
  type: 'RichText';
  name: string;
  description?: string;
}

export type SchemaProperty = ObjectSchema | ArraySchema | PrimitiveSchema | CustomSchema;

export interface Schema {
  properties: SchemaProperty[];
  required: string[];
  type: string;
  propsFromLoaderRequest?: boolean;
}

export interface Section {
  id: string;
  type: string;
  props: SectionProps;
  schema: { component: Schema; loader?: Schema };
}

export type SectionProps = { [key: string]: any; _loaderMetadata?: SectionProps };

export interface ExportedModule {
  module: {
    default: JSX.Element | Function;
    Loading?: JSX.Element | Function;
    Loader?: (req: LoaderRequest, props: any) => Promise<any>;
  };
  schema: { component?: Schema; loader?: Schema };
}

export type SearchParams = { [key: string]: string | string[] | undefined };

export interface LoaderRequest<T = { [T: string]: string }> {
  params?: T;
  searchParams?: SearchParams;
  headers?: { [T: string]: string };
  cookies?: { [T: string]: string };
}

export interface KiwiManifest {
  sections: { [S: string]: ExportedModule };
  loaders?: { [S: string]: ExportedModule };
  site: string;
}

export interface KiwiOptions {
  manifest: KiwiManifest;
  externalManifests?: KiwiManifest[];
}

export interface KiwiConfig {
  useRootPage?: boolean;
  manifestImportAlias?: string;
  sectionFileCase?: 'kebab' | 'snake' | 'camel';
}
