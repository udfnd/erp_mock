'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { PlusIcon } from '@/common/icons';
import { useCreateSayongjaMutation } from '@/domain/sayongja/api';
import { cssObj } from '../../styles';
import {
  HWALSEONG_OPTIONS,
  generateRandomPassword,
  getPasswordConfirmHelperText,
  getPasswordHelperText,
} from './constants';

export type CreateSayongjaPanelProps = {
  gigwanNanoId: string;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export function CreateSayongjaPanel({
  gigwanNanoId,
  employmentCategoryOptions,
  workTypeOptions,
  onExit,
  onAfterMutation,
}: CreateSayongjaPanelProps) {
  const createMutation = useCreateSayongjaMutation();
  const [name, setName] = useState('');
  const [employedAt, setEmployedAt] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [employmentNanoId, setEmploymentNanoId] = useState('all');
  const [workTypeNanoId, setWorkTypeNanoId] = useState('all');
  const [isHwalseongValue, setIsHwalseongValue] = useState('true');

  const isSaving = createMutation.isPending;
  const formId = 'sayongja-create-form';
  const passwordHelperText = getPasswordHelperText(password);
  const passwordConfirmHelperText = getPasswordConfirmHelperText(password, passwordConfirm);
  const hasPasswordError = Boolean(passwordHelperText);
  const hasPasswordConfirmError = Boolean(passwordConfirmHelperText);

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setPasswordConfirm(generated);
    setGeneratedPassword(generated);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !employedAt || !loginId || !password || password !== passwordConfirm) {
      return;
    }

    await createMutation.mutateAsync({
      name: trimmedName,
      gigwanNanoId,
      employedAt,
      loginId,
      password,
      employmentSangtaeNanoId: employmentNanoId === 'all' ? null : employmentNanoId,
      workTypeSangtaeNanoId: workTypeNanoId === 'all' ? null : workTypeNanoId,
      isHwalseong: isHwalseongValue === 'true',
    });

    setName('');
    setEmployedAt('');
    setLoginId('');
    setPassword('');
    setPasswordConfirm('');
    setEmploymentNanoId('all');
    setWorkTypeNanoId('all');
    setIsHwalseongValue('true');
    onAfterMutation();
    onExit?.();
  };

  const isCreateDisabled =
    isSaving ||
    !name.trim() ||
    !employedAt ||
    !loginId ||
    !password ||
    !passwordConfirm ||
    hasPasswordError ||
    hasPasswordConfirmError;

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>사용자 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>사용자 속성</h3>
          <Textfield
            singleLine
            label="이름"
            placeholder="이름을 입력해 주세요"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
          <Textfield
            singleLine
            label="아이디"
            placeholder="아이디를 입력해 주세요"
            value={loginId}
            onValueChange={setLoginId}
          />
          <Textfield
            singleLine
            type="date"
            label="입사일"
            value={employedAt}
            onValueChange={setEmployedAt}
          />
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>재직 상태</label>
            <select
              css={cssObj.toolbarSelect}
              value={employmentNanoId}
              onChange={(e) => setEmploymentNanoId(e.target.value)}
            >
              {employmentCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>근무 형태</label>
            <select
              css={cssObj.toolbarSelect}
              value={workTypeNanoId}
              onChange={(e) => setWorkTypeNanoId(e.target.value)}
            >
              {workTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>활성 상태</label>
            <select
              css={cssObj.toolbarSelect}
              value={isHwalseongValue}
              onChange={(e) => setIsHwalseongValue(e.target.value)}
            >
              {HWALSEONG_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>초기 비밀번호</h3>
          <Textfield
            singleLine
            type="password"
            label="비밀번호"
            value={password}
            onValueChange={setPassword}
            helperText={passwordHelperText}
            status={hasPasswordError ? 'negative' : 'normal'}
          />
          <Textfield
            singleLine
            type="password"
            label="비밀번호 확인"
            value={passwordConfirm}
            onValueChange={setPasswordConfirm}
            helperText={passwordConfirmHelperText}
            status={hasPasswordConfirmError ? 'negative' : 'normal'}
          />
          <Button variant="assistive" size="small" onClick={handleGeneratePassword}>
            비밀번호 무작위 생성
          </Button>
          {generatedPassword ? (
            <p css={cssObj.generatedPasswordText}>
              생성된 비밀번호: <span>{generatedPassword}</span>
            </p>
          ) : null}
        </div>
        {createMutation.isError && (
          <p css={cssObj.helperText}>
            사용자 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          type="submit"
          size="small"
          isFull
          form={formId}
          iconRight={<PlusIcon />}
          disabled={isCreateDisabled}
        >
          사용자 생성
        </Button>
      </div>
    </>
  );
}
