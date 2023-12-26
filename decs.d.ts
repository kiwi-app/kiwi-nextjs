declare module 'launch-editor' {
  export default function (
    path: string,
    specifiedEditor?: string,
    onErrorCallback?: (filename: string, message?: string) => void | Promise<void>,
  ): void;
}
