export type PortalMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PortalLink = {
  label: string;
  href: string;
};

export type PortalPillar = {
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  source: PortalLink;
};

export type JourneyStep = {
  label: string;
  route?: string;
  summary: string;
  emphasis?: "default" | "gate" | "action" | "warning";
};

export type JourneyLane = {
  title: string;
  summary: string;
  accent: string;
  source: PortalLink;
  steps: JourneyStep[];
};

export type SurfaceCard = {
  name: string;
  route: string;
  role: string;
  note: string;
};

export type IssueCard = {
  title: string;
  detail: string;
};

export type PolicyGroup = {
  title: string;
  summary: string;
  items: string[];
  source: PortalLink;
};

export type BlueprintColumn = {
  title: string;
  summary: string;
  docs: PortalLink[];
};

export type SourceBundle = {
  title: string;
  summary: string;
  links: PortalLink[];
};

export const portalMetrics: PortalMetric[] = [
  {
    label: "온보딩 단계",
    value: "7",
    detail: "PASS부터 제출 전 확인까지 실제 앱 기준 7단계 플로우로 굴러갑니다.",
  },
  {
    label: "노출 탭",
    value: "4",
    detail: "홈 · 오늘의 소개 · 채팅 · 내 정보만 하단에 노출되고 핵심 기능 일부는 숨겨져 있습니다.",
  },
  {
    label: "응답 SLA",
    value: "48h / 24h",
    detail: "인박스 응답은 48시간, 채팅 첫 메시지 및 답장은 24시간 기준으로 닫힙니다.",
  },
  {
    label: "핵심 거버넌스",
    value: "Policy × IA × QA",
    detail: "기획 웹은 제품 원칙, 정보구조, 검증 시나리오를 한 화면에서 같이 보게 설계해야 합니다.",
  },
];

export const productPillars: PortalPillar[] = [
  {
    title: "No Photo",
    summary: "외형이 아니라 문장·신앙 중심의 소개 구조",
    detail:
      "프로필 사진 업로드와 채팅 이미지 전송이 모두 빠져 있고, 태그·말씀·신앙 문답이 제품 첫인상을 담당합니다.",
    tags: ["identity", "faith-first", "text-first"],
    source: {
      label: "현재 제품 PRD",
      href: "/docs/03-mobile/docs/prd-reverse-engineered-current-app/",
    },
  },
  {
    title: "Approval Gate",
    summary: "승인 전에는 핵심 추천 경험 진입 불가",
    detail:
      "로그인 이후에도 바로 메인 경험으로 가지 않고 PASS·온보딩·심사 대기를 거쳐야만 승인 사용자 루프로 진입합니다.",
    tags: ["trust", "review queue", "access control"],
    source: {
      label: "정책 SSOT",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/",
    },
  },
  {
    title: "High Intent Economy",
    summary: "추천·신청·재진입에 비용과 시간 제한 부여",
    detail:
      "추가 추천, LOCKED 카드 열기, 매칭 신청, 보관 연장, 삭제 복구 모두 만나 정책과 연결되어 행동의 가벼움을 억제합니다.",
    tags: ["manna", "paywall", "retention"],
    source: {
      label: "정책 / BM",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#9-만나-결제-광고-정책",
    },
  },
  {
    title: "Manual Trust Layer",
    summary: "운영 심사와 리스크 검토가 제품 안에 존재",
    detail:
      "신고·차단·마스킹·정지·승인 액션이 별도 운영 콘솔과 backlog 흐름을 만들고, 일반 사용자 메뉴와 섞이는 문제까지 IA 이슈가 됩니다.",
    tags: ["ops", "risk", "moderation"],
    source: {
      label: "운영 / IA",
      href: "/docs/03-mobile/docs/ssot/ia-menu-structure/#32-숨김이지만-핵심인-메뉴화면",
    },
  },
];

export const journeyLanes: JourneyLane[] = [
  {
    title: "Applicant Journey",
    summary: "신뢰 확보를 위해 로그인 후에도 바로 메인으로 가지 않는 구조",
    accent: "var(--flow-pink)",
    source: {
      label: "화면 인벤토리",
      href: "/docs/03-mobile/docs/ux-screen-inventory/#11-루트-라우팅-규칙",
    },
    steps: [
      { label: "Splash", route: "/(auth)/splash", summary: "첫 진입 브랜딩 및 초기 분기", emphasis: "default" },
      { label: "Login", route: "/(auth)/login", summary: "Google / Apple SSO 로그인", emphasis: "action" },
      { label: "PASS", route: "/(auth)/ob-01", summary: "본인 인증 없이는 제출 불가", emphasis: "gate" },
      { label: "Basic Info", route: "/(auth)/ob-02", summary: "닉네임, 성별, 교단, 지역 입력", emphasis: "default" },
      { label: "Church", route: "/(auth)/ob-03", summary: "교회 검색 또는 등록 요청 필수", emphasis: "default" },
      { label: "Tags & Faith", route: "/(auth)/ob-05 ~ ob-07", summary: "태그, 말씀/찬양, 신앙 질문 3개 작성", emphasis: "default" },
      { label: "Submit", route: "/(auth)/ob-08", summary: "검토 후 제출하면 UNDER_REVIEW 진입", emphasis: "gate" },
      { label: "Under Review", route: "/(auth)/under-review", summary: "승인 전까지 메인 추천 경험 닫힘", emphasis: "warning" },
    ],
  },
  {
    title: "Approved Member Loop",
    summary: "승인 후에는 탐색→응답→대화→관리 흐름으로 반복되는 구조",
    accent: "var(--flow-blue)",
    source: {
      label: "현재 제품 PRD",
      href: "/docs/03-mobile/docs/prd-reverse-engineered-current-app/#72-승인-후-메인-경험",
    },
    steps: [
      { label: "Home", route: "/(tabs)", summary: "현재는 말씀/공지 허브, 행동 허브 역할은 약함", emphasis: "default" },
      { label: "Reco", route: "/(tabs)/reco", summary: "DAILY DUO 2명 추천 + 추가 추천 유도", emphasis: "action" },
      { label: "Inbox", route: "/(tabs)/inbox", summary: "48시간 내 수락/거절/만료 분기", emphasis: "gate" },
      { label: "Chat", route: "/chat/[chatId]", summary: "수락 후에만 열리고 24시간 SLA로 닫힘", emphasis: "action" },
      { label: "Vault & Shop", route: "/(tabs)/vault · /shop", summary: "재진입과 과금 루프를 붙여 retention을 만듦", emphasis: "default" },
      { label: "Profile & Filters", route: "/(tabs)/settings", summary: "내 정보, 필터, 운영 진입이 한 곳에 몰려 있음", emphasis: "warning" },
    ],
  },
  {
    title: "Operations & Safety Loop",
    summary: "사용자 안전 이슈가 운영 심사 큐와 권한 정책으로 이어지는 구조",
    accent: "var(--flow-gold)",
    source: {
      label: "User Stories / Safety",
      href: "/docs/04-backend/docs/ssot/02-user-stories/#epic-e--safety--commerce",
    },
    steps: [
      { label: "Report / Block", route: "POST /report · POST /block", summary: "프로필/채팅에서 위험 상대 신고 또는 차단", emphasis: "action" },
      { label: "Risk Queue", route: "/admin/review", summary: "HIGH / LOW 리스크 큐 분리 처리", emphasis: "gate" },
      { label: "Action", route: "APPROVE · REJECT · SUSPEND", summary: "운영자 결정이 노출, 채팅, 계정 상태에 직접 영향", emphasis: "warning" },
      { label: "Authority", route: "JWT / Slack workflow", summary: "권한 정책과 Slack moderation workflow가 별도 spec으로 관리됨", emphasis: "default" },
    ],
  },
];

export const visibleSurfaces: SurfaceCard[] = [
  {
    name: "홈",
    route: "`/(tabs)`",
    role: "말씀/공지 허브",
    note: "브랜드 톤은 좋지만 사용자가 ‘다음 행동’을 이해하기 어렵습니다.",
  },
  {
    name: "오늘의 소개",
    route: "`/(tabs)/reco`",
    role: "추천 카드 소비",
    note: "현재 핵심 탐색 화면이며 paywall과 가장 자연스럽게 이어집니다.",
  },
  {
    name: "채팅",
    route: "`/(tabs)/chat`",
    role: "열린 관계 유지",
    note: "수락된 관계만 보이며 SLA 타이머가 경험의 긴장도를 만듭니다.",
  },
  {
    name: "내 정보",
    route: "`/(tabs)/settings`",
    role: "프로필/필터/상점/운영 메뉴",
    note: "사용자 기능과 운영 기능이 동시에 몰려 있어 구조가 무겁습니다.",
  },
];

export const hiddenSurfaces: SurfaceCard[] = [
  {
    name: "인박스",
    route: "`/(tabs)/inbox`",
    role: "응답 허브",
    note: "탭급 중요도인데 발견성이 낮아 유저플로우를 끊습니다.",
  },
  {
    name: "보관함",
    route: "`/(tabs)/vault`",
    role: "재진입 / 복구",
    note: "추천 경험과 가까운데 너무 깊어서 전략 자산처럼 보이지 않습니다.",
  },
  {
    name: "스토어",
    route: "`/shop` + `/(tabs)/shop`",
    role: "과금 / 광고 보상",
    note: "실제 비즈니스 핵심이지만 진입 경로가 중복되고 산재돼 있습니다.",
  },
  {
    name: "상대 프로필",
    route: "`/profile/[targetUuid]`",
    role: "신청 결정 화면",
    note: "추천·인박스·보관함에서 모두 이어지는 핵심 의사결정 화면입니다.",
  },
  {
    name: "운영 심사",
    route: "`/admin/review`",
    role: "운영자 전용 콘솔",
    note: "일반 사용자 메뉴에 섞여 있는 점이 IA 문제로 지적됩니다.",
  },
];

export const iaIssues: IssueCard[] = [
  {
    title: "핵심 기능이 숨겨져 있다",
    detail: "인박스, 보관함, 스토어는 핵심 가치 흐름인데 1차 탐색 구조에서 보이지 않아 행동 전환이 약해집니다.",
  },
  {
    title: "홈이 제품 허브가 아니다",
    detail: "현재 홈은 분위기와 브랜드를 전달하지만, 지금 해야 할 일을 결정하는 행동 허브 역할은 약합니다.",
  },
  {
    title: "내 정보에 너무 많은 책임이 몰려 있다",
    detail: "프로필, 필터, 잔액, 보관함, 운영 메뉴가 한 화면 레벨에 섞여 사용자/운영 경계가 흐려집니다.",
  },
  {
    title: "스토어 진입이 중복된다",
    detail: "`/shop`과 `/(tabs)/shop` 이중 진입이 존재해 정보 구조와 사용성 모두를 흐립니다.",
  },
];

export const menuRecommendations: IssueCard[] = [
  {
    title: "추천 탭 구조",
    detail: "홈 · 소개 · 인박스 · 채팅 · 내 정보의 5개 탭으로 재편해 행동 허브와 응답 허브를 전면 배치합니다.",
  },
  {
    title: "홈의 역할 재정의",
    detail: "‘오늘의 흐름’ 헤더 아래 추천, 인박스, 보관함, 잔액, 신뢰 상태를 함께 보여 행동 우선순위를 분명히 합니다.",
  },
  {
    title: "운영 메뉴 분리",
    detail: "일반 사용자 메뉴와 운영 콘솔 진입을 시각적으로 분리해 역할 혼선을 줄입니다.",
  },
  {
    title: "스토어 경로 단일화",
    detail: "Paywall과 잔액 맥락에 붙는 단일 진입 구조로 정리해 BM 동선을 더 이해하기 쉽게 만듭니다.",
  },
];

export const policyGroups: PolicyGroup[] = [
  {
    title: "Access & Trust",
    summary: "승인 전후 사용자 상태와 접근 가능 경험을 명확히 갈라놓는 기본 정책",
    items: [
      "APPROVED만 추천·매칭·광고 보상 핵심 기능 사용 가능",
      "UNDER_REVIEW는 심사 대기 화면으로 강제 이동",
      "PASS 미검증 상태에서는 onboarding submit 불가",
    ],
    source: {
      label: "사용자 상태 정책",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#3-사용자-상태-정책",
    },
  },
  {
    title: "Recommendation Economy",
    summary: "추천 카드와 보관함을 비용/시간 구조로 통제하는 상품성 정책",
    items: [
      "기본 추천 2명, 추가 추천 +2명은 만나 1",
      "48시간 미열람 카드는 LOCKED, 7일 경과 시 DELETED",
      "보관 연장 3일 / 최대 2회 / 비용 1, 삭제 복구는 주 2회 / 비용 2",
    ],
    source: {
      label: "추천/보관함 정책",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#5-추천카드-정책",
    },
  },
  {
    title: "Match & Chat SLA",
    summary: "응답 및 대화 시간을 강제해 의도 있는 관계만 남기려는 정책",
    items: [
      "매칭 요청은 PENDING만 생성, 48시간 무응답 시 전액 환급",
      "채팅방은 ACCEPTED 매칭 시점에만 생성",
      "첫 메시지 24시간, 마지막 meaningful 메시지 이후 답장 24시간",
    ],
    source: {
      label: "매칭 / 채팅 정책",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#7-매칭-정책",
    },
  },
  {
    title: "Commerce & Reward",
    summary: "보상형 광고와 유료 구매를 결합한 재화 정책",
    items: [
      "보유 재화는 bonus → paid 순으로 소진",
      "광고 보상은 APPROVED만 가능, 10분 쿨다운, 일 3회 상한",
      "INSUFFICIENT_MANNA 발생 시 paywall로 보내고 액션 자동 재실행",
    ],
    source: {
      label: "만나 / 결제 / 광고 정책",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#9-만나-결제-광고-정책",
    },
  },
  {
    title: "Safety & Ops",
    summary: "차단, 신고, 리스크 큐, 운영 권한을 하나의 안전 계층으로 묶는 정책",
    items: [
      "프로필 신고, 채팅 신고, 사용자 차단 지원",
      "HIGH / LOW 리스크 큐 분리, detail + highlight + audit log 제공",
      "APPROVE / REJECT / SUSPEND / UNSUSPEND / MASK_TOGGLE 액션 제공",
    ],
    source: {
      label: "안전/운영 정책",
      href: "/docs/03-mobile/docs/ssot/product-policy-spec/#10-안전운영-정책",
    },
  },
  {
    title: "Contract Alignment",
    summary: "기획과 서버 계약이 맞물리는 acceptance 흐름",
    items: [
      "POST /match/request 는 chat room 없이 PENDING만 생성",
      "POST /match/accept 시에만 chat room 생성 및 match.accepted 이벤트 발행",
      "WebSocket /ws/chat 이 공식 메시지 전송 계약",
    ],
    source: {
      label: "Backend user stories",
      href: "/docs/04-backend/docs/ssot/02-user-stories/",
    },
  },
];

export const blueprintColumns: BlueprintColumn[] = [
  {
    title: "Product Backbone",
    summary: "현재 제품의 비가역 원칙과 범위를 정의하는 문서 묶음",
    docs: [
      { label: "Unified Product Brief", href: "/docs/01-product/unified-product-brief/" },
      { label: "현재 제품 PRD", href: "/docs/03-mobile/docs/prd-reverse-engineered-current-app/" },
      { label: "로드맵", href: "/docs/03-mobile/docs/roadmap-next/" },
    ],
  },
  {
    title: "Experience Blueprint",
    summary: "유저플로우, 화면 구조, IA를 결정하는 문서 묶음",
    docs: [
      { label: "화면 인벤토리", href: "/docs/03-mobile/docs/ux-screen-inventory/" },
      { label: "IA / Menu Structure", href: "/docs/03-mobile/docs/ssot/ia-menu-structure/" },
      { label: "Home Redesign Strategy", href: "/docs/03-mobile/docs/ssot/home-redesign-and-copy-strategy/" },
    ],
  },
  {
    title: "System Contract",
    summary: "RN과 서버가 실제로 맞춰야 하는 인터페이스와 상태 전이 문서 묶음",
    docs: [
      { label: "Backend SSOT Index", href: "/docs/04-backend/docs/ssot/README/" },
      { label: "User Stories", href: "/docs/04-backend/docs/ssot/02-user-stories/" },
      { label: "OpenSpec Main Specs", href: "/docs/04-backend/openspec/specs/" },
    ],
  },
  {
    title: "Validation & Change",
    summary: "QA 기준과 활성 변경안을 통해 실행 우선순위를 통제하는 문서 묶음",
    docs: [
      { label: "QA Docs", href: "/docs/05-qa/README/" },
      { label: "Test Scenarios", href: "/docs/04-backend/docs/ssot/08-test-scenarios/" },
      { label: "Active Changes", href: "/docs/06-active-changes/README/" },
    ],
  },
];

export const sourceBundles: SourceBundle[] = [
  {
    title: "User Flow Sources",
    summary: "실제 라우팅과 화면 전환을 확인하는 핵심 근거 문서",
    links: [
      { label: "현재 제품 PRD", href: "/docs/03-mobile/docs/prd-reverse-engineered-current-app/" },
      { label: "화면 인벤토리", href: "/docs/03-mobile/docs/ux-screen-inventory/" },
      { label: "SSOT Entry", href: "/docs/03-mobile/docs/SSOT/" },
    ],
  },
  {
    title: "IA / Menu Sources",
    summary: "탭, 숨김 라우트, 구조 개편 판단의 기준이 되는 문서",
    links: [
      { label: "IA / Menu Structure", href: "/docs/03-mobile/docs/ssot/ia-menu-structure/" },
      { label: "Home Wireframe", href: "/docs/03-mobile/docs/ssot/home-wireframe-spec/" },
      { label: "Implementation Tickets", href: "/docs/03-mobile/docs/ssot/implementation-ticket-breakdown/" },
    ],
  },
  {
    title: "Policy / Contract Sources",
    summary: "기획 정책과 실제 backend contract를 함께 보는 근거 문서",
    links: [
      { label: "Product Policy", href: "/docs/03-mobile/docs/ssot/product-policy-spec/" },
      { label: "Backend User Stories", href: "/docs/04-backend/docs/ssot/02-user-stories/" },
      { label: "Frontend Handoff", href: "/docs/04-backend/docs/ssot/07-frontend-handoff/" },
    ],
  },
  {
    title: "Execution / Governance",
    summary: "변경 우선순위, QA, 활성 OpenSpec을 추적하는 묶음",
    links: [
      { label: "Roadmap", href: "/docs/03-mobile/docs/roadmap-next/" },
      { label: "QA Docs", href: "/docs/05-qa/README/" },
      { label: "Active Changes", href: "/docs/06-active-changes/README/" },
    ],
  },
];
