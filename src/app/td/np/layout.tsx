import { ReactNode } from 'react';

import ErpLayout from './_components/navigation/ErpLayout';

type TdNpLayoutProps = {
  children: ReactNode;
};

export default function TdNpLayout({ children }: TdNpLayoutProps) {
  return <ErpLayout>{children}</ErpLayout>;
}
