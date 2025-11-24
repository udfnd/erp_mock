'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState } from 'react';

import { getGigwanName } from '@/domain/gigwan/api';
import { ArrowLgRightIcon, ProgressIcon } from '@/common/icons';
import { Button, Textfield } from '@/common/components';

import { cssObj } from './style';
import { color } from '@/style';

export default function EnterCodePage() {
  const router = useRouter();
  const [state, setState] = useState({
    code: '',
    errorMessage: '',
    isLoading: false,
  });

  const { code, errorMessage, isLoading } = state;

  const handleChange = useCallback((value: string) => {
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setState((prev) => {
      if (prev.code === sanitized && !prev.errorMessage) {
        return prev;
      }

      return {
        ...prev,
        code: sanitized,
        errorMessage: prev.errorMessage ? '' : prev.errorMessage,
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (code.length !== 8 || isLoading) return;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        errorMessage: prev.errorMessage ? '' : prev.errorMessage,
      }));
      try {
        await getGigwanName(code);
        router.push(`/td/g/[gi]/login?code=${code}`);
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('기관 코드 확인 실패', error);
        setState((prev) => {
          const nextErrorMessage = '기관 코드를 확인해주세요.';
          if (prev.errorMessage === nextErrorMessage && !prev.isLoading) {
            return prev;
          }

          return { ...prev, isLoading: false, errorMessage: nextErrorMessage };
        });
      }
    },
    [code, isLoading, router],
  );

  const isButtonDisabled = code.length !== 8 || isLoading;
  const helperText = useMemo(() => {
    if (errorMessage) return errorMessage;
    if (isLoading) return '잠시만 기다려 주세요...';
    return '코드는 8자리 입니다.';
  }, [errorMessage, isLoading]);

  return (
    <div css={cssObj.page}>
      <div css={cssObj.card}>
        <header css={cssObj.header}>
          <h1 css={cssObj.title}>기관 코드를 입력해 주세요.</h1>
          <p css={cssObj.description}>소속된 기관의 코드를 입력하여 티키타를 이용해 보세요.</p>
        </header>
        <form css={cssObj.form} onSubmit={handleSubmit}>
          <Textfield
            singleLine
            placeholder="코드를 입력해 주세요."
            value={code}
            onValueChange={handleChange}
            maxLength={8}
            status={errorMessage ? 'negative' : 'normal'}
            helperText={helperText}
            disabled={isLoading}
          />
          <div css={cssObj.buttonWrapper}>
            <Button
              isFull
              type="submit"
              disabled={isButtonDisabled}
              styleType="solid"
              variant="primary"
              iconRight={<ArrowLgRightIcon width={16} height={16} color={`${color.cgrey300}`} />}
            >
              {isLoading ? <ProgressIcon css={cssObj.spinner} /> : '확인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
