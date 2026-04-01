export type FlowStep = {
  id: string;
  title: string;
  route: string;
  summary: string;
  screenshot: string;
  interactions: string[];
  outcome: string;
  tone?: "default" | "gate" | "action" | "warning";
};

export type JourneyBoard = {
  id: string;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceHref: string;
  steps: FlowStep[];
};

export type IaItem = {
  id: string;
  title: string;
  role: string;
  summary: string;
  screenshot: string;
  interactions: string[];
  outcome: string;
  tone: "visible" | "hidden" | "core";
};

export const journeyBoards: JourneyBoard[] = [
  {
    id: "applicant",
    title: "Applicant Journey",
    summary: "로그인 이후 바로 메인으로 가지 않고 신뢰 확보를 강제하는 승인 전 흐름",
    sourceLabel: "화면 인벤토리",
    sourceHref: "/docs/03-mobile/docs/ux-screen-inventory/#11-루트-라우팅-규칙",
    steps: [
      {
        id: "login",
        title: "Login",
        route: "`/(auth)/login`",
        summary: "Google/Apple SSO로 진입하지만 아직 메인 경험은 열리지 않습니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/login-screen.png",
        interactions: ["Google 로그인", "Apple 로그인", "상태에 따라 온보딩 / 심사 / 홈 분기"],
        outcome: "로그인 성공 후 auth_status에 따라 온보딩 또는 심사 대기 또는 홈으로 분기",
        tone: "action",
      },
      {
        id: "pass",
        title: "PASS Gate",
        route: "`/(auth)/ob-01`",
        summary: "본인 인증 없이는 onboarding submit이 불가합니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/onboarding-pass-devbuild.png",
        interactions: ["PASS 인증하기", "다음", "미인증 상태면 제출 차단"],
        outcome: "PASS 검증이 완료되어야 onboarding submit 가능",
        tone: "gate",
      },
      {
        id: "basic",
        title: "Basic Info",
        route: "`/(auth)/ob-02`",
        summary: "닉네임, 성별, 교단, 지역 등 최소 신원 정보를 입력합니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/onboarding-basic-screen.png",
        interactions: ["기본 정보 입력", "유효성 검사", "다음"],
        outcome: "최소 신원 데이터 저장 후 교회 등록 단계로 이동",
      },
      {
        id: "church",
        title: "Church Registration",
        route: "`/(auth)/ob-03`",
        summary: "교회 검색 또는 등록 요청이 다음 단계의 전제조건입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/onboarding-church-devbuild.png",
        interactions: ["교회 검색", "등록 요청", "선택 후 다음"],
        outcome: "교회 선택 또는 등록 요청 완료 시 태그 단계로 진행",
      },
      {
        id: "faith",
        title: "Faith Questions",
        route: "`/(auth)/ob-07`",
        summary: "신앙 질문 3개와 150자 이상 답변으로 텍스트 기반 신뢰를 축적합니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/onboarding-qa-devbuild.png",
        interactions: ["답변 작성하기", "이전/다음 질문", "다음"],
        outcome: "3개 문답이 채워지면 제출 전 확인 단계로 이동",
      },
      {
        id: "preview",
        title: "Preview & Submit",
        route: "`/(auth)/ob-08`",
        summary: "제출 후에는 운영 심사 전까지 핵심 경험이 닫힙니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/onboarding-preview-devbuild.png",
        interactions: ["섹션 수정", "프로필 제출하기", "심사 대기 진입"],
        outcome: "제출 시 UNDER_REVIEW 상태로 전이",
        tone: "gate",
      },
      {
        id: "review",
        title: "Under Review",
        route: "`/(auth)/under-review`",
        summary: "승인 전 사용자에게는 추천 루프 대신 심사 대기 상태만 노출됩니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/under-review.png",
        interactions: ["상태 새로고침", "심사 결과 대기", "승인 전 홈 진입 불가"],
        outcome: "운영 승인 전까지 추천 루프 접근 차단",
        tone: "warning",
      },
    ],
  },
  {
    id: "member-loop",
    title: "Approved Member Loop",
    summary: "승인 후에는 탐색→응답→대화→재진입/과금으로 이어지는 구조",
    sourceLabel: "현재 제품 PRD",
    sourceHref: "/docs/03-mobile/docs/prd-reverse-engineered-current-app/#72-승인-후-메인-경험",
    steps: [
      {
        id: "home",
        title: "Home",
        route: "`/(tabs)`",
        summary: "현재는 브랜드 허브에 가깝고 행동 우선순위가 약한 출발점입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/home.png",
        interactions: ["말씀/공지 확인", "당일 상태 인지", "다른 탭으로 이동"],
        outcome: "사용자는 이후 소개·인박스·채팅 루프로 분기",
      },
      {
        id: "reco",
        title: "Reco",
        route: "`/(tabs)/reco`",
        summary: "DAILY DUO와 추가 추천 paywall이 실제 전환 중심입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/reco.png",
        interactions: ["카드 열기", "넘기기", "다음 두 사람 보기"],
        outcome: "프로필 상세 또는 paywall, 인박스 진입 후보를 생성",
        tone: "action",
      },
      {
        id: "inbox",
        title: "Inbox",
        route: "`/(tabs)/inbox`",
        summary: "48시간 내 수락/거절/만료가 결정되는 응답 허브입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/inbox.png",
        interactions: ["수락", "거절", "프로필 보기"],
        outcome: "수락 시 채팅 생성, 거절/만료 시 환급 및 종료",
        tone: "gate",
      },
      {
        id: "chat",
        title: "Chat",
        route: "`/chat/[chatId]`",
        summary: "수락 후에만 열리고 24시간 SLA로 관계를 관리합니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/chat-detail.png",
        interactions: ["메시지 전송", "신고", "차단/나가기"],
        outcome: "24시간 SLA에 따라 대화 유지 또는 종료",
        tone: "action",
      },
      {
        id: "vault",
        title: "Vault",
        route: "`/(tabs)/vault`",
        summary: "보관/복구/연장으로 재진입과 retention을 붙이는 보조 루프입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/vault.png",
        interactions: ["프로필 열기", "보관 늘리기", "다시 보관하기"],
        outcome: "재진입과 복구 액션으로 retention 루프 강화",
      },
      {
        id: "shop",
        title: "Shop",
        route: "`/shop`",
        summary: "만나 충전과 보상형 광고가 핵심 BM인데 표면 구조에서는 너무 깊습니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/shop.png",
        interactions: ["광고 보기", "패키지 구매", "잔액 충전"],
        outcome: "만나 잔액 증가 후 원래 액션 재시도 가능",
        tone: "warning",
      },
    ],
  },
  {
    id: "ops-loop",
    title: "Operations & Safety Loop",
    summary: "신고, 차단, 심사 큐, 운영 액션이 사용자 경험 뒤에 붙는 구조",
    sourceLabel: "Backend User Stories",
    sourceHref: "/docs/04-backend/docs/ssot/02-user-stories/#epic-e--safety--commerce",
    steps: [
      {
        id: "profile",
        title: "Profile Decision",
        route: "`/profile/[targetUuid]`",
        summary: "매칭 신청, 신고, 차단 같은 결정이 모이는 핵심 프로필 화면입니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/profile.png",
        interactions: ["매칭 신청", "신고", "차단"],
        outcome: "신청, 안전 액션, 노출 제거 결정이 이 화면에서 발생",
        tone: "action",
      },
      {
        id: "settings",
        title: "Settings Hub",
        route: "`/(tabs)/settings`",
        summary: "필터, 보관함, 운영 심사 진입이 한 화면에 과도하게 몰려 있습니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/settings.png",
        interactions: ["프로필 수정", "필터 토글", "보관함/운영 진입"],
        outcome: "사용자 설정과 운영 진입이 한 메뉴에서 충돌",
        tone: "warning",
      },
      {
        id: "admin",
        title: "Admin Review",
        route: "`/admin/review`",
        summary: "HIGH/LOW 리스크 큐, 마스킹, 승인/반려/정지 액션을 담당합니다.",
        screenshot: "/asset/03-mobile/docs/runtime-captures/ios/admin.png",
        interactions: ["승인", "반려", "정지/마스킹"],
        outcome: "운영자 판단이 사용자 상태와 노출 규칙을 바꿈",
        tone: "gate",
      },
    ],
  },
];

export const iaBlueprint = {
  sourceLabel: "IA / Menu Structure",
  sourceHref: "/docs/03-mobile/docs/ssot/ia-menu-structure/",
  center: {
    id: "experience-structure",
    title: "Experience Structure",
    role: "브랜드 표면 + 행동 허브 + BM + 운영 레이어",
    summary: "지금 구조의 문제는 콘텐츠와 행동, 사용자 메뉴와 운영 메뉴가 한 구조 안에서 충돌한다는 점입니다.",
    screenshot: "/asset/03-mobile/docs/runtime-captures/ios/home.png",
    interactions: ["브랜드 허브", "행동 허브 재정의 필요", "운영 레이어 분리 필요"],
    outcome: "홈/소개/인박스/채팅/내 정보 재구조화 필요",
    tone: "core" as const,
  },
  visible: [
    {
      id: "tab-home",
      title: "홈",
      role: "말씀/공지 허브",
      summary: "현재 첫 화면이지만 다음 행동을 강하게 지시하지 못합니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/home.png",
      interactions: ["말씀/공지 확인", "상태 파악", "행동 허브 부족"],
      outcome: "브랜드 표면은 유지하지만 행동 허브로 재설계 필요",
      tone: "visible" as const,
    },
    {
      id: "tab-reco",
      title: "오늘의 소개",
      role: "추천 카드 소비",
      summary: "실제 탐색 전환의 중심 화면입니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/reco.png",
      interactions: ["카드 열기", "넘기기", "추가 추천"],
      outcome: "실제 탐색과 전환 중심 화면으로 기능",
      tone: "visible" as const,
    },
    {
      id: "tab-chat",
      title: "채팅",
      role: "열린 관계 유지",
      summary: "수락된 관계만 모아 보여주지만 탐색/응답과는 분리돼 있습니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/chat-list.png",
      interactions: ["채팅방 진입", "최근 대화 확인", "상세 이동"],
      outcome: "수락된 관계 유지용 화면으로만 작동",
      tone: "visible" as const,
    },
    {
      id: "tab-settings",
      title: "내 정보",
      role: "프로필/필터/상점/운영 진입",
      summary: "너무 많은 기능이 한 메뉴에 몰려 있습니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/settings.png",
      interactions: ["프로필 수정", "충전하기", "운영 심사 진입"],
      outcome: "사용자 메뉴와 운영 진입이 동시에 몰리는 구조 부채 발생",
      tone: "visible" as const,
    },
  ],
  hidden: [
    {
      id: "hidden-inbox",
      title: "인박스",
      role: "응답 허브",
      summary: "탭급 중요도인데 숨어 있어 사용자가 흐름을 놓치기 쉽습니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/inbox.png",
      interactions: ["수락", "거절", "보낸 신청 확인"],
      outcome: "응답 허브지만 숨겨져 있어 발견성이 크게 떨어짐",
      tone: "hidden" as const,
    },
    {
      id: "hidden-vault",
      title: "보관함",
      role: "재진입/복구 루프",
      summary: "추천 경험과 가까워야 하는데 너무 깊습니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/vault.png",
      interactions: ["보관 늘리기", "삭제 카드 복구", "프로필 재열람"],
      outcome: "재진입 BM을 담당하지만 IA 상 너무 깊음",
      tone: "hidden" as const,
    },
    {
      id: "hidden-shop",
      title: "스토어",
      role: "과금/광고 보상",
      summary: "실제 BM 핵심인데 접근 구조가 중복되고 흩어져 있습니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/shop.png",
      interactions: ["광고 보상", "패키지 구매", "잔액 증가"],
      outcome: "핵심 BM이지만 진입 경로가 산재",
      tone: "hidden" as const,
    },
    {
      id: "hidden-admin",
      title: "운영 심사",
      role: "운영자 콘솔",
      summary: "사용자 메뉴와 섞여 있어 역할 경계가 흐립니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/admin.png",
      interactions: ["승인", "반려", "정지/마스킹"],
      outcome: "운영 콘솔이 일반 사용자 메뉴 구조 안에 섞임",
      tone: "hidden" as const,
    },
  ],
};

export type OverviewNode = {
  id: string;
  title: string;
  route: string;
  summary: string;
  screenshot: string;
  interactions: string[];
  outcome: string;
  tone: "gate" | "action" | "warning" | "core" | "evidence";
  x: number;
  y: number;
};

export const overviewSystemMap = {
  title: "Executive System Map",
  summary: "GraceLink를 신뢰 게이트, 탐색, 응답, 대화, 재화, 운영 레이어로 읽는 한 장의 구조도",
  sourceLabel: "현재 제품 PRD / 정책 / IA",
  sourceHref: "/docs/01-product/unified-product-brief/",
  nodes: [
    {
      id: "ov-login",
      title: "Trust Gate",
      route: "Login → PASS → Review",
      summary: "승인 전까지 핵심 추천 경험을 닫아두는 신뢰 확보 단계입니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/login-screen.png",
      interactions: ["Google/Apple 로그인", "PASS 인증", "심사 대기 진입"],
      outcome: "승인 전까지 핵심 탐색 루프 차단",
      tone: "gate",
      x: 24,
      y: 210,
    },
    {
      id: "ov-core",
      title: "Core Discovery",
      route: "Reco / Inbox / Chat",
      summary: "추천, 응답, 채팅이 실제 관계 전환의 중심 루프를 구성합니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/reco.png",
      interactions: ["추천 카드 열기", "추가 추천", "프로필 진입"],
      outcome: "탐색과 매칭 후보 생성의 중심 루프",
      tone: "core",
      x: 400,
      y: 120,
    },
    {
      id: "ov-inbox",
      title: "Response Hub",
      route: "Inbox 48h SLA",
      summary: "수락/거절/만료가 48시간 안에 결정되는 응답 허브입니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/inbox.png",
      interactions: ["수락", "거절", "보낸 신청 확인"],
      outcome: "응답 결과가 채팅 생성 여부를 결정",
      tone: "action",
      x: 400,
      y: 420,
    },
    {
      id: "ov-chat",
      title: "Conversation",
      route: "Chat 24h SLA",
      summary: "수락 후에만 열리고 24시간 규칙으로 관계 속도를 관리합니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/chat-detail.png",
      interactions: ["메시지 전송", "신고", "차단/나가기"],
      outcome: "24시간 규칙 하에 관계 유지 또는 종료",
      tone: "action",
      x: 780,
      y: 120,
    },
    {
      id: "ov-shop",
      title: "Economy Layer",
      route: "Vault / Shop / Manna",
      summary: "재진입과 과금, 광고 보상이 retention과 BM을 담당합니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/shop.png",
      interactions: ["광고 보기", "패키지 구매", "보관/복구"],
      outcome: "재화 증가 후 원래 액션 재진입 지원",
      tone: "warning",
      x: 780,
      y: 420,
    },
    {
      id: "ov-admin",
      title: "Ops & Safety",
      route: "Report / Admin Review",
      summary: "신고, 차단, 운영 심사 정책이 제품 안전 계층을 형성합니다.",
      screenshot: "/asset/03-mobile/docs/runtime-captures/ios/admin.png",
      interactions: ["신고", "차단", "승인/반려/정지"],
      outcome: "안전과 운영 판단이 전체 경험을 재정의",
      tone: "warning",
      x: 1160,
      y: 270,
    },
  ],
};
