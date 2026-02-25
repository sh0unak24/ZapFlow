"use client"

import { AppBar } from "@/components/AppBar"
import ZapModal, { ModalType } from "@/components/Modal"
import CustomEdge from "@/components/zap/CustomEdge"
import CustomZapNode from "@/components/zap/CustomZapNode"
import { useZapItem } from "@/hooks/useZapItem"
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, Position, Node } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import axios from "axios"
import { useCallback, useRef, useState } from "react"
import toast from "react-hot-toast"
import { BACKEND_URL } from "@/app/config"
import { useRouter } from "next/navigation"

type ZapNodeData = {
    label: string;
    title: string;
    description: string;
    stepNumber: number;
    image?: string;
  
    availableTriggerId?: string;
    availableActionId?: string;
    actionName?: string;
  
    metadata?: Record<string, any>;
};
const initialNodes: Node<ZapNodeData>[] = [
    {
      id: "node-1",
      type: "zapNode",
      position: { x: 100, y: 100 },
      data: {
        label: "Trigger",
        title: "Trigger",
        description: "Select the event that starts your zap",
        stepNumber: 1,
        availableTriggerId: "",
        availableActionId: "", 
        metadata: {},
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    {
      id: "node-2",
      type: "zapNode",
      position: { x: 100, y: 250 },
      data: {
        label: "Action",
        title: "Action",
        description: "Select the event for your zap to run",
        stepNumber: 2,
        availableTriggerId: "", 
        availableActionId: "",
        metadata: {},
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
    const [nodes, setNodes] = useState<Node<ZapNodeData>[]>(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>("trigger");
    const [zapName , setZapName] = useState("Untitled");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const {triggers , actions , error} = useZapItem();
    const router = useRouter()

    function buildZapPayload() {
        const triggerNode = nodes.find(
            (n) => n.data.availableTriggerId
        );
      
        if (!triggerNode) {
            throw new Error("Trigger not selected");
        }
      
        const actionNodes = nodes.filter(
            (n) => n.data.availableActionId
        );
      
        if (actionNodes.length === 0) {
            throw new Error("At least one action is required");
        }
      
        return {
            availableTriggerId: triggerNode.data.availableTriggerId,
            zapName : zapName,
            actions: actionNodes.map((action) => ({
            availableActionId: action.data.availableActionId,
            actionName: action.data.title,
            actionMetadata : action.data.metadata
            })),
        };
      }

      async function createZap() {
        try {
            const payload = buildZapPayload();
            console.log(`Payload for the api is ${JSON.stringify(payload)}`)
            await axios.post(
                `${BACKEND_URL}/api/v1/zap`,
                payload,
                { withCredentials: true }
            );
      
            toast.success("Zap created successfully!");
            setTimeout(() => {
            router.push("/dashboard")
            } , 2000)
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to create zap");
        }
      }

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
            <div className="h-screen min-h-screen w-full border rounded-lg">
            <div className="flex items-end justify-end gap-6 mt-24 mr-10">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                Zap name
                </label>

                <input
                type="text"
                value={zapName}
                placeholder="Untitled Zap"
                className="w-64 rounded-lg border border-slate-200  bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none "
                onChange={(e) => setZapName(e.target.value)}
                />
            </div>

                <button
                    onClick={createZap}
                    className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    >
                    Publish
                </button>
            </div>
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
                onSelect={(item , metadata) => {
                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === selectedNodeId
                                ? {
                                    ...n,
                                    data: {
                                        ...n.data,
                                        title: item.name,
                                        description: item.description ?? "",
                                        image : item.image,
                                        availableTriggerId:
                                        modalType === "trigger" ? item.id : n.data.availableTriggerId,

                                        availableActionId:
                                            modalType === "action" ? item.id : n.data.availableActionId,

                                        actionName:
                                            modalType === "action" ? item.name : n.data.title,

                                        metadata
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