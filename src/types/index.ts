export type Page = {
  id: string;
  siteId: string;
  name: string;
  path: string;
  updatedAt: Date;
  sections: { type: string; props: { [key: string]: any } }[];
};

export type LiveEditorMessage = {
  type: string;
  event: 'hover-section' | 'click-section' | 'remove-section';
  data: { [key: string]: any };
};

export type SchemaProperty = {
  name: string;
  type: string;
  description?: string;
};

export type Schema = {
  properties: SchemaProperty[];
  required: string[];
  type: string;
  propsFromLoaderRequest?: boolean;
};

export type ExportedModule = {
  module: {
    default: JSX.Element | Function;
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
