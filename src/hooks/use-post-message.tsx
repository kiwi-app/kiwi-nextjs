import { useEffect } from 'react';
import { LiveEditorMessage } from '../types';
import { sendSectionClickEvent, sendSectionHoverEvent } from '../helpers';

const actionByEvent = {
  hover: sendSectionHoverEvent,
  click: sendSectionClickEvent,
};

export function usePostMessage(
  onReceiveMessage: (event: MessageEvent<LiveEditorMessage>) => void,
  dependencies: unknown[],
) {
  useEffect(() => {
    let isInsideIframe = false;

    try {
      isInsideIframe = window.self !== window.top;
    } catch (e) {}

    if (isInsideIframe) {
      window.addEventListener('message', onReceiveMessage);
    }

    return () => {
      if (isInsideIframe) {
        window.removeEventListener('message', onReceiveMessage);
      }
    };
  }, dependencies);

  const send = (event: 'click' | 'hover', data: any) => {
    const action = actionByEvent[event];

    action(window.parent, data);
  };

  return {
    send,
  };
}
