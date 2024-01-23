// types
export interface RichText extends String {}

// components
export interface RichTextComponentProps extends React.HTMLAttributes<HTMLElement> {
  text: RichText;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'small' | 'div';
}

const FIRST_PTAG_OCCURENCE = /<p[^>]*>/;
const LAST_PTAG_OCCURENCE = /<\/p>([^<\/p>]*)$/;

export function RichTextComponent({ text, as, ...props }: RichTextComponentProps) {
  if (!text) return null;

  const textWithoutWrapper = text
    .replace(FIRST_PTAG_OCCURENCE, '')
    .replace(LAST_PTAG_OCCURENCE, '$1');

  const Component = as ?? 'p';
  return <Component dangerouslySetInnerHTML={{ __html: textWithoutWrapper }} {...props} />;
}
