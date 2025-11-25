'use client';

import { useParams } from 'next/navigation';

import { cssObj } from './style';
import { BasicSettingsSection, OpenSettingsSection } from '@/domain/jojik/section';

export default function JoManageSettingPage() {
  const { jo } = useParams<{ jo: string }>();
  const rawJo = Array.isArray(jo) ? jo[0] : jo;
  const jojikNanoId = rawJo?.replace(/^jojik-/, '');

  if (!jojikNanoId) return null;

  return (
    <div css={cssObj.page}>
      <BasicSettingsSection jojikNanoId={jojikNanoId} />
      <OpenSettingsSection jojikNanoId={jojikNanoId} />
    </div>
  );
}
