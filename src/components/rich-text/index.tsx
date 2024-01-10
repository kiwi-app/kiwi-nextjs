// types
export interface RichText extends String {}

// components
export interface RichTextComponentProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: RichText;
}

export function RichTextComponent({ text, ...props }: RichTextComponentProps) {
  return <div dangerouslySetInnerHTML={{ __html: text }} {...props} />;
}
