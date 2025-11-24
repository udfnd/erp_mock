import { cssObj } from '../../styles';
import type { JojikPermission, HomepageLink } from '@/domain/jojik/api/jojik.schema';
import {
  useJojikQuery,
  useJojikPermissionsQuery,
  useUpdateJojikMutation,
  useDeleteJojikMutation,
} from '@/domain/jojik/api';

import { SingleSelectionPanelContent } from './SingleSelectionPanelContent';

export type SingleSelectionPanelProps = {
  jojikNanoId: string;
  jojikName: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export function SingleSelectionPanel({
  jojikNanoId,
  jojikName,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: jojikDetail, isLoading } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const { data: jojikPermissionsDetail } = useJojikPermissionsQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const updateMutation = useUpdateJojikMutation(jojikNanoId);
  const deleteMutation = useDeleteJojikMutation(jojikNanoId);

  if (isLoading && !jojikDetail) {
    return (
      <>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jojikName}</h2>
          <p css={cssObj.panelSubtitle}>선택한 조직 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 조직 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  const effectiveName = jojikDetail?.name ?? jojikName ?? '';

  return (
    <SingleSelectionPanelContent
      key={`${jojikNanoId}:${effectiveName}`}
      jojikNanoId={jojikNanoId}
      jojikName={effectiveName}
      jojikDetailNanoId={jojikDetail?.nanoId ?? jojikNanoId}
      jaewonsaengLinkRequestUrl={jojikDetail?.jaewonsaengLinkRequestUrl}
      openSangtae={jojikDetail?.openSangtae}
      openFiles={jojikDetail?.openFiles}
      homepageUrl={jojikDetail?.homepageUrl as HomepageLink | null | undefined}
      permissions={jojikPermissionsDetail?.permissions as JojikPermission[] | undefined}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
