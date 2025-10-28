import ErpLayout from '@/components/layout/ErpLayout';

import type { ReactNode } from 'react';

export default function ErpAppLayout({ children }: { children: ReactNode }) {
  return <ErpLayout>{children}</ErpLayout>;
}
