import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowRightIcon,
  BookOpenIcon,
  BranchIcon,
  CheckCircleIcon,
  CompassIcon,
  LayersIcon,
  MessageCircleIcon,
  ShieldIcon,
  SparkIcon,
  WalletIcon,
} from "@/components/icons";
import type {
  BlueprintColumn,
  IssueCard,
  JourneyLane,
  PolicyGroup,
  PortalLink,
  PortalMetric,
  PortalPillar,
  SourceBundle,
  SurfaceCard,
} from "@/lib/portal-data";

function SourceLink({ link }: { link: PortalLink }) {
  return (
    <Link className="source-link" href={link.href}>
      <span>{link.label}</span>
      <ArrowRightIcon className="icon" />
    </Link>
  );
}

export function PortalHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section
      className={`portal-hero surface portal-grid ${
        aside ? "portal-grid-hero" : "portal-grid-single"
      }`}
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="portal-title">{title}</h1>
        <p className="portal-lead">{description}</p>
        {actions ? <div className="portal-actions">{actions}</div> : null}
      </div>
      {aside ? <div className="portal-aside surface-muted">{aside}</div> : null}
    </section>
  );
}

export function PortalMiniDiagram({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; detail: string }>;
}) {
  return (
    <div className="mini-diagram">
      <div className="mini-diagram-header">
        <LayersIcon className="icon" />
        <div>
          <h2>{title}</h2>
          <p>핵심 축을 빠르게 읽는 미니 구조도입니다.</p>
        </div>
      </div>
      <div className="mini-diagram-stack">
        {items.map((item, index) => (
          <div className="mini-diagram-node" key={item.label}>
            <span className="mini-diagram-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricStrip({ metrics }: { metrics: PortalMetric[] }) {
  return (
    <section className="portal-metric-grid" aria-label="핵심 제품 지표">
      {metrics.map((metric) => (
        <article className="portal-metric-card surface" key={metric.label}>
          <span className="portal-metric-label">{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function PillarBoard({ pillars }: { pillars: PortalPillar[] }) {
  return (
    <section className="surface portal-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Product Backbone</span>
          <h2>이 서비스가 깨지면 안 되는 뼈대</h2>
        </div>
        <p>단순히 문서를 나열하는 대신, 지금 제품을 지배하는 원칙을 먼저 보게 만듭니다.</p>
      </div>
      <div className="pillar-grid">
        {pillars.map((pillar) => (
          <article className="pillar-card" key={pillar.title}>
            <div className="pillar-card-top">
              <span className="pillar-title">{pillar.title}</span>
              <div className="tag-row">
                {pillar.tags.map((tag) => (
                  <span className="tag-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <strong>{pillar.summary}</strong>
            <p>{pillar.detail}</p>
            <SourceLink link={pillar.source} />
          </article>
        ))}
      </div>
    </section>
  );
}

function JourneyStepCard({ step, index }: { step: JourneyLane["steps"][number]; index: number }) {
  return (
    <div className={`journey-step journey-step-${step.emphasis ?? "default"}`}>
      <div className="journey-step-index">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <strong>{step.label}</strong>
        {step.route ? <code>{step.route}</code> : null}
        <p>{step.summary}</p>
      </div>
    </div>
  );
}

export function JourneyMap({ lanes }: { lanes: JourneyLane[] }) {
  return (
    <section className="surface portal-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">User Flow</span>
          <h2>승인 전/후/운영 흐름을 한 장에서 보는 여정 지도</h2>
        </div>
        <p>로그인부터 운영 심사까지 흐름이 어떻게 이어지는지 구조적으로 보여줍니다.</p>
      </div>
      <div className="journey-lane-stack">
        {lanes.map((lane) => (
          <article className="journey-lane" key={lane.title} style={{ borderColor: lane.accent }}>
            <div className="journey-lane-header">
              <div>
                <span className="journey-lane-title">{lane.title}</span>
                <p>{lane.summary}</p>
              </div>
              <SourceLink link={lane.source} />
            </div>
            <div className="journey-step-row" role="list" aria-label={lane.title}>
              {lane.steps.map((step, index) => (
                <div className="journey-step-cluster" key={`${lane.title}-${step.label}`} role="listitem">
                  <JourneyStepCard step={step} index={index} />
                  {index < lane.steps.length - 1 ? <div className="journey-connector" aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SurfaceGroup({
  title,
  summary,
  items,
  tone,
}: {
  title: string;
  summary: string;
  items: SurfaceCard[];
  tone: "primary" | "muted";
}) {
  return (
    <article className={`surface-group surface-group-${tone}`}>
      <div className="surface-group-header">
        <strong>{title}</strong>
        <p>{summary}</p>
      </div>
      <div className="surface-card-grid">
        {items.map((item) => (
          <article className="surface-map-card" key={`${title}-${item.name}`}>
            <span className="surface-map-name">{item.name}</span>
            <code>{item.route}</code>
            <strong>{item.role}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </article>
  );
}

export function IaBoard({
  visible,
  hidden,
  issues,
  recommendations,
}: {
  visible: SurfaceCard[];
  hidden: SurfaceCard[];
  issues: IssueCard[];
  recommendations: IssueCard[];
}) {
  return (
    <section className="portal-grid portal-grid-2-1">
      <div className="surface portal-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">IA / Menu Structure</span>
            <h2>현재 노출 구조와 숨김 구조를 한 번에 비교</h2>
          </div>
          <p>탭으로 보이는 경험과 실제 핵심인데 숨어 있는 경험을 분리해서 보여줍니다.</p>
        </div>
        <div className="surface-group-stack">
          <SurfaceGroup
            title="Visible Navigation"
            summary="현재 사용자 눈에 먼저 보이는 4개 탭"
            items={visible}
            tone="primary"
          />
          <SurfaceGroup
            title="Hidden but Critical"
            summary="제품 핵심인데 1차 메뉴에 노출되지 않는 라우트"
            items={hidden}
            tone="muted"
          />
        </div>
      </div>
      <div className="side-stack">
        <section className="surface portal-section side-panel">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">Current Friction</span>
              <h2>왜 지금 IA가 답답하게 느껴지는가</h2>
            </div>
          </div>
          <div className="issue-stack">
            {issues.map((issue) => (
              <article className="issue-card" key={issue.title}>
                <strong>{issue.title}</strong>
                <p>{issue.detail}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="surface portal-section side-panel">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">Direction</span>
              <h2>권장 메뉴 구조 방향</h2>
            </div>
          </div>
          <div className="issue-stack recommendation-stack">
            {recommendations.map((issue) => (
              <article className="issue-card issue-card-recommendation" key={issue.title}>
                <strong>{issue.title}</strong>
                <p>{issue.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export function PolicyMatrix({ groups }: { groups: PolicyGroup[] }) {
  return (
    <section className="surface portal-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Policy System</span>
          <h2>정책을 기능 설명이 아니라 운영 규칙 세트로 읽는 보드</h2>
        </div>
        <p>접근 통제, 추천 경제, 채팅 SLA, 안전 정책을 분리해서 하나의 정책 매트릭스로 묶습니다.</p>
      </div>
      <div className="policy-grid">
        {groups.map((group) => (
          <article className="policy-card" key={group.title}>
            <div className="policy-card-top">
              <strong>{group.title}</strong>
              <SourceLink link={group.source} />
            </div>
            <p>{group.summary}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlueprintMap({ columns }: { columns: BlueprintColumn[] }) {
  return (
    <section className="surface portal-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Planning System Map</span>
          <h2>문서가 아니라 기획 시스템으로 보는 구조도</h2>
        </div>
        <p>제품, 경험, 계약, 검증이 어떤 문서 묶음으로 연결되는지 한 번에 이해하도록 설계했습니다.</p>
      </div>
      <div className="blueprint-grid">
        {columns.map((column) => (
          <article className="blueprint-column" key={column.title}>
            <div className="blueprint-column-top">
              <span className="blueprint-column-title">{column.title}</span>
              <p>{column.summary}</p>
            </div>
            <div className="blueprint-link-stack">
              {column.docs.map((doc) => (
                <SourceLink key={`${column.title}-${doc.label}`} link={doc} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SourceBundles({ bundles }: { bundles: SourceBundle[] }) {
  return (
    <section className="surface portal-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Source Packs</span>
          <h2>도식화 뒤의 근거 문서를 묶음으로 여는 영역</h2>
        </div>
        <p>원문은 숨기지 않고, 다만 먼저 구조를 보여주고 필요한 근거를 패키지로 열게 합니다.</p>
      </div>
      <div className="bundle-grid">
        {bundles.map((bundle) => (
          <article className="bundle-card" key={bundle.title}>
            <div className="bundle-card-top">
              <strong>{bundle.title}</strong>
              <p>{bundle.summary}</p>
            </div>
            <div className="bundle-links">
              {bundle.links.map((link) => (
                <SourceLink key={`${bundle.title}-${link.label}`} link={link} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HeroAnswerPanel() {
  return (
    <div className="answer-panel">
      <div className="answer-panel-header">
        <LayersIcon className="icon" />
        <div>
          <h2>이 포털이 바로 답해야 하는 질문</h2>
          <p>문서를 찾는 것보다 먼저, 팀이 같은 구조를 보게 만드는 PM 포털이어야 합니다.</p>
        </div>
      </div>
      <div className="answer-grid">
        <div className="answer-card">
          <CompassIcon className="icon" />
          <strong>User Flow</strong>
          <p>로그인부터 승인, 추천, 인박스, 채팅, 운영 심사까지 어떻게 이어지는가</p>
        </div>
        <div className="answer-card">
          <LayersIcon className="icon" />
          <strong>IA & Menu</strong>
          <p>무엇이 탭에 보이고, 무엇이 숨겨져 있으며, 구조적으로 왜 답답한가</p>
        </div>
        <div className="answer-card">
          <ShieldIcon className="icon" />
          <strong>Policy</strong>
          <p>승인 게이트, SLA, 만나 경제, 운영 안전 규칙 중 절대 깨면 안 되는 것은 무엇인가</p>
        </div>
        <div className="answer-card">
          <BookOpenIcon className="icon" />
          <strong>Source of Truth</strong>
          <p>PRD, IA, 정책, 계약, QA, OpenSpec이 어떤 순서로 연결되는가</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureRouteCards() {
  const routes = [
    {
      href: "/journey",
      title: "Journey Canvas",
      description: "승인 전/후/운영 흐름을 한 장의 여정 지도와 backlog 관점으로 정리",
      icon: <SparkIcon className="icon" />,
    },
    {
      href: "/ia",
      title: "IA / Menu Blueprint",
      description: "노출 탭, 숨김 핵심 라우트, 구조 문제와 개편 방향을 분리해서 정리",
      icon: <CompassIcon className="icon" />,
    },
    {
      href: "/policy",
      title: "Policy Matrix",
      description: "접근 통제, 추천 경제, SLA, 안전 정책을 운영 규칙 세트로 요약",
      icon: <ShieldIcon className="icon" />,
    },
    {
      href: "/docs",
      title: "Source Library",
      description: "원본 markdown과 OpenSpec을 탐색하는 근거 문서 라이브러리",
      icon: <BookOpenIcon className="icon" />,
    },
  ];

  return (
    <section className="portal-route-grid">
      {routes.map((route) => (
        <Link className="portal-route-card surface" href={route.href} key={route.href}>
          <div className="portal-route-card-top">
            {route.icon}
            <ArrowRightIcon className="icon" />
          </div>
          <strong>{route.title}</strong>
          <p>{route.description}</p>
        </Link>
      ))}
    </section>
  );
}

export function NarrativeStrip() {
  const items = [
    {
      title: "Trust before discovery",
      detail: "승인 게이트가 추천보다 앞에 있어서 모든 플로우는 신뢰 확보를 선행 조건으로 가집니다.",
      icon: <ShieldIcon className="icon" />,
    },
    {
      title: "Discovery under constraint",
      detail: "오늘의 소개, 보관함, 매칭 비용, 광고 보상이 하나의 제한적 탐색 경제를 만듭니다.",
      icon: <WalletIcon className="icon" />,
    },
    {
      title: "Response within SLA",
      detail: "48시간 응답, 24시간 채팅 규칙으로 관계의 속도를 정책으로 관리합니다.",
      icon: <MessageCircleIcon className="icon" />,
    },
    {
      title: "Human moderation loop",
      detail: "사용자 경험은 운영 심사 콘솔과 분리될 수 없고, 안전 정책이 별도 레이어로 존재합니다.",
      icon: <BranchIcon className="icon" />,
    },
  ];

  return (
    <section className="surface portal-section narrative-strip">
      <div className="section-heading compact-heading narrative-heading">
        <div>
          <span className="eyebrow">Narrative</span>
          <h2>GraceLink를 한 줄이 아니라 흐름으로 읽기</h2>
        </div>
      </div>
      <div className="narrative-grid">
        {items.map((item) => (
          <article className="narrative-card" key={item.title}>
            <div className="narrative-card-top">
              {item.icon}
              <strong>{item.title}</strong>
            </div>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CompactPolicyHighlights({ groups }: { groups: PolicyGroup[] }) {
  return (
    <section className="surface portal-section compact-policy-panel">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Operational Rules</span>
          <h2>절대 놓치면 안 되는 정책 축</h2>
        </div>
      </div>
      <div className="compact-policy-grid">
        {groups.slice(0, 4).map((group) => (
          <article className="compact-policy-card" key={group.title}>
            <strong>{group.title}</strong>
            <p>{group.summary}</p>
            <ul>
              {group.items.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SectionFooterCta({
  href,
  label,
  title,
  description,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-footer-cta surface-muted">
      <div>
        <span className="eyebrow">{label}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <Link className="button button-primary" href={href}>
        자세히 보기
      </Link>
    </div>
  );
}

export function PortalLegend() {
  const items = [
    { label: "Gate", description: "승인·수락·운영 승인처럼 다음 단계 진입을 막는 지점", className: "journey-step-gate" },
    { label: "Action", description: "사용자가 실제로 돈·시간·의도를 소비하는 단계", className: "journey-step-action" },
    { label: "Warning", description: "IA 부채 또는 운영 리스크가 직접 드러나는 단계", className: "journey-step-warning" },
  ];

  return (
    <div className="legend-row" aria-label="플로우 범례">
      {items.map((item) => (
        <div className="legend-item" key={item.label}>
          <span className={`legend-swatch ${item.className}`} />
          <div>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionSummaryPanel() {
  const cards = [
    {
      title: "Journey first",
      detail: "기획자는 먼저 사용자가 어떤 상태로 진입하고 어디서 막히는지 봐야 합니다.",
    },
    {
      title: "IA is strategy",
      detail: "탭 구조와 숨김 라우트는 UX가 아니라 비즈니스 구조 그 자체입니다.",
    },
    {
      title: "Policy drives revenue",
      detail: "만나 경제와 SLA 정책이 retention, conversion, trust를 동시에 좌우합니다.",
    },
    {
      title: "Docs should explain systems",
      detail: "문서를 나열하는 대신 문서가 담당하는 시스템을 먼저 보여줘야 합니다.",
    },
  ];

  return (
    <section className="portal-summary-grid">
      {cards.map((card) => (
        <article className="portal-summary-card surface-muted" key={card.title}>
          <CheckCircleIcon className="icon" />
          <strong>{card.title}</strong>
          <p>{card.detail}</p>
        </article>
      ))}
    </section>
  );
}
