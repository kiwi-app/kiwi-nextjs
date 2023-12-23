import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Manifest, Page, ExportedModule, LoaderRequest } from '../types';
export type EventData = {
    [key: string]: any;
};
export declare function getLoaderProps(loaderRequest: LoaderRequest, props: {
    [key: string]: any;
}, sectionModule: ExportedModule, manifest: Manifest): Promise<{
    [key: string]: any;
}>;
export declare const getPageConfig: (site: string, page: string) => Promise<Page | null>;
export declare const mergeManifestSections: (manifest: any) => Manifest;
export declare const sendSectionHoverEvent: (iframeRef: Window, data: EventData) => void;
export declare const sendSectionClickEvent: (iframeRef: Window, data: EventData) => void;
export declare const listenPageChanges: (pageId: string, callback: (payload: RealtimePostgresChangesPayload<Page>) => void) => void;
export declare const isLive: () => boolean;
