import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

const nextConfigs = Array.isArray(next)
    ? next
    : typeof next === 'function'
        ? next()
        : [next];

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'eslint.config.*',   // ← 추가
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // 1) Next.js 권장 규칙
  ...nextConfigs,

  // 2) 규칙/플러그인
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    settings: {
      // ✅ Boolean 대신 객체/문자열로 명시
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }, // ← node: true (X)
        typescript: {
          // "true" 대신 tsconfig 경로 배열/문자열을 전달
          project: ['./tsconfig.json'],        // ← true (X)
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },

  prettier,

];

export default config;
