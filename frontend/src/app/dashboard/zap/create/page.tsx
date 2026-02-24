"use client"

import { AppBar } from "@/components/AppBar"
import ZapModal, { ModalType } from "@/components/Modal"
import CustomEdge from "@/components/zap/CustomEdge"
import CustomZapNode from "@/components/zap/CustomZapNode"
import { useZapItem } from "@/hooks/useZapItem"
import {
    ReactFlow,
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useRef, useState } from "react"

const initialNodes = [
    {
        id: 'node-1',
        position: { x: 100, y: 100 },
        data: { 
            label: 'Trigger',
            title : "Trigger",
            description : "Select the even that starts your zap",
            stepNumber: 1,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        type : 'zapNode',
        
    },
    {
        id: 'node-2',
        type : 'zapNode',
        position: { x: 100, y: 250 },
        data: { 
            label: 'Action' ,
            title : "Action",
            description : "Select the event for your zap to run",
            stepNumber: 2,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
    },
];

const initialEdges = [
    {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        type: 'smoothstep',
    },
    {
        id: 'open-node-2',
        source: 'node-2',
        target: 'node-2', // self-referencing, targetX/Y ignored in CustomEdge
        type: 'custom-edge',

    },
];

const edgeTypes = {
    'custom-edge': CustomEdge,
};
const nodeTypes = {
    zapNode : CustomZapNode
}

export default function ZapFlowCanvas() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>("trigger");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const {triggers , actions , error} = useZapItem();

    const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNodeId(node.id);

    setModalType(node.id === "node-1" ? "trigger" : "action");
    setModalOpen(true);
    }, []);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    return (
        <div className="w-full">
            <AppBar />
            <div className="flex justify-end">
                <button className="p-4 px-5 py-3 bg-purple-400">
                    Publish
                </button>
            </div>
            <div className="h-screen min-h-screen w-full border rounded-lg">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    fitViewOptions={{padding:2.5}}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
            <ZapModal
                isOpen={modalOpen}
                type={modalType}
                onClose={() => setModalOpen(false)}
                items={modalType === "trigger" ? triggers : actions}
                onSelect={(item) => {
                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === selectedNodeId
                                ? {
                                    ...n,
                                    data: {
                                        ...n.data,
                                        title: item.name,
                                        description: item.description ?? "",
                                        image : item.image
                                    },
                                  }
                                : n
                        )
                    );
                }}
            />
        </div>
    );
}