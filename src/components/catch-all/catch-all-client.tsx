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
      <div className="flex flex-col w-full justify-center">
        {page?.sections?.map((section) => {
          const id = section.id;
          const module = manifest.sections[section.type].module;

          // @ts-ignore
          const SuspenseFallback = module.Loading ? <module.Loading /> : '';

          const Component = module.default;

          if (!Component) return null;
          return (
            <section key={id} id={id} className="relative">
              <div
                className={`${
                  [selectedSectionId, hoveredSectionId].includes(id)
                    ? 'border-2 border-blue-500 bg-blue-200/30'
                    : 'bg-transparent'
                } block absolute z-50 w-full inset-0 h-full hover:border-2 hover:border-blue-500 hover:bg-blue-200/30 cursor-pointer`}
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
