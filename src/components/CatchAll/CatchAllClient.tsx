import { useState, useEffect, Suspense, useMemo } from 'react';
import {
  getLoaderProps,
  mergeManifest,
  sendSectionClickEvent,
  sendSectionHoverEvent,
} from '../../helpers';
import { LiveEditorMessage, Page, LoaderRequest, Section } from '../../types';

export type CatchAllClientProps = {
  page: Page;
  children: Map<string, JSX.Element>;
  requestInfo: LoaderRequest;
};

export default (externalManifest: any) =>
  function CatchAllClient({ page: initialPage, requestInfo, children }: CatchAllClientProps) {
    const [page, setPage] = useState<Page>(initialPage);
    const [liveEditing, setLiveEditing] = useState<boolean>(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>();
    const [hoveredSectionId, setHoveredSectionId] = useState<string | null>();
    const [useLocalSections, setUseLocalSections] = useState(false);
    const manifest = mergeManifest(externalManifest);

    const sectionsMap: Map<string, Section> = useMemo(() => {
      const map: Map<string, Section> = new Map();
      for (const section of page.sections) {
        map.set(section.id, section);
      }

      return map;
    }, [page.sections]);

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

      if (message.event === 'page-update') {
        updatePageWithLoaders(event.data.data.page);
      }
    };

    const updatePageWithLoaders = async (externalPage: Page) => {
      setUseLocalSections(true);

      const newPage = { ...externalPage };

      for (let idx = 0; idx < newPage.sections?.length; idx++) {
        const section = newPage.sections[idx];
        const sectionModule = manifest.sections[section.type];
        const oldSection = sectionsMap.get(section.id);

        newPage.sections[idx].props = await getLoaderProps(
          requestInfo,
          section.props,
          oldSection?.props || {},
          sectionModule,
          manifest,
          true,
        );
      }

      setPage(newPage);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col w-full">
          {page?.sections?.map((section) => {
            const id = section.id;
            const module = manifest.sections[section.type].module;

            // @ts-ignore
            const SuspenseFallback = module.Loading ? <module.Loading /> : '';

            const Component = module.default;

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
                <Suspense fallback={SuspenseFallback}>
                  {
                    // @ts-ignore
                    useLocalSections ? <Component {...section.props} /> : children.get(section.id)
                  }
                </Suspense>
              </section>
            );
          })}
        </div>
      </div>
    );
  };
