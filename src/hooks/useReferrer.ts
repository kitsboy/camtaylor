import { useMemo } from 'react';

export function useReferrer(): string {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') ?? '';
  }, []);
}