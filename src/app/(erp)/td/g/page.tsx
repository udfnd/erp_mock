'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';

import { getGigwan } from '@/api/gigwan';
import { Progress } from '@/components/icons';
import { Button } from '@/design';

import LabeledInput from './_components/LabeledInput';
import * as styles from './page.style.css';

export default function EnterCodePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
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
        await getGigwan(code);
        router.push(`/sign-in?code=${code}`);
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
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>기관 코드 입력</h1>
          <p className={styles.description}>기관에서 발급 받은 8자리 코드를 입력해주세요.</p>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <div className={styles.buttonWrapper}>
            <Button type="submit" disabled={isButtonDisabled} styleType="solid" variant="primary">
              {isLoading ? <Progress className={styles.spinner} /> : '확인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

