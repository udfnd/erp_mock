'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';

import { getGigwanName } from '@/domain/gigwan/api';
import { Progress } from '@/common/icons';
import { Button, LabeledInput } from '@/common/components';

import * as styles from './style';

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

  return (
    <div css={styles.page}>
      <div css={styles.card}>
        <header css={styles.header}>
          <h1 css={styles.title}>기관 코드 입력</h1>
          <p css={styles.description}>기관에서 발급 받은 8자리 코드를 입력해주세요.</p>
        </header>
        <form css={styles.form} onSubmit={handleSubmit}>
          <LabeledInput
            autoFocus
            label="기관 코드"
            placeholder="코드 8자리를 입력하세요"
            value={code}
            onValueChange={handleChange}
            maxLength={8}
            status={errorMessage ? 'negative' : 'normal'}
            helperText={errorMessage}
            disabled={isLoading}
            inputMode="text"
            autoComplete="off"
          />
          <div css={styles.buttonWrapper}>
            <Button type="submit" disabled={isButtonDisabled} styleType="solid" variant="primary">
              {isLoading ? <Progress css={styles.spinner} /> : '확인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
