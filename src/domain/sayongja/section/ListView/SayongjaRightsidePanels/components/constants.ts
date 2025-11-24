export const HWALSEONG_OPTIONS = [
  { label: '활성', value: 'true' },
  { label: '비활성', value: 'false' },
];

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const PASSWORD_MIN_MESSAGE = '비밀번호는 최소 8자 이상 입력해 주세요. (15자 권장)';
export const PASSWORD_MAX_MESSAGE = '비밀번호는 100자 내로 설정할 수 있어요.';
export const PASSWORD_MISMATCH_HELPER_TEXT = '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.';

export const getPasswordLengthMessages = (value: string) => {
  const length = value.length;
  const messages: string[] = [];

  if (length > 0 && length < PASSWORD_MIN_LENGTH) {
    messages.push(PASSWORD_MIN_MESSAGE);
  }

  if (length > PASSWORD_MAX_LENGTH) {
    messages.push(PASSWORD_MAX_MESSAGE);
  }

  return messages;
};

export const getPasswordHelperText = (value: string) => {
  const messages = getPasswordLengthMessages(value);
  return messages.length ? messages.join('\n') : '';
};

export const getPasswordConfirmHelperText = (password: string, confirm: string) => {
  const messages: string[] = [];

  if (confirm.length > PASSWORD_MAX_LENGTH) {
    messages.push(PASSWORD_MAX_MESSAGE);
  }

  if (password && confirm && password !== confirm) {
    messages.push(PASSWORD_MISMATCH_HELPER_TEXT);
  }

  return messages.length ? messages.join('\n') : '';
};

export const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*';
  const charactersLength = chars.length;
  return Array.from({ length }, () => chars[Math.floor(Math.random() * charactersLength)]).join('');
};
