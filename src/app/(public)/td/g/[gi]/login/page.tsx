'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';

import { getAccessToken } from '@/api';
import { signIn } from '@/api/auth';
import { getGigwan } from '@/api/gigwan';
import ProgressIcon from '@/components/icons/Progress';
import { Button, Textfield } from '@/design';

import * as styles from './page.style.css';

export default function GigwanLoginPage() {
  const router = useRouter();
  const params = useParams<{ gi: string }>();
  const gi = params?.gi;
  const [gigwanName, setGigwanName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [initialError, setInitialError] = useState('');
  const [formError, setFormError] = useState('');
  const [loginLocked, setLoginLocked] = useState(false);

  useEffect(() => {
    if (!gi) {
      router.replace('/td/g');
      return;
    }

    let isMounted = true;
    const fetchGigwan = async () => {
      try {
        const gigwan = await getGigwan(gi);
        if (isMounted) {
          setGigwanName(gigwan.name);
        }
      } catch (error) {
        if (isMounted) {
          setInitialError('기관 정보를 불러오지 못했습니다. 다시 시도해주세요.');
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchGigwan();

    return () => {
      isMounted = false;
    };
  }, [gi, router]);

  useEffect(() => {
    if (!gi) return;

    const token = getAccessToken();
    if (token) {
      router.replace(`/td/np/gis/${gi}/manage/home/dv`);
    }
  }, [gi, router]);

  const handleIdChange = useCallback((value: string) => {
    setId(value.replace(/\s/g, ''));
    if (formError) setFormError('');
    if (loginLocked) setLoginLocked(false);
  }, [formError, loginLocked]);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (formError) setFormError('');
    if (loginLocked) setLoginLocked(false);
  }, [formError, loginLocked]);

  const canSubmit = useMemo(() => {
    if (loginLocked || initialError) return false;
    return id.length >= 1 && password.length >= 8 && !isLoading && !isInitialLoading;
  }, [id.length, initialError, isLoading, isInitialLoading, loginLocked, password.length]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!gi || !canSubmit) return;

      try {
        setIsLoading(true);
        await signIn({ id, password, gigwanNanoId: gi });
        router.replace(`/td/np/gis/${gi}/manage/home/dv`);
      } catch (error) {
        setFormError('아이디/패스워드가 맞지 않습니다.');
        setLoginLocked(true);
      } finally {
        setIsLoading(false);
      }
    },
    [gi, canSubmit, id, password, router],
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {isInitialLoading ? (
          <p className={styles.loadingMessage}>기관 정보를 불러오는 중입니다...</p>
        ) : (
          <>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>기관 로그인</h1>
              <span className={styles.orgName}>{gigwanName || '기관'}</span>
              <p className={styles.subtitle}>
                {gigwanName || '기관'}({gi})에 로그인 합니다.
              </p>
            </div>
            {initialError && <div className={styles.errorNotice}>{initialError}</div>}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <Textfield
                  label="아이디"
                  placeholder="아이디를 입력하세요"
                  value={id}
                  onValueChange={handleIdChange}
                  rows={1}
                  disabled={isLoading || !!initialError}
                  status={formError ? 'negative' : 'normal'}
                />
                <span className={styles.helper}>아이디는 최소 1자 이상이어야 합니다.</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">
                  패스워드
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={styles.input[formError ? 'error' : 'normal']}
                  placeholder="패스워드를 입력하세요"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading || !!initialError}
                  minLength={8}
                />
                <span className={styles.helper}>패스워드는 8자 이상 입력해주세요.</span>
              </div>
              {formError && <div className={styles.errorNotice}>{formError}</div>}
              <div className={styles.action}>
                <Button type="submit" disabled={!canSubmit}>
                  {isLoading ? (
                    <span className={styles.spinner}>
                      <ProgressIcon className={styles.spinnerIcon} />
                    </span>
                  ) : (
                    '로그인'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
