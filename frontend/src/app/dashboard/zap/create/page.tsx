"use client"

import { AppBar } from "@/components/AppBar"
import CustomEdge from "@/components/zap/CustomEdge"
import { ReactFlow, Background, Controls , applyEdgeChanges , applyNodeChanges, addEdge} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useState } from "react"

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Trigger" },
    type: "input",
  },
  {
    id: "n2",
    position: { x: 0, y: 150 },
    data: { label: "Action" },
  },
]

const initialEdges = [
    {
      id: 'n1-n2',
      source: 'n1',
      target: 'n2',
      type: 'custom-edge',
      label: '+',
    },
];

const edgeTypes = {
    'custom-edge': CustomEdge,
};


export default function ZapFlowCanvas() {
    
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes : any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
      );
      const onEdgesChange = useCallback(
        (changes : any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
      );
      const onConnect = useCallback(
        (params : any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
      );
  return (<div className="w-full">
    <AppBar />
    <div className="h-screen min-h-screen w-full border rounded-lg">
      <ReactFlow 
        nodes={nodes} 
        fitView edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  </div>
    
  )
}