import { fetchEventSource } from '@microsoft/fetch-event-source';
import React, { useState, useEffect } from 'react';
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

export default (externalManifest: any) =>
  function CatchAllClient({ page: initialPage, requestInfo }: CatchAllClientProps) {
    const [page, setPage] = useState<Page>(initialPage);
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
        if (isInsideIframe) {
          window.removeEventListener('message', onReceiveMessage);
        }
      };
    }, []);

    useEffect(() => {
      if (!initialPage) return;
      if (!process.env.NEXT_PUBLIC_KIWI_ADMIN_URL) console.error('kiwi admin url must be informed');

      fetchEventSource(
        `${process.env.NEXT_PUBLIC_KIWI_ADMIN_URL}/api/sites/${manifest.site}/events?page=${initialPage.path}`,
        {
          headers: {
            'x-api-key': `${process.env.NEXT_PUBLIC_KIWI_API_KEY}`,
          },
          onmessage: (ev) => processEvent(JSON.parse(ev.data) as Page),
        },
      );
    }, [initialPage]);

    const processEvent = (newPage: Page) => {
      useSectionLoaders(newPage);
    };

    const useSectionLoaders = async (newPage: Page) => {
      for (let idx = 0; idx < newPage.sections?.length; idx++) {
        const section = newPage.sections[idx];
        const sectionModule = manifest.sections[section.type];

        newPage.sections[idx].props = await getLoaderProps(
          requestInfo,
          section.props,
          page.sections[idx]?.props || {},
          sectionModule,
          manifest,
        );
      }

      setPage(newPage);
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
