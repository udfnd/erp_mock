'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState, useEffect } from 'react';

import { useSignInMutation } from '@/domain/auth/api';
import { useGigwanNameQuery } from '@/domain/gigwan/api';
import { ArrowLgRightIcon, ProgressIcon } from '@/common/icons';
import { Button, Textfield } from '@/common/components';
import { useAuth } from '@/global/auth';

import { cssObj } from './style';
import { color } from '@/style';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const gigwanCode = useMemo(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) return codeParam;

    const giParam = (params as { gi?: string | string[] }).gi;
    if (!giParam) return '';

    return typeof giParam === 'string' ? giParam : giParam[0] ?? '';
  }, [params, searchParams]);

  const { state, isReady, isAuthenticated, setAuthState, setActiveUserId } = useAuth();

  const {
    data: gigwan,
    isError: isGigwanError,
    isLoading: isGigwanLoading,
  } = useGigwanNameQuery(gigwanCode, { enabled: gigwanCode.length === 8 });

  const { mutateAsync } = useSignInMutation();

  type SignInFormState = {
    id: string;
    password: string;
    errorText: string;
    isSubmitting: boolean;
  };

  const [formState, setFormState] = useState<SignInFormState>({
    id: '',
    password: '',
    errorText: '',
    isSubmitting: false,
  });

  const { id, password, errorText, isSubmitting } = formState;

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
  const isButtonDisabled = !isFormValid || isBusy || Boolean(errorText);

  const handleIdChange = useCallback((value: string) => {
    setFormState((prev) => {
      if (prev.id === value && !prev.errorText) {
        return prev;
      }
      return {
        ...prev,
        id: value,
        errorText: prev.errorText ? '' : prev.errorText,
      };
    });
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setFormState((prev) => {
      if (prev.password === value && !prev.errorText) {
        return prev;
      }
      return {
        ...prev,
        password: value,
        errorText: prev.errorText ? '' : prev.errorText,
      };
    });
  }, []);

  const setErrorText = useCallback((message: string) => {
    setFormState((prev) => {
      if (prev.errorText === message) {
        return prev;
      }
      return { ...prev, errorText: message };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isFormValid || isBusy) return;

      try {
        setFormState((prev) => ({ ...prev, isSubmitting: true }));
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
        setErrorText('아이디/패스워드가 맞지 않습니다. 다시 한 번 확인해 주세요.');
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
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
      setErrorText,
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
    <div css={cssObj.page}>
      <div css={cssObj.card}>
        <header css={cssObj.header}>
          <h1 css={cssObj.title}>{title}</h1>
          <p css={cssObj.subtitle}>{subtitle}</p>
        </header>
        <form css={cssObj.form} onSubmit={handleSubmit}>
          <div css={cssObj.inputWrapper}>
            <p>아이디</p>
            <Textfield
              placeholder="아이디를 입력하세요"
              value={id}
              onValueChange={handleIdChange}
              disabled={isBusy}
              autoComplete="username"
              status={errorText ? 'negative' : 'normal'}
              singleLine
            />
          </div>
          <div css={cssObj.inputWrapper}>
            <p>패스워드</p>
            <Textfield
              placeholder="패스워드를 입력하세요"
              type="password"
              value={password}
              onValueChange={handlePasswordChange}
              disabled={isBusy}
              status={errorText ? 'negative' : 'normal'}
              autoComplete="current-password"
              singleLine
            />
          </div>
          {errorText && <p css={cssObj.errorText}>{errorText}</p>}
          <div css={cssObj.buttonWrapper}>
            <Button
              isFull
              type="submit"
              disabled={isButtonDisabled}
              styleType="solid"
              variant="primary"
              iconRight={
                <ArrowLgRightIcon
                  width={16}
                  height={16}
                  color={isButtonDisabled ? color.cgrey300 : color.white}
                />
              }
            >
              {isBusy ? <ProgressIcon css={cssObj.spinner} /> : '로그인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
