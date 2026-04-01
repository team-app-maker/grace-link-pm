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
import type { JourneyBoard, OverviewNode } from "@/lib/flow-data";
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
        {data.pill ? <span className="rf-node-pill">{data.pill}</span> : null}
        <strong>{data.title}</strong>
        <code>{data.route}</code>
        <p>{data.summary}</p>
        {data.interactions?.length ? (
          <div className="rf-node-actions">
            {data.interactions.map((item) => (
              <span className="rf-node-action-chip" key={`${data.title}-${item}`}>
                {item}
              </span>
            ))}
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

function JourneyBoardCanvas({ board }: { board: JourneyBoard }) {
  const nodes: Node<DiagramNodeData>[] = board.steps.map((step, index) => ({
    id: step.id,
    type: "screenshot",
    position: { x: index * 340, y: 24 },
    draggable: false,
    data: {
      title: step.title,
      route: step.route,
      summary: step.summary,
      screenshot: step.screenshot,
      interactions: step.interactions,
      pill: step.tone ? step.tone.toUpperCase() : "STEP",
      tone: step.tone ?? "default",
    },
  }));

  const edges: Edge[] = board.steps.slice(0, -1).map((step, index) => ({
    id: `${step.id}-${board.steps[index + 1]?.id}`,
    source: step.id,
    target: board.steps[index + 1]?.id,
    type: "smoothstep",
    animated: index === 0 || board.steps[index + 1]?.tone === "action",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#94a3b8",
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
      strokeWidth: 2,
    },
  }));

  return (
    <DiagramBoardFrame
      eyebrow={board.title}
      title={board.summary}
      sourceLabel={board.sourceLabel}
      sourceHref={board.sourceHref}
      width={`${Math.max(board.steps.length * 340, 1080)}px`}
      height={280}
      nodes={nodes}
      edges={edges}
    />
  );
}

export function JourneyFlowCanvas() {
  return (
    <section className="diagram-stack">
      {journeyBoards.map((board) => (
        <JourneyBoardCanvas board={board} key={board.id} />
      ))}
    </section>
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
    <DiagramBoardFrame
      eyebrow={overviewSystemMap.title}
      title={overviewSystemMap.summary}
      sourceLabel={overviewSystemMap.sourceLabel}
      sourceHref={overviewSystemMap.sourceHref}
      width="1520px"
      height={760}
      nodes={nodes}
      edges={edges}
    />
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
    <DiagramBoardFrame
      eyebrow="IA Blueprint"
      title="visible surface와 hidden critical route를 연결한 구조도"
      sourceLabel={iaBlueprint.sourceLabel}
      sourceHref={iaBlueprint.sourceHref}
      width="1280px"
      height={760}
      nodes={nodes}
      edges={edges}
    />
  );
}
