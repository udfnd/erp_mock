import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const page = css({
  minHeight: '100%',
  display: 'flex',
  gap: '32px',
});

export const card = css({
  background: color.white,
  borderRadius: '8px',
  backgroundColor: color.cgrey10,
  padding: '16px',
  minWidth: '410px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const cardHeader = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '20px',
});

export const cardTitleGroup = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const cardTitle = css([typography.bodyLargeB, { color: color.black }]);

export const cardSubtitle = css([typography.bodySmallR, { color: color.cgrey500 }]);

export const cardBody = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const cardFooter = css({
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
});

export const statusText = css([typography.captionR, { color: color.cgrey500 }]);

export const feedback = {
  success: css([typography.captionB, { color: color.blue600 }]),
  error: css([typography.captionB, { color: color.red }]),
} as const;

export const errorText = css([typography.bodySmallR, { color: color.red }]);

export const categorySection = css({
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  background: color.cgrey50,
});

export const categoryHeader = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
});

export const categoryLabel = css([typography.bodySmallM, { color: color.black }]);

export const statusList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const statusItem = css({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const statusInput = css({ flex: 1 });

// 기존 export 들 유지

export const statusValue = css([
  typography.bodyR,
  {
    color: color.black,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
]);

export const statusField = css({
  // 텍스트필드 형태의 컨테이너
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: `${'4px'} ${'8px'}`,
  border: `1px solid ${color.cgrey200}`,
  borderRadius: '8px',
  background: color.white,
  transition: 'border-color 120ms ease',
  selectors: {
    '&:hover': { borderColor: color.cgrey300 },
    '&:focus-within': { borderColor: color.blue600 },
  },
});

export const statusInputField = css([
  typography.bodyR,
  {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: color.black,
    selectors: {
      '&::placeholder': { color: color.cgrey400 },
    },
    minWidth: 0, // 긴 텍스트 줄바꿈/축소 대응
  },
]);

export const statusActions = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginLeft: '8px',
});

export const addButtonWrapper = css({
  display: 'flex',
  justifyContent: 'flex-start',
});
