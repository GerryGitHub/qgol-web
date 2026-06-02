import { useEffect, type ReactNode } from 'react';
import { setupInterceptors } from './interceptors';
import { configureApi } from './config';

interface Props {
  children: ReactNode;
}

export function ApiProvider({ children }: Props) {
  useEffect(() => {
    configureApi();
    setupInterceptors();
  }, []);

  return <>{children}</>;
}
