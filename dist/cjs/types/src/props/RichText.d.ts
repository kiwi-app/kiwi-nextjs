import React from 'react';
export interface RichText extends String {
}
export interface RichTextComponentProps extends React.HTMLAttributes<HTMLParagraphElement> {
    text: RichText;
}
export declare function RichTextComponent({ text, ...props }: RichTextComponentProps): React.JSX.Element;
