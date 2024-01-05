import { getLoaderProps } from '../../helpers';
import { ExportedModule, LoaderRequest, Manifest, Section } from '../../types';

export default async function SuspenseSection({
  request,
  section,
  sectionModule,
  manifest,
  isLive,
}: {
  request: LoaderRequest;
  section: Section;
  sectionModule: ExportedModule;
  manifest: Manifest;
  isLive: boolean;
}) {
  const sectionProps = await getLoaderProps(
    request,
    section.props,
    {},
    sectionModule,
    manifest,
    isLive,
  );

  const Component = sectionModule?.module.default;

  // @ts-ignore
  return <Component {...sectionProps} />;
}
