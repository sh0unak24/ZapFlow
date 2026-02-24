import { Handle, Position } from '@xyflow/react';

interface CustomZapNodeProps {
  data: {
    title: string;
    description: string;
  };
}

export default function CustomZapNode({ data }: CustomZapNodeProps) {
  return (
    <div
      style={{
        width: 260,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: 12,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top-left title */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#111827',
        }}
      >
        {data.title}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: '#e5e7eb',
          margin: '8px 0',
        }}
      />

      {/* Description */}
      <div
        style={{
          fontSize: 12,
          color: '#6b7280',
          lineHeight: 1.4,
        }}
      >
        {data.description}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}