import React, { useState, useEffect, useRef } from 'react';
import {
  getLoaderProps,
  mergeManifest,
  sendSectionClickEvent,
  sendSectionHoverEvent,
} from '../helpers';
import { LiveEditorMessage, Page, LoaderRequest } from '../types';

export type CatchAllClientProps = {
  page: Page;
  requestInfo: LoaderRequest;
};

const KIWI_ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

export default (externalManifest: any) =>
  function CatchAllClient({ page: initialPage, requestInfo }: CatchAllClientProps) {
    const eventSource = useRef<EventSource>();
    const [page, setPage] = useState<Page>();
    const [liveEditing, setLiveEditing] = useState<boolean>(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>();
    const [hoveredSectionId, setHoveredSectionId] = useState<string | null>();
    const manifest = mergeManifest(externalManifest);

    useEffect(() => {
      let isInsideIframe = false;

      try {
        isInsideIframe = window.self !== window.top;
      } catch (e) {}
      if (isInsideIframe) {
        window.addEventListener('message', onReceiveMessage);
        setLiveEditing(true);
      }

      return () => {
        eventSource.current?.close();

        if (isInsideIframe) {
          window.removeEventListener('message', onReceiveMessage);
        }
      };
    }, []);

    useEffect(() => {
      if (!initialPage) return;
      if (!KIWI_ADMIN_URL) console.error('kiwi admin url must be informed');

      eventSource.current = new EventSource(
        `${KIWI_ADMIN_URL}/api/sites/${initialPage.path}/events`,
      );

      eventSource.current.onmessage = processEvent;
      eventSource.current.onerror = () => {
        eventSource.current?.close();
      };

      return () => {
        eventSource.current?.close();
      };
    }, [initialPage]);

    const processEvent = (event: MessageEvent<Page>) => {
      useSectionLoaders(event.data);
    };

    const useSectionLoaders = async (page: Page) => {
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

      setPage(page);
    };

    const onReceiveMessage = (event: MessageEvent<LiveEditorMessage>) => {
      const message = event.data;

      if (message.type !== 'live') return;

      if (message.event === 'hover-section') {
        setHoveredSectionId(event.data.data.sectionId);
      }

      if (message.event === 'click-section') {
        setSelectedSectionId(event.data.data.sectionId);
        setHoveredSectionId(event.data.data.sectionId);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col w-full">
          {page?.sections?.map((section, idx) => {
            const Component = manifest.sections[section.type].module.default;
            const id = `${section.type}-${idx}`;

            if (!Component) return null;
            return (
              <section key={id} id={id} className="relative">
                {liveEditing && (
                  <div
                    className={`${
                      [selectedSectionId, hoveredSectionId].includes(id)
                        ? 'border-2 border-blue-500 bg-blue-200/30'
                        : 'bg-transparent'
                    } block absolute z-50 w-full inset-0 h-full hover:border-2 hover:border-blue-500 hover:bg-blue-200/30 cursor-pointer`}
                    onMouseLeave={() => {
                      setHoveredSectionId(null);
                      sendSectionHoverEvent(window.parent, {
                        sectionId: null,
                      });
                    }}
                    onMouseEnter={() => {
                      setHoveredSectionId(id);
                      sendSectionHoverEvent(window.parent, {
                        sectionId: id,
                      });
                    }}
                    onClick={() => {
                      sendSectionClickEvent(window.parent, {
                        sectionId: id,
                        section: section,
                      });

                      setHoveredSectionId(id);
                      setSelectedSectionId(id);
                    }}
                  />
                )}
                {/* @ts-ignore */}
                <Component {...section.props} />
              </section>
            );
          })}
        </div>
      </div>
    );
  };
