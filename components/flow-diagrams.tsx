"use client";

import "@xyflow/react/dist/style.css";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { memo } from "react";
import {
  Background,
  Controls,
  type Edge,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import { ArrowRightIcon } from "@/components/icons";
import type { JourneyBoard } from "@/lib/flow-data";
import { iaBlueprint, journeyBoards, overviewSystemMap } from "@/lib/flow-data";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(href: string) {
  return href.startsWith("/") ? `${BASE_PATH}${href}` : href;
}

type DiagramNodeData = {
  title: string;
  route: string;
  summary: string;
  screenshot?: string;
  interactions?: string[];
  pill?: string;
  tone?: string;
};

const ScreenshotNode = memo(function ScreenshotNode({ data }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div className="rf-node-card" data-tone={data.tone ?? "default"}>
      <Handle type="target" position={Position.Left} className="rf-handle" />
      {data.screenshot ? (
        <div className="rf-node-thumb-wrap">
          <img className="rf-node-thumb" src={withBasePath(data.screenshot)} alt={data.title} />
        </div>
      ) : null}
      <div className="rf-node-content">
        <div className="rf-node-header-row">
          {data.pill ? <span className="rf-node-pill">{data.pill}</span> : null}
          <code>{data.route}</code>
        </div>
        <strong>{data.title}</strong>
        <div className="rf-node-summary-block">
          <span className="rf-node-label">의미</span>
          <p>{data.summary}</p>
        </div>
        {data.interactions?.length ? (
          <div className="rf-node-actions-block">
            <span className="rf-node-label">주요 액션</span>
            <div className="rf-node-actions">
              {data.interactions.map((item) => (
                <span className="rf-node-action-chip" key={`${data.title}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Handle type="source" position={Position.Right} className="rf-handle" />
    </div>
  );
});

const nodeTypes = {
  screenshot: ScreenshotNode,
};

function DiagramBoardFrame({
  eyebrow,
  title,
  sourceLabel,
  sourceHref,
  width,
  height,
  nodes,
  edges,
}: {
  eyebrow: string;
  title: string;
  sourceLabel: string;
  sourceHref: string;
  width: string;
  height: number;
  nodes: Node<DiagramNodeData>[];
  edges: Edge[];
}) {
  return (
    <section className="diagram-board surface">
      <div className="diagram-board-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link className="workspace-source-link" href={sourceHref}>
          <span>{sourceLabel}</span>
          <ArrowRightIcon className="icon" />
        </Link>
      </div>
      <div className="diagram-scroll-shell">
        <div className="diagram-canvas" style={{ width, height }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={28} size={1} color="rgba(148,163,184,0.15)" />
            <Controls showZoom={false} showFitView={false} showInteractive={false} />
          </ReactFlow>
        </div>
      </div>
    </section>
  );
}

function buildJourneyNodes(board: JourneyBoard) {
  const nodes: Node<DiagramNodeData>[] = board.steps.map((step, index) => ({
    id: step.id,
    type: "screenshot",
    position: { x: index * 350, y: 24 },
    draggable: false,
    data: {
      title: step.title,
      route: step.route,
      summary: step.summary,
      screenshot: step.screenshot,
      interactions: step.interactions,
      pill: step.tone ? step.tone.toUpperCase() : `STEP ${index + 1}`,
      tone: step.tone ?? "default",
    },
  }));

  const edges: Edge[] = board.steps.slice(0, -1).map((step, index) => ({
    id: `${step.id}-${board.steps[index + 1]?.id}`,
    source: step.id,
    target: board.steps[index + 1]?.id,
    type: "smoothstep",
    animated: board.steps[index + 1]?.tone === "action",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: board.steps[index + 1]?.tone === "warning" ? "#d97706" : board.steps[index + 1]?.tone === "gate" ? "#2563eb" : "#94a3b8",
      width: 18,
      height: 18,
    },
    style: {
      stroke:
        board.steps[index + 1]?.tone === "warning"
          ? "#d97706"
          : board.steps[index + 1]?.tone === "gate"
            ? "#2563eb"
            : "#94a3b8",
      strokeWidth: 2.2,
    },
  }));

  return { nodes, edges };
}

function JourneyBoardCanvas({ board }: { board: JourneyBoard }) {
  const { nodes, edges } = buildJourneyNodes(board);

  return (
    <DiagramBoardFrame
      eyebrow={board.title}
      title={board.summary}
      sourceLabel={board.sourceLabel}
      sourceHref={board.sourceHref}
      width={`${Math.max(board.steps.length * 350, 1120)}px`}
      height={420}
      nodes={nodes}
      edges={edges}
    />
  );
}

function MobileFlowCard({
  title,
  route,
  summary,
  interactions,
  screenshot,
  tone,
  index,
}: {
  title: string;
  route: string;
  summary: string;
  interactions: string[];
  screenshot: string;
  tone?: string;
  index: number;
}) {
  return (
    <article className="mobile-flow-card" data-tone={tone ?? "default"}>
      <div className="mobile-flow-card-head">
        <span className="mobile-flow-index">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>{title}</strong>
          <code>{route}</code>
        </div>
      </div>
      <div className="mobile-flow-thumb-wrap">
        <img className="mobile-flow-thumb" src={withBasePath(screenshot)} alt={title} />
      </div>
      <div className="mobile-flow-copy">
        <span className="mobile-flow-label">의미</span>
        <p>{summary}</p>
      </div>
      <div className="mobile-flow-copy">
        <span className="mobile-flow-label">주요 액션</span>
        <div className="mobile-flow-actions">
          {interactions.map((item) => (
            <span className="mobile-flow-chip" key={`${title}-${item}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function MobileJourneyBoard({ board }: { board: JourneyBoard }) {
  return (
    <section className="mobile-board surface">
      <div className="diagram-board-header">
        <div>
          <span className="eyebrow">{board.title}</span>
          <h2>{board.summary}</h2>
        </div>
        <Link className="workspace-source-link" href={board.sourceHref}>
          <span>{board.sourceLabel}</span>
          <ArrowRightIcon className="icon" />
        </Link>
      </div>
      <div className="mobile-flow-line">
        {board.steps.map((step, index) => (
          <div className="mobile-flow-segment" key={`${board.id}-${step.id}`}>
            <MobileFlowCard
              index={index}
              title={step.title}
              route={step.route}
              summary={step.summary}
              interactions={step.interactions}
              screenshot={step.screenshot}
              tone={step.tone}
            />
            {index < board.steps.length - 1 ? (
              <div className="mobile-flow-connector" aria-hidden="true">
                <span />
                <ArrowRightIcon className="icon" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function JourneyFlowCanvas() {
  return (
    <>
      <section className="diagram-stack diagram-desktop-only">
        {journeyBoards.map((board) => (
          <JourneyBoardCanvas board={board} key={board.id} />
        ))}
      </section>
      <section className="flow-mobile-stack diagram-mobile-only">
        {journeyBoards.map((board) => (
          <MobileJourneyBoard board={board} key={`${board.id}-mobile`} />
        ))}
      </section>
    </>
  );
}

export function OverviewSystemCanvas() {
  const nodes: Node<DiagramNodeData>[] = overviewSystemMap.nodes.map((node) => ({
    id: node.id,
    type: "screenshot",
    position: { x: node.x, y: node.y },
    draggable: false,
    data: {
      title: node.title,
      route: node.route,
      summary: node.summary,
      screenshot: node.screenshot,
      interactions: node.interactions,
      pill: node.tone.toUpperCase(),
      tone: node.tone,
    },
  }));

  const edges: Edge[] = [
    {
      id: "trust-core",
      source: "ov-login",
      target: "ov-core",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#2563eb", width: 18, height: 18 },
      style: { stroke: "#2563eb", strokeWidth: 2.4 },
    },
    {
      id: "core-chat",
      source: "ov-core",
      target: "ov-chat",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#0ea5e9", width: 18, height: 18 },
      style: { stroke: "#0ea5e9", strokeWidth: 2.4 },
    },
    {
      id: "core-inbox",
      source: "ov-core",
      target: "ov-inbox",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#2563eb", width: 18, height: 18 },
      style: { stroke: "#2563eb", strokeWidth: 2.4 },
    },
    {
      id: "inbox-chat",
      source: "ov-inbox",
      target: "ov-chat",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8", width: 18, height: 18 },
      style: { stroke: "#94a3b8", strokeWidth: 2.2 },
    },
    {
      id: "inbox-shop",
      source: "ov-inbox",
      target: "ov-shop",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d97706", width: 18, height: 18 },
      style: { stroke: "#d97706", strokeWidth: 2.2, strokeDasharray: "6 4" },
    },
    {
      id: "shop-admin",
      source: "ov-shop",
      target: "ov-admin",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d97706", width: 18, height: 18 },
      style: { stroke: "#d97706", strokeWidth: 2.2 },
    },
    {
      id: "chat-admin",
      source: "ov-chat",
      target: "ov-admin",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#171717", width: 18, height: 18 },
      style: { stroke: "#171717", strokeWidth: 2.2, strokeDasharray: "4 4" },
    },
  ];

  return (
    <>
      <div className="diagram-desktop-only">
        <DiagramBoardFrame
          eyebrow={overviewSystemMap.title}
          title={overviewSystemMap.summary}
          sourceLabel={overviewSystemMap.sourceLabel}
          sourceHref={overviewSystemMap.sourceHref}
          width="1520px"
          height={820}
          nodes={nodes}
          edges={edges}
        />
      </div>
      <section className="flow-mobile-stack diagram-mobile-only">
        <section className="mobile-board surface">
          <div className="diagram-board-header">
            <div>
              <span className="eyebrow">{overviewSystemMap.title}</span>
              <h2>{overviewSystemMap.summary}</h2>
            </div>
            <Link className="workspace-source-link" href={overviewSystemMap.sourceHref}>
              <span>{overviewSystemMap.sourceLabel}</span>
              <ArrowRightIcon className="icon" />
            </Link>
          </div>
          <div className="mobile-flow-line">
            {overviewSystemMap.nodes.map((node, index) => (
              <div className="mobile-flow-segment" key={node.id}>
                <MobileFlowCard
                  index={index}
                  title={node.title}
                  route={node.route}
                  summary={node.summary}
                  interactions={node.interactions}
                  screenshot={node.screenshot}
                  tone={node.tone}
                />
                {index < overviewSystemMap.nodes.length - 1 ? (
                  <div className="mobile-flow-connector" aria-hidden="true">
                    <span />
                    <ArrowRightIcon className="icon" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

export function IaFlowCanvas() {
  const visibleNodes: Node<DiagramNodeData>[] = iaBlueprint.visible.map((item, index) => ({
    id: item.id,
    type: "screenshot",
    position: { x: 24, y: index * 180 + 18 },
    draggable: false,
    data: {
      title: item.title,
      route: item.role,
      summary: item.summary,
      screenshot: item.screenshot,
      interactions: item.interactions,
      pill: "VISIBLE",
      tone: item.tone,
    },
  }));

  const hiddenNodes: Node<DiagramNodeData>[] = iaBlueprint.hidden.map((item, index) => ({
    id: item.id,
    type: "screenshot",
    position: { x: 920, y: index * 180 + 18 },
    draggable: false,
    data: {
      title: item.title,
      route: item.role,
      summary: item.summary,
      screenshot: item.screenshot,
      interactions: item.interactions,
      pill: "HIDDEN",
      tone: item.tone,
    },
  }));

  const coreNode: Node<DiagramNodeData> = {
    id: iaBlueprint.center.id,
    type: "screenshot",
    position: { x: 452, y: 220 },
    draggable: false,
    data: {
      title: iaBlueprint.center.title,
      route: iaBlueprint.center.role,
      summary: iaBlueprint.center.summary,
      screenshot: iaBlueprint.center.screenshot,
      interactions: iaBlueprint.center.interactions,
      pill: "CORE",
      tone: "core",
    },
  };

  const nodes = [...visibleNodes, coreNode, ...hiddenNodes];

  const edges: Edge[] = [
    ...iaBlueprint.visible.map((item) => ({
      id: `${item.id}-core`,
      source: item.id,
      target: coreNode.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#2563eb", width: 18, height: 18 },
      style: { stroke: "#2563eb", strokeWidth: 2 },
    })),
    ...iaBlueprint.hidden.map((item) => ({
      id: `core-${item.id}`,
      source: coreNode.id,
      target: item.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d97706", width: 18, height: 18 },
      style: { stroke: "#d97706", strokeWidth: 2, strokeDasharray: "6 4" },
    })),
  ];

  return (
    <>
      <div className="diagram-desktop-only">
        <DiagramBoardFrame
          eyebrow="IA Blueprint"
          title="visible surface와 hidden critical route를 연결한 구조도"
          sourceLabel={iaBlueprint.sourceLabel}
          sourceHref={iaBlueprint.sourceHref}
          width="1280px"
          height={820}
          nodes={nodes}
          edges={edges}
        />
      </div>
      <section className="flow-mobile-stack diagram-mobile-only">
        <section className="mobile-board surface">
          <div className="diagram-board-header">
            <div>
              <span className="eyebrow">IA Blueprint</span>
              <h2>visible / hidden / core를 모바일에서 읽기 쉬운 세로 구조로 재정렬</h2>
            </div>
            <Link className="workspace-source-link" href={iaBlueprint.sourceHref}>
              <span>{iaBlueprint.sourceLabel}</span>
              <ArrowRightIcon className="icon" />
            </Link>
          </div>
          <div className="mobile-ia-layout">
            <div className="mobile-ia-group">
              <div className="mobile-ia-heading">
                <strong>Visible surfaces</strong>
              </div>
              <div className="mobile-ia-stack">
                {iaBlueprint.visible.map((item, index) => (
                  <MobileFlowCard
                    key={item.id}
                    index={index}
                    title={item.title}
                    route={item.role}
                    summary={item.summary}
                    interactions={item.interactions}
                    screenshot={item.screenshot}
                    tone={item.tone}
                  />
                ))}
              </div>
            </div>
            <MobileFlowCard
              index={0}
              title={iaBlueprint.center.title}
              route={iaBlueprint.center.role}
              summary={iaBlueprint.center.summary}
              interactions={iaBlueprint.center.interactions}
              screenshot={iaBlueprint.center.screenshot}
              tone={iaBlueprint.center.tone}
            />
            <div className="mobile-ia-group">
              <div className="mobile-ia-heading">
                <strong>Hidden critical routes</strong>
              </div>
              <div className="mobile-ia-stack">
                {iaBlueprint.hidden.map((item, index) => (
                  <MobileFlowCard
                    key={item.id}
                    index={index}
                    title={item.title}
                    route={item.role}
                    summary={item.summary}
                    interactions={item.interactions}
                    screenshot={item.screenshot}
                    tone={item.tone}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
