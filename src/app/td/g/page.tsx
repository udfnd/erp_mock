'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';

import { getGigwanName } from '@/domain/gigwan/api';
import { ArrowLgRight, Progress } from '@/common/icons';
import { Button, Textfield } from '@/common/components';

import * as styles from './style';
import { color } from '@/style';

export default function EnterCodePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
      setCode((prev) => {
        if (errorMessage && sanitized !== prev) {
          setErrorMessage('');
        }
        return sanitized;
      });
    },
    [errorMessage],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (code.length !== 8 || isLoading) return;

      setIsLoading(true);
      try {
        await getGigwanName(code);
        router.push(`/td/g/[gi]/login?code=${code}`);
      } catch (error) {
        console.error('기관 코드 확인 실패', error);
        setErrorMessage('기관 코드를 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    },
    [code, isLoading, router],
  );

  const isButtonDisabled = code.length !== 8 || isLoading;
  const helperText = () => {
    if (errorMessage) return errorMessage;
    else if (isLoading) return '잠시만 기다려 주세요...';
    else return '코드는 8자리 입니다.';
  };

  return (
    <div css={styles.page}>
      <div css={styles.card}>
        <header css={styles.header}>
          <h1 css={styles.title}>기관 코드를 입력해 주세요.</h1>
          <p css={styles.description}>소속된 기관의 코드를 입력하여 티키타를 이용해 보세요.</p>
        </header>
        <form css={styles.form} onSubmit={handleSubmit}>
          <Textfield
            singleLine
            placeholder="코드를 입력해 주세요."
            value={code}
            onValueChange={handleChange}
            maxLength={8}
            status={errorMessage ? 'negative' : 'normal'}
            helperText={helperText()}
            disabled={isLoading}
          />
          <div css={styles.buttonWrapper}>
            <Button
              isFull
              type="submit"
              disabled={isButtonDisabled}
              styleType="solid"
              variant="primary"
              iconRight={<ArrowLgRight width={16} height={16} color={`${color.cgrey300}`} />}
            >
              {isLoading ? <Progress css={styles.spinner} /> : '확인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
