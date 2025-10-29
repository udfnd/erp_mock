export type MockGigwan = {
  nanoId: string;
  name: string;
  address: string;
  intro: string;
};

export const mockGigwans: MockGigwan[] = [
  {
    nanoId: 'PLAZMA01',
    name: '플라즈마',
    address: '서울특별시 강남구 테크노로 12',
    intro: '첨단 교육 기술을 연구하고 확산하는 기관입니다.',
  },
  {
    nanoId: 'EDUPLAN',
    name: '에듀플랜',
    address: '부산광역시 해운대구 미래로 98',
    intro: '지역 교육 네트워크를 기반으로 맞춤형 학습 환경을 제공합니다.',
  },
  {
    nanoId: 'NOVA2024',
    name: '노바 스쿨',
    address: '대전광역시 유성구 과학로 42',
    intro: '융합 교육을 통해 창의적인 인재를 양성합니다.',
  },
];

export type MockAccount = {
  id: string;
  password: string;
  gigwanNanoId: string;
  name: string;
};

export const mockAccounts: MockAccount[] = [
  { id: 'admin', password: 'password1', gigwanNanoId: 'PLAZMA01', name: '홍길동' },
  { id: 'manager', password: 'teachita', gigwanNanoId: 'EDUPLAN', name: '김교육' },
  { id: 'nova', password: 'nova2024', gigwanNanoId: 'NOVA2024', name: '최이음' },
];
