'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState, useEffect } from 'react';

import { useSignInMutation } from '@/domain/auth/api';
import { useGigwanNameQuery } from '@/domain/gigwan/api';
import { ArrowLgRight, Progress } from '@/common/icons';
import { Button, Textfield } from '@/common/components';
import { useAuth } from '@/global/auth';

import * as styles from './style';
import { color } from '@/style';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gigwanCode = searchParams.get('code') ?? '';

  const { state, isReady, isAuthenticated, setAuthState, setActiveUserId } = useAuth();

  const {
    data: gigwan,
    isError: isGigwanError,
    isLoading: isGigwanLoading,
  } = useGigwanNameQuery(gigwanCode, { enabled: gigwanCode.length === 8 });

  const { mutateAsync } = useSignInMutation();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrorText, setLoginErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const institutionName = gigwan?.name ?? '';

  const title = useMemo(() => {
    if (!institutionName) return '로그인';
    return `${institutionName}`;
  }, [institutionName]);

  const subtitle = useMemo(() => {
    if (!institutionName) return `[${gigwanCode}]에 로그인 합니다.`;
    return `${institutionName} [${gigwanCode}]에 로그인 합니다.`;
  }, [gigwanCode, institutionName]);

  const isFormValid = id.trim().length >= 1 && password.length >= 8;
  const isBusy = isGigwanLoading || isSubmitting;
  const isButtonDisabled = !isFormValid || isBusy || Boolean(loginErrorText);

  const handleIdChange = useCallback(
    (value: string) => {
      setId(value);
      if (loginErrorText) setLoginErrorText('');
    },
    [loginErrorText],
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (loginErrorText) setLoginErrorText('');
    },
    [loginErrorText],
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

        setActiveUserId(response.nanoId);

        setAuthState({
          gigwanNanoId: gigwanCode,
          gigwanName: institutionName,
          loginId: id.trim(),
        });

        router.replace(`/td/np/gis/${gigwanCode}/manage/home/dv`);
      } catch {
        setLoginErrorText('아이디/패스워드가 맞지 않습니다. 다시 한 번 확인해 주세요.');
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
      setActiveUserId,
      setAuthState,
    ],
  );

  useEffect(() => {
    if (!gigwanCode || gigwanCode.length !== 8) {
      router.replace('/td/g');
    }
  }, [gigwanCode, router]);

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
    !gigwanCode ||
    gigwanCode.length !== 8 ||
    isGigwanError ||
    (isReady && isAuthenticated && Boolean(state.gigwanNanoId));

  if (isRedirecting) return null;

  return (
    <div css={styles.page}>
      <div css={styles.card}>
        <header css={styles.header}>
          <h1 css={styles.title}>{title}</h1>
          <p css={styles.subtitle}>{subtitle}</p>
        </header>
        <form css={styles.form} onSubmit={handleSubmit}>
          <div css={styles.inputWrapper}>
            <p>아이디</p>
            <Textfield
              placeholder="아이디를 입력하세요"
              value={id}
              onValueChange={handleIdChange}
              disabled={isBusy}
              autoComplete="username"
              status={loginErrorText ? 'negative' : 'normal'}
              singleLine
            />
          </div>
          <div css={styles.inputWrapper}>
            <p>패스워드</p>
            <Textfield
              placeholder="패스워드를 입력하세요"
              type="password"
              value={password}
              onValueChange={handlePasswordChange}
              disabled={isBusy}
              status={loginErrorText ? 'negative' : 'normal'}
              autoComplete="current-password"
              singleLine
            />
          </div>
          {loginErrorText && <p css={styles.errorText}>{loginErrorText}</p>}
          <div css={styles.buttonWrapper}>
            <Button
              isFull
              type="submit"
              disabled={isButtonDisabled}
              styleType="solid"
              variant="primary"
              iconRight={<ArrowLgRight width={16} height={16} color={`${color.cgrey300}`} />}
            >
              {isBusy ? <Progress css={styles.spinner} /> : '로그인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
