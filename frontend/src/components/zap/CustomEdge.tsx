import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    useReactFlow,
  } from '@xyflow/react';
  
  interface CustomEdgeInputs {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  }
  
  export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: CustomEdgeInputs) {
    const { addEdges } = useReactFlow();
  
    const [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
  
        <EdgeLabelRenderer>
          <button
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%)`,
              left: labelX,
              top: labelY,
              pointerEvents: 'all',
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              console.log('Plus clicked on edge:', id);
              // example: add a node or action here
            }}
          >
            +
          </button>
        </EdgeLabelRenderer>
      </>
    );
  }