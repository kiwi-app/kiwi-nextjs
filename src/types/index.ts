export type Page = {
  id: string;
  siteId: string;
  name: string;
  path: string;
  updatedAt: Date;
  sections: Section[];
};

export type LiveEditorMessage = {
  type: string;
  event: 'hover-section' | 'click-section' | 'remove-section' | 'page-update';
  data: { [key: string]: any };
};

export const primitiveTypes = ['string', 'symbol', 'bigint', 'number', 'boolean'] as const;

export type ObjectSchema = {
  type: 'object';
  name: string;
  description?: string;
  properties?: SchemaProperty[];
  required?: string[];
};

export type ArraySchema = {
  type: 'array';
  name: string;
  items: { type: (typeof primitiveTypes)[number] } | SchemaProperty;
  description?: string;
};

export type PrimitiveSchema = {
  type: (typeof primitiveTypes)[number];
  name: string;
  description?: string;
};

export type CustomSchema = {
  type: 'RichText';
  name: string;
  description?: string;
};

export type SchemaProperty = ObjectSchema | ArraySchema | PrimitiveSchema | CustomSchema;

export type Schema = {
  properties: SchemaProperty[];
  required: string[];
  type: string;
  propsFromLoaderRequest?: boolean;
};

export type Section = {
  id: string;
  type: string;
  props: { [key: string]: any };
  schema: { component: Schema; loader?: Schema };
};

export type ExportedModule = {
  module: {
    default: JSX.Element | Function;
    Loading?: JSX.Element | Function;
    Loader?: (req: LoaderRequest, props: any) => Promise<any>;
  };
  schema: { component: Schema; loader?: Schema };
};

export type SearchParams = { [key: string]: string | string[] | undefined };

export type LoaderRequest<T = { [T: string]: string }> = {
  params?: T;
  searchParams?: SearchParams;
  headers?: { [T: string]: string };
  cookies?: { [T: string]: string };
};

export type Manifest = {
  sections: { [S: string]: ExportedModule };
  [B: string]: { [T: string]: ExportedModule };
  // @ts-ignore
  site: string;
  // @ts-ignore
  baseUrl: string;
};
