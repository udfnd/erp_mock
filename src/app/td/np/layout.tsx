import { ReactNode } from 'react';

import { ErpLayout } from './navigation';

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return <ErpLayout>{children}</ErpLayout>;
}
