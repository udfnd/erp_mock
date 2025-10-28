/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false, // ⬅️ 탭 대신 스페이스 사용 (일관성)
  trailingComma: 'all',
  bracketSpacing: true, // 괄호 주위에 공백을 추가하는 옵션 (이미 true 였습니다)
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'ignore',
};

export default config;
