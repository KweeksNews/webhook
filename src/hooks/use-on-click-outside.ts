import { MutableRefObject, useEffect } from 'react';

export function useOnClickOutside(ref: MutableRefObject<any>, handler: () => void) {
  useEffect(() => {
    const onClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [ref, handler]);
}
