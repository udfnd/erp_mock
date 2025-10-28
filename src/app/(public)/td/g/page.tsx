'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { getGigwan } from '@/api/gigwan';
import ProgressIcon from '@/components/icons/Progress';
import { Button, Textfield } from '@/design';

import * as styles from './page.style.css';

export default function GigwanCodePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'normal' | 'negative'>('normal');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedCode = useMemo(() => code.trim(), [code]);
  const isComplete = trimmedCode.length === 8;

  const handleChange = useCallback((value: string) => {
    const sanitized = value.replace(/\s+/g, '').slice(0, 8);
    setCode(sanitized);
    if (status === 'negative' && sanitized.length < 8) {
      setStatus('normal');
    }
  }, [status]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isComplete || isLoading) return;

      try {
        setIsLoading(true);
        await getGigwan(trimmedCode);
        router.push(`/td/g/${trimmedCode}/login`);
      } catch (error) {
        setStatus('negative');
      } finally {
        setIsLoading(false);
      }
    },
    [isComplete, isLoading, trimmedCode, router],
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.heading}>기관 코드 입력</h1>
          <p className={styles.description}>
            처음 방문하셨다면 기관에서 전달받은 8자리 코드를 입력해주세요.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <Textfield
              label="기관 코드"
              placeholder="기관 코드를 입력하세요"
              value={code}
              onValueChange={handleChange}
              maxLength={8}
              rows={1}
              status={status}
              disabled={isLoading}
            />
            {status === 'negative' ? (
              <span className={styles.error}>기관 코드를 다시 확인해주세요.</span>
            ) : (
              <span className={styles.helper}>영문 소문자와 숫자로 이루어진 8자리 코드입니다.</span>
            )}
          </div>
          <div className={styles.actions}>
            <Button
              type="submit"
              disabled={!isComplete || isLoading}
              className={styles.button}
            >
              {isLoading ? (
                <span className={styles.spinner}>
                  <ProgressIcon className={styles.spinning} />
                </span>
              ) : (
                '확인'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
