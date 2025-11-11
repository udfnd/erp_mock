import { ReactNode } from 'react';
import { PrimaryNav } from '@/global/navigation';

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function NpPrimaryNavigation({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      <PrimaryNav />
      {children}
    </>
  );
}
