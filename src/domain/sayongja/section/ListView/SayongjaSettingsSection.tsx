import { useMemo } from 'react';

import { Button } from '@/common/components';
import { useGetSayongjaDetailQuery } from '@/domain/sayongja/api';
import type { SayongjaListItem } from '@/domain/sayongja/api';
import { Plus } from '@/common/icons';

import { sayongjaListViewCss } from './styles';
import type { SayongjaSettingsSectionProps } from './useSayongjaListViewSections';

function EmptyPanel({ onStartCreate }: { onStartCreate: () => void }) {
  return (
    <aside css={sayongjaListViewCss.panel}>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>사용자 설정</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>선택한 사용자의 상세 정보를 확인하세요.</p>
      </div>
      <div css={sayongjaListViewCss.panelBody}>
        <p css={sayongjaListViewCss.helperText}>
          왼쪽 목록에서 사용자를 선택하면 여기서 상세 정보를 확인할 수 있습니다.
        </p>
        <Button variant="secondary" size="medium" iconLeft={<Plus />} onClick={onStartCreate}>
          새 사용자 추가
        </Button>
      </div>
    </aside>
  );
}

function MultipleSelectionPanel({ selected }: { selected: SayongjaListItem[] }) {
  return (
    <aside css={sayongjaListViewCss.panel}>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>다중 선택</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>{selected.length}명의 사용자가 선택되었습니다.</p>
      </div>
      <div css={sayongjaListViewCss.panelBody}>
        <p css={sayongjaListViewCss.helperText}>
          한 명을 선택하면 상세 정보를 확인하거나 수정할 수 있습니다.
        </p>
      </div>
    </aside>
  );
}

function SingleSelectionPanel({
  nanoId,
  isAuthenticated,
}: {
  nanoId: string;
  isAuthenticated: boolean;
}) {
  const { data, isLoading } = useGetSayongjaDetailQuery(nanoId, {
    enabled: isAuthenticated && Boolean(nanoId),
  });

  const items = useMemo(() => {
    if (!data) return [];
    return [
      { label: '이름', value: data.name },
      { label: '입사일', value: data.employedAt },
      { label: '로그인 ID', value: data.loginId },
      { label: '고용 구분', value: data.employmentSangtae?.name ?? '-' },
      { label: '근무 형태', value: data.workTypeSangtae?.name ?? '-' },
      { label: '활성 여부', value: data.isHwalseong ? '활성' : '비활성' },
    ];
  }, [data]);

  return (
    <aside css={sayongjaListViewCss.panel}>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>사용자 상세</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>{data?.name ?? '사용자 정보를 불러오는 중입니다'}</p>
      </div>
      <div css={sayongjaListViewCss.panelBody}>
        {isLoading && <p css={sayongjaListViewCss.helperText}>정보를 불러오는 중입니다...</p>}
        {!isLoading && (
          <ul css={sayongjaListViewCss.detailList}>
            {items.map((item) => (
              <li key={item.label} css={sayongjaListViewCss.detailRow}>
                <span css={sayongjaListViewCss.detailLabel}>{item.label}</span>
                <span css={sayongjaListViewCss.detailValue}>{item.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export function SayongjaSettingsSection({
  gigwanNanoId,
  selectedSayongjas,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: SayongjaSettingsSectionProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={sayongjaListViewCss.panel}>
        <div css={sayongjaListViewCss.panelHeader}>
          <h2 css={sayongjaListViewCss.panelTitle}>기관 선택 필요</h2>
          <p css={sayongjaListViewCss.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={sayongjaListViewCss.panelBody}>
          <p css={sayongjaListViewCss.helperText}>기관 ID가 없으면 사용자 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={sayongjaListViewCss.panel}>
        <div css={sayongjaListViewCss.panelHeader}>
          <h2 css={sayongjaListViewCss.panelTitle}>사용자 생성</h2>
          <p css={sayongjaListViewCss.panelSubtitle}>새로운 사용자를 추가합니다.</p>
        </div>
        <div css={sayongjaListViewCss.panelBody}>
          <p css={sayongjaListViewCss.helperText}>
            생성 기능은 아직 준비 중입니다. 다른 사용자를 선택하거나 취소할 수 있습니다.
          </p>
          <div css={sayongjaListViewCss.panelFooter}>
            <Button size="small" variant="secondary" onClick={onExitCreate}>
              취소
            </Button>
            <Button size="small" onClick={onAfterMutation}>
              새로 고침
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedSayongjas.length === 0) {
    return <EmptyPanel onStartCreate={onStartCreate} />;
  }

  if (selectedSayongjas.length === 1) {
    return (
      <SingleSelectionPanel
        nanoId={selectedSayongjas[0].nanoId}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return <MultipleSelectionPanel selected={selectedSayongjas} />;
}
