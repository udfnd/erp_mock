'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useSignInMutation } from '@/api/auth';
import { useGigwanQuery } from '@/api/gigwan';
import { Progress } from '@/components/icons';
import { Button } from '@/design';
import { useAuth } from '@/state/auth';

import * as styles from './page.style.css';
import LabeledInput from '../../_components/LabeledInput';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code') ?? '';
  const gigwanCode = codeParam.toUpperCase();

  const { state, isReady, isAuthenticated, setAuthState } = useAuth();

  const {
    data: gigwan,
    isError: isGigwanError,
    isLoading: isGigwanLoading,
  } = useGigwanQuery(gigwanCode, { enabled: gigwanCode.length === 8 });

  const { mutateAsync } = useSignInMutation();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const institutionName = gigwan?.name ?? '';

  const subtitle = useMemo(() => {
    if (!institutionName) return `기관 코드 ${gigwanCode}에 로그인 합니다.`;
    return `${institutionName}(${gigwanCode})에 로그인 합니다.`;
  }, [gigwanCode, institutionName]);

  const isFormValid = id.trim().length >= 1 && password.length >= 8;
  const isBusy = isGigwanLoading || isSubmitting;
  const isButtonDisabled = !isFormValid || isBusy || Boolean(loginError);

  const handleIdChange = useCallback(
    (value: string) => {
      setId(value);
      if (loginError) setLoginError('');
    },
    [loginError],
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (loginError) setLoginError('');
    },
    [loginError],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isFormValid || isBusy) return;

      try {
        setIsSubmitting(true);
        const response = await mutateAsync({
          id: id.trim(),
          password,
          gigwanNanoId: gigwanCode,
        });
        setAuthState({
          accessToken: response.accessToken,
          gigwanNanoId: gigwanCode,
          gigwanName: institutionName,
          loginId: id.trim(),
        });
        router.replace(`/td/np/gis/${gigwanCode}/manage/home/dv`);
      } catch (error) {
        console.error('로그인 실패', error);
        setLoginError('아이디/패스워드가 맞지 않습니다.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      gigwanCode,
      id,
      institutionName,
      isBusy,
      isFormValid,
      mutateAsync,
      password,
      router,
      setAuthState,
    ],
  );

  useEffect(() => {
    if (!codeParam || codeParam.length !== 8) {
      router.replace('/td/g');
    }
  }, [codeParam, router]);

  useEffect(() => {
    if (isGigwanError) {
      router.replace('/td/g');
    }
  }, [isGigwanError, router]);

  useEffect(() => {
    if (isReady && isAuthenticated && state.gigwanNanoId) {
      router.replace(`/td/np/gis/${state.gigwanNanoId}/manage/home/dv`);
    }
  }, [isAuthenticated, isReady, router, state.gigwanNanoId]);

  const isRedirecting =
    !codeParam ||
    codeParam.length !== 8 ||
    isGigwanError ||
    (isReady && isAuthenticated && Boolean(state.gigwanNanoId));

  if (isRedirecting) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>기관 로그인</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <LabeledInput
            label="아이디"
            placeholder="아이디를 입력하세요"
            value={id}
            onValueChange={handleIdChange}
            disabled={isBusy}
            autoFocus
            autoComplete="username"
          />
          <LabeledInput
            label="패스워드"
            placeholder="패스워드를 입력하세요"
            type="password"
            value={password}
            onValueChange={handlePasswordChange}
            disabled={isBusy}
            status={loginError ? 'negative' : 'normal'}
            helperText={loginError}
            autoComplete="current-password"
          />
          <div className={styles.buttonWrapper}>
            <Button type="submit" disabled={isButtonDisabled}>
              {isBusy ? <Progress className={styles.spinner} /> : '로그인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
