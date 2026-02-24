import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    useReactFlow,
    Position,
    
} from '@xyflow/react';


interface CustomEdgeInputs {
    id: string;
    source: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}

export default function CustomEdge({ id, source, sourceX, sourceY }: CustomEdgeInputs) {
    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();


    const endX = sourceX;
    const endY = sourceY + 60;
    
    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX: endX,
        targetY: endY,
    });

    const onAddNode = () => {
        const newNodeId = `node-${Date.now()}`;
        const sourceNode = getNodes().find((n) => n.id === source);
        if (!sourceNode) return;

        const nodeHeight = 40;
        const verticalGap = 80;

        const newNodeX = sourceNode.position.x;
        const newNodeY = sourceNode.position.y + nodeHeight + verticalGap;
        
        
        setNodes((nds) => [
            ...nds,
            {
                id: newNodeId,
                type : "zapNode",
                position: { x: newNodeX, y: newNodeY },
                data: {
                        label: `Action`,
                        description : "Select the event for your zap to run",
                        title : "Action"
                    },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
            },
        ]);

        setEdges(() => [
            ...getEdges().filter((e) => e.id !== id),
            {
                id: `${source}-${newNodeId}`,
                source,
                target: newNodeId,
                type: 'smoothstep',
            },
            {
                id: `open-${newNodeId}`,
                source: newNodeId,
                target: newNodeId, // points to itself, we don't use targetX/Y anyway
                type: 'custom-edge',
            },
        ]);
    };

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <button
                    className="nodrag nopan"
                    style={{
                        position: 'absolute',
                        left: endX,
                        top: endY,
                        transform: 'translate(-50%, -50%)',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        pointerEvents: 'all',
                        fontSize: 20,
                        lineHeight: '28px',
                        textAlign: 'center',
                    }}
                    onClick={onAddNode}
                >
                    +
                </button>
            </EdgeLabelRenderer>
        </>
    );
}