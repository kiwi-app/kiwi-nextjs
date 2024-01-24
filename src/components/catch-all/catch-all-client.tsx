import { useState, Suspense, useMemo } from 'react';
import { getLoaderProps, mergeManifests } from '../../helpers';
import { LiveEditorMessage, Page, LoaderRequest, Section, KiwiOptions } from '../../types';
import { usePostMessage } from '../../hooks/use-post-message';

export type CatchAllClientProps = {
  page: Page;
  children: Map<string, JSX.Element>;
  requestInfo: LoaderRequest;
};

export default (options: KiwiOptions) => {
  const manifest = mergeManifests(options);

  return function CatchAllClient({
    page: initialPage,
    requestInfo,
    children,
  }: CatchAllClientProps) {
    const [page, setPage] = useState<Page>(initialPage);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>();
    const [hoveredSectionId, setHoveredSectionId] = useState<string | null>();
    const [useLocalSections, setUseLocalSections] = useState(false);
    const [liveControls, setLiveControls] = useState(true);

    const sectionsMap: Map<string, Section> = useMemo(() => {
      const map: Map<string, Section> = new Map();
      for (const section of page.sections) {
        map.set(section.id, section);
      }

      return map;
    }, [page.sections]);

    const postMessage = usePostMessage(
      (event: MessageEvent<LiveEditorMessage>) => {
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

        if (message.event === 'live-controls') {
          setLiveControls(event.data.data.liveControls);
        }
      },
      [sectionsMap],
    );

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
      <div className="twkn-flex twkn-flex-col twkn-w-full twkn-justify-center">
        {page?.sections?.map((section) => {
          const id = section.id;
          const module = manifest.sections[section.type].module;

          // @ts-ignore
          const SuspenseFallback = module.Loading ? <module.Loading /> : '';

          const Component = module.default;

          if (!Component) return null;
          return (
            <section key={id} id={id} className="twkn-relative">
              {liveControls && (
                <div
                  className={`${
                    [selectedSectionId, hoveredSectionId].includes(id)
                      ? 'twkn-border-2 twkn-border-blue-500 twkn-bg-blue-200/30'
                      : 'twkn-bg-transparent'
                  } twkn-block twkn-absolute twkn-z-50 twkn-w-full twkn-inset-0 twkn-h-full hover:twkn-border-2 hover:twkn-border-blue-500 hover:twkn-bg-blue-200/30 twkn-cursor-pointer`}
                  onMouseLeave={() => {
                    setHoveredSectionId(null);

                    postMessage.send('hover', {
                      sectionId: null,
                    });
                  }}
                  onMouseEnter={() => {
                    setHoveredSectionId(id);

                    postMessage.send('hover', {
                      sectionId: id,
                    });
                  }}
                  onClick={() => {
                    setHoveredSectionId(id);
                    setSelectedSectionId(id);

                    postMessage.send('click', {
                      sectionId: id,
                      section: section,
                    });
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
    );
  };
};
