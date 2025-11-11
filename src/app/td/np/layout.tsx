import { ReactNode } from 'react';
import { NavigationFrame } from './NavigationFrame';

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function NpPrimaryNavigation({ children }: AuthenticatedLayoutProps) {
  return <NavigationFrame>{children}</NavigationFrame>;
}
