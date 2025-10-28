import ErpProtectedLayout from './ErpProtectedLayout';

import type { ReactNode } from 'react';

export default function ErpAppLayout({ children }: { children: ReactNode }) {
  return <ErpProtectedLayout>{children}</ErpProtectedLayout>;
}
