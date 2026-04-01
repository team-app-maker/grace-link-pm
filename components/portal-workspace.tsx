"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowRightIcon,
  BookOpenIcon,
  BranchIcon,
  CompassIcon,
  LayersIcon,
  MessageCircleIcon,
  ShieldIcon,
  SparkIcon,
  WalletIcon,
} from "@/components/icons";
import type {
  BlueprintColumn,
  JourneyLane,
  PolicyGroup,
  PortalLink,
  SourceBundle,
  SurfaceCard,
} from "@/lib/portal-data";

function SourceLink({ link }: { link: PortalLink }) {
  return (
    <Link className="workspace-source-link" href={link.href}>
      <span>{link.label}</span>
      <ArrowRightIcon className="icon" />
    </Link>
  );
}

function getStepToneLabel(emphasis: JourneyLane["steps"][number]["emphasis"]) {
  switch (emphasis) {
    case "gate":
      return "Gate";
    case "action":
      return "Action";
    case "warning":
      return "Risk";
    default:
      return "Flow";
  }
}

function getStepToneDescription(emphasis: JourneyLane["steps"][number]["emphasis"]) {
  switch (emphasis) {
    case "gate":
      return "다음 단계 진입 여부를 결정하는 강한 제약 지점입니다.";
    case "action":
      return "사용자가 실제 의도와 비용을 소비하는 중심 행동입니다.";
    case "warning":
      return "구조 부채 또는 운영 리스크가 가장 잘 드러나는 지점입니다.";
    default:
      return "상태 전환과 문맥을 연결하는 기본 흐름 단계입니다.";
  }
}

function countSteps(lane: JourneyLane, emphasis: NonNullable<JourneyLane["steps"][number]["emphasis"]>) {
  return lane.steps.filter((step) => step.emphasis === emphasis).length;
}

export function JourneyExplorer({ lanes }: { lanes: JourneyLane[] }) {
  const [laneIndex, setLaneIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const lane = lanes[laneIndex] ?? lanes[0];
  const step = lane.steps[stepIndex] ?? lane.steps[0];

  return (
    <section className="workspace-card workspace-card-journey surface">
      <div className="workspace-header">
        <div>
          <span className="eyebrow">Interactive Journey</span>
          <h2>user-flow 단위로 나눈 실제 Journey 설계도</h2>
        </div>
        <SourceLink link={lane.source} />
      </div>

      <div className="workspace-tab-row" role="tablist" aria-label="Journey lanes">
        {lanes.map((item, index) => (
          <button
            key={item.title}
            className="workspace-tab"
            type="button"
            data-active={laneIndex === index}
            onClick={() => {
              setLaneIndex(index);
              setStepIndex(0);
            }}
            role="tab"
            aria-selected={laneIndex === index}
          >
            <span>{item.title}</span>
            <small>{item.steps.length} steps</small>
          </button>
        ))}
      </div>

      <div className="workspace-grid workspace-grid-journey">
        <div className="journey-swimlane-board">
          {lanes.map((currentLane, currentLaneIndex) => (
            <article
              key={currentLane.title}
              className="journey-swimlane"
              data-active={laneIndex === currentLaneIndex}
              style={{ borderColor: currentLane.accent }}
            >
              <div className="journey-swimlane-meta">
                <div>
                  <span className="journey-lane-title">{currentLane.title}</span>
                  <p>{currentLane.summary}</p>
                </div>
                <div className="workspace-stats-row">
                  <div className="workspace-stat-pill">
                    <ShieldIcon className="icon" />
                    <span>Gate {countSteps(currentLane, "gate")}</span>
                  </div>
                  <div className="workspace-stat-pill">
                    <SparkIcon className="icon" />
                    <span>Action {countSteps(currentLane, "action")}</span>
                  </div>
                  <div className="workspace-stat-pill">
                    <BranchIcon className="icon" />
                    <span>Risk {countSteps(currentLane, "warning")}</span>
                  </div>
                </div>
              </div>

              <div className="journey-swimlane-track" role="list" aria-label={currentLane.title}>
                {currentLane.steps.map((item, index) => (
                  <div className="journey-swimlane-segment" key={`${currentLane.title}-${item.label}`} role="listitem">
                    <button
                      className="journey-node"
                      type="button"
                      data-active={laneIndex === currentLaneIndex && stepIndex === index}
                      data-tone={item.emphasis ?? "default"}
                      onClick={() => {
                        setLaneIndex(currentLaneIndex);
                        setStepIndex(index);
                      }}
                    >
                      <span className="journey-node-index">{String(index + 1).padStart(2, "0")}</span>
                      <div className="journey-node-body">
                        <span className="journey-node-tone">{getStepToneLabel(item.emphasis)}</span>
                        <strong>{item.label}</strong>
                        {item.route ? <code>{item.route}</code> : null}
                        <p>{item.summary}</p>
                      </div>
                    </button>
                    {index < currentLane.steps.length - 1 ? (
                      <div className="journey-node-arrow" aria-hidden="true">
                        <span />
                        <ArrowRightIcon className="icon" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="workspace-detail-panel surface-muted">
          <span className="workspace-detail-kicker">Selected step</span>
          <h3>{step.label}</h3>
          {step.route ? <code>{step.route}</code> : null}
          <p>{step.summary}</p>
          <div className="workspace-detail-tone" data-tone={step.emphasis ?? "default"}>
            <strong>{getStepToneLabel(step.emphasis)}</strong>
            <p>{getStepToneDescription(step.emphasis)}</p>
          </div>
          <div className="workspace-detail-note">
            <strong>{lane.title}</strong>
            <p>{lane.summary}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SurfaceDetail({ item, tone }: { item: SurfaceCard; tone: "visible" | "hidden" }) {
  return (
    <aside className="workspace-detail-panel surface-muted">
      <span className="workspace-detail-kicker">{tone === "visible" ? "Visible surface" : "Hidden critical surface"}</span>
      <h3>{item.name}</h3>
      <code>{item.route}</code>
      <p>{item.note}</p>
      <div className="workspace-detail-note">
        <strong>{item.role}</strong>
        <p>
          {tone === "visible"
            ? "현재 사용자가 가장 먼저 보는 경험이므로 브랜드와 행동 전환 모두를 책임집니다."
            : "지금 구조에서 사용자 행동의 핵심인데 메뉴 전면에 보이지 않아 구조 부채를 만듭니다."}
        </p>
      </div>
    </aside>
  );
}

export function IaExplorer({
  visible,
  hidden,
  issues,
  recommendations,
}: {
  visible: SurfaceCard[];
  hidden: SurfaceCard[];
  issues: { title: string; detail: string }[];
  recommendations: { title: string; detail: string }[];
}) {
  const [selectedName, setSelectedName] = useState<string>(visible[0]?.name ?? hidden[0]?.name ?? "");
  const allItems = [...visible, ...hidden];
  const selected = allItems.find((item) => item.name === selectedName) ?? allItems[0];
  const selectedTone = hidden.some((item) => item.name === selected?.name) ? "hidden" : "visible";

  return (
    <section className="workspace-card surface">
      <div className="workspace-header">
        <div>
          <span className="eyebrow">Interactive IA</span>
          <h2>visible navigation과 hidden core를 동시에 보는 IA 설계도</h2>
        </div>
      </div>

      <div className="workspace-grid workspace-grid-ia">
        <div className="ia-blueprint-board">
          <div className="ia-column">
            <div className="ia-column-header">
              <span className="journey-lane-title">Visible navigation</span>
              <p>현재 사용자가 즉시 보는 표면 구조</p>
            </div>
            <div className="ia-node-stack">
              {visible.map((item) => (
                <button
                  key={`visible-${item.name}`}
                  type="button"
                  className="surface-orbit-node"
                  data-active={selected?.name === item.name}
                  data-tone="visible"
                  onClick={() => setSelectedName(item.name)}
                >
                  <span>{item.name}</span>
                  <small>{item.role}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="ia-core-column">
            <div className="surface-orbit-core">
              <CompassIcon className="icon" />
              <strong>Experience structure</strong>
              <p>브랜드 표면 · 행동 허브 · 과금 루프 · 운영 레이어의 충돌 지점을 해석합니다.</p>
            </div>
            <div className="ia-core-bridges" aria-hidden="true">
              <span />
              <span />
            </div>
          </div>

          <div className="ia-column">
            <div className="ia-column-header">
              <span className="journey-lane-title">Hidden critical routes</span>
              <p>가치와 BM은 큰데 1차 메뉴에서 보이지 않는 구조</p>
            </div>
            <div className="ia-node-stack">
              {hidden.map((item) => (
                <button
                  key={`hidden-${item.name}`}
                  type="button"
                  className="surface-orbit-node"
                  data-active={selected?.name === item.name}
                  data-tone="hidden"
                  onClick={() => setSelectedName(item.name)}
                >
                  <span>{item.name}</span>
                  <small>{item.role}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selected ? <SurfaceDetail item={selected} tone={selectedTone} /> : null}
      </div>

      <div className="workspace-grid workspace-grid-2cols">
        <div className="workspace-list-panel surface-muted">
          <span className="workspace-detail-kicker">Current Friction</span>
          <div className="workspace-list-stack">
            {issues.map((issue) => (
              <article key={issue.title} className="workspace-note-card">
                <strong>{issue.title}</strong>
                <p>{issue.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="workspace-list-panel surface-muted">
          <span className="workspace-detail-kicker">Recommended Direction</span>
          <div className="workspace-list-stack">
            {recommendations.map((issue) => (
              <article key={issue.title} className="workspace-note-card workspace-note-card-positive">
                <strong>{issue.title}</strong>
                <p>{issue.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PolicyImpactIcon(title: string) {
  if (title.includes("Trust") || title.includes("Safety")) {
    return <ShieldIcon className="icon" />;
  }
  if (title.includes("Economy") || title.includes("Commerce")) {
    return <WalletIcon className="icon" />;
  }
  if (title.includes("Chat") || title.includes("Match")) {
    return <MessageCircleIcon className="icon" />;
  }
  if (title.includes("Contract")) {
    return <LayersIcon className="icon" />;
  }
  return <SparkIcon className="icon" />;
}

export function PolicyExplorer({ groups }: { groups: PolicyGroup[] }) {
  const [index, setIndex] = useState(0);
  const active = groups[index] ?? groups[0];

  return (
    <section className="workspace-card surface">
      <div className="workspace-header">
        <div>
          <span className="eyebrow">Interactive Policy Matrix</span>
          <h2>정책을 설명문이 아니라 지배 규칙 세트로 읽는 인터페이스</h2>
        </div>
        <SourceLink link={active.source} />
      </div>

      <div className="workspace-chip-row" role="tablist" aria-label="Policy groups">
        {groups.map((group, groupIndex) => (
          <button
            key={group.title}
            type="button"
            className="workspace-chip"
            data-active={groupIndex === index}
            onClick={() => setIndex(groupIndex)}
          >
            {group.title}
          </button>
        ))}
      </div>

      <div className="workspace-grid workspace-grid-policy">
        <div className="policy-canvas surface-muted">
          <div className="policy-canvas-header">
            {PolicyImpactIcon(active.title)}
            <div>
              <span className="workspace-detail-kicker">Active policy domain</span>
              <h3>{active.title}</h3>
            </div>
          </div>
          <p>{active.summary}</p>
          <div className="policy-rule-stack">
            {active.items.map((item, itemIndex) => (
              <div className="policy-rule" key={item}>
                <span className="policy-rule-index">{String(itemIndex + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="workspace-list-panel surface-muted">
          <span className="workspace-detail-kicker">Policy coverage map</span>
          <div className="workspace-list-stack">
            {groups.map((group, groupIndex) => (
              <button
                key={group.title}
                type="button"
                className="policy-mini-card"
                data-active={groupIndex === index}
                onClick={() => setIndex(groupIndex)}
              >
                <div className="policy-mini-card-top">
                  {PolicyImpactIcon(group.title)}
                  <strong>{group.title}</strong>
                </div>
                <p>{group.summary}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SystemExplorer({
  columns,
  bundles,
}: {
  columns: BlueprintColumn[];
  bundles: SourceBundle[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = columns[activeIndex] ?? columns[0];
  const matchingBundle = useMemo(
    () => bundles.find((bundle) => bundle.title.toLowerCase().includes(activeColumn.title.split(" ")[0].toLowerCase())) ?? bundles[0],
    [activeColumn, bundles],
  );

  return (
    <section className="workspace-card surface">
      <div className="workspace-header">
        <div>
          <span className="eyebrow">System Blueprint</span>
          <h2>PRD → Experience → Contract → Validation 연결 구조</h2>
        </div>
      </div>

      <div className="blueprint-canvas">
        {columns.map((column, index) => (
          <button
            key={column.title}
            type="button"
            className="blueprint-node"
            data-active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <span>{column.title}</span>
            <small>{column.docs.length} docs</small>
          </button>
        ))}
      </div>

      <div className="workspace-grid workspace-grid-policy">
        <div className="workspace-list-panel surface-muted">
          <span className="workspace-detail-kicker">Focused column</span>
          <h3>{activeColumn.title}</h3>
          <p>{activeColumn.summary}</p>
          <div className="workspace-list-stack">
            {activeColumn.docs.map((doc) => (
              <SourceLink key={`${activeColumn.title}-${doc.label}`} link={doc} />
            ))}
          </div>
        </div>
        <div className="workspace-list-panel surface-muted">
          <span className="workspace-detail-kicker">Related source pack</span>
          <h3>{matchingBundle?.title}</h3>
          <p>{matchingBundle?.summary}</p>
          <div className="workspace-list-stack">
            {matchingBundle?.links.map((link) => <SourceLink key={`${matchingBundle.title}-${link.label}`} link={link} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortalWorkbench({
  lanes,
  visible,
  hidden,
  issues,
  recommendations,
  groups,
  columns,
  bundles,
}: {
  lanes: JourneyLane[];
  visible: SurfaceCard[];
  hidden: SurfaceCard[];
  issues: { title: string; detail: string }[];
  recommendations: { title: string; detail: string }[];
  groups: PolicyGroup[];
  columns: BlueprintColumn[];
  bundles: SourceBundle[];
}) {
  const tabs = [
    { key: "journey", label: "Journey", icon: <SparkIcon className="icon" /> },
    { key: "ia", label: "IA", icon: <CompassIcon className="icon" /> },
    { key: "policy", label: "Policy", icon: <ShieldIcon className="icon" /> },
    { key: "system", label: "System", icon: <LayersIcon className="icon" /> },
  ] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("journey");

  return (
    <section className="workspace-shell surface">
      <div className="workspace-header workspace-header-shell">
        <div>
          <span className="eyebrow">PM Workspace</span>
          <h2>한 화면에서 flow · IA · policy · source map을 전환해 읽는 인터랙티브 워크벤치</h2>
        </div>
      </div>
      <div className="workspace-tab-row workspace-tab-row-shell" role="tablist" aria-label="Portal workspace tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className="workspace-tab workspace-tab-shell"
            data-active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "journey" ? <JourneyExplorer lanes={lanes} /> : null}
      {activeTab === "ia" ? (
        <IaExplorer visible={visible} hidden={hidden} issues={issues} recommendations={recommendations} />
      ) : null}
      {activeTab === "policy" ? <PolicyExplorer groups={groups} /> : null}
      {activeTab === "system" ? <SystemExplorer columns={columns} bundles={bundles} /> : null}
    </section>
  );
}
