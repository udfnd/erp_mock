'use client';

import React, { useState } from 'react';

import { Textfield, Toggle } from '@/design';

import * as styles from '../page.style.css';

export default function DesignSystemPage() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('사전 입력된 텍스트');
  const [value3, setValue3] = useState('글자 수 제한 테스트');
  const [value4, setValue4] = useState(
    '이것은 높이 제한 텍스트필드입니다. 스크롤이 생성됩니다. 이것은 높이 제한 텍스트필드입니다. 스크롤이 생성됩니다. 이것은 높이 제한 텍스트필드입니다. 스크롤이 생성됩니다. 이것은 높이 제한 텍스트필드입니다. 스크롤이 생성됩니다. ',
  );

  const [toggleActiveMd, setToggleActiveMd] = useState(false);
  const [toggleActiveSm, setToggleActiveSm] = useState(true);

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>디자인 시스템</h1>

      <h2>Textfield</h2>
      <section className={styles.section}>
        <Textfield
          label="기본"
          value={value1}
          onValueChange={setValue1}
          placeholder="텍스트를 입력하세요"
          helperText="이것은 도움말 텍스트입니다."
        />

        <Textfield
          label="필수 항목"
          required
          value={value2}
          onValueChange={setValue2}
          placeholder="텍스트를 입력하세요"
        />

        <Textfield
          label="에러(Negative) 상태"
          status="negative"
          value={value1}
          onValueChange={setValue1}
          placeholder="텍스트를 입력하세요"
          helperText="오류가 발생했습니다. 다시 입력해주세요."
        />

        <Textfield
          label="글자 수 제한 및 버튼"
          value={value3}
          onValueChange={setValue3}
          maxLength={100}
          actionButton="지우기"
          onActionButtonClick={() => setValue3('')}
        />

        <Textfield
          label="높이 제한(Limit) 및 스크롤"
          resize="limit"
          value={value4}
          onValueChange={setValue4}
          maxLength={1000}
        />

        <Textfield
          label="비활성화(Disabled)"
          disabled
          placeholder="입력할 수 없습니다"
          helperText="이 필드는 비활성화되었습니다."
        />
      </section>

      <h2>Toggle</h2>
      <section className={styles.section}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>기본 (md)</label>
          <Toggle active={toggleActiveMd} onChange={setToggleActiveMd} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>작은 (sm)</label>
          <Toggle size="sm" active={toggleActiveSm} onChange={setToggleActiveSm} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>비활성화 (md, active)</label>
          <Toggle active={true} disabled />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>비활성화 (sm, inactive)</label>
          <Toggle size="sm" active={false} disabled />
        </div>
      </section>
    </main>
  );
}
