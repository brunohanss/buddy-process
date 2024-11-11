import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import TurboNode from "./Module";
import TurboEdge from "./Edge";
import "./ProcessEditor.css";
import { ModuleGenerator } from "./services/ModuleGenerator";
import { BaseIntegration } from "@brux/shared/src/queries/baseIntegration/schema";
import {
  BaseModule,
  ModuleActionType,
} from "@brux/shared/src/queries/baseModule/schema";
import { type ModuleData } from "@brux/shared/src/types/flow-editor/ModuleData";
import {
  ProcessRunner,
  ProcessValidationStatus,
} from "@brux/shared/src/services/runner";
import { AddModuleDialog } from "./components/add-module/add-module";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Process } from "@brux/shared/src/queries/process/schema";
import { useNavigate, useParams } from "react-router-dom";

const Module = TurboNode;
const Linker = TurboEdge;

const MAX_HISTORY = 30;
const SAVE_DELAY = 200;
const initialNodes: Node<ModuleData>[] = [];

const initialEdges: Edge[] = [
  // { id: "e1-2", source: "1", target: "2" }
];

const nodeTypes = { turbo: Module };
const edgeTypes = { turbo: Linker };
const defaultEdgeOptions = { type: "turbo" };

export default function Dashboard({
  fetchProcessById,
  userId,
}: {
  fetchProcessById: (
    userId: string | undefined,
    processId: string
  ) => Promise<Process | null>;
  userId?: string;
}) {
  const { processId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function to save the process
  const saveProcess = useCallback(async () => {
    setSaving(true);
    try {
      console.log("Saving");
      setSaving(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save the process.",
      });
      setSaving(false);
    }
  }, [nodes, edges, processId, toast]);
  // Debounce save on nodes or edges change
  useEffect(() => {
    const handler = setTimeout(() => {
      setHistory((prev) => [...prev.slice(-MAX_HISTORY + 1), { nodes, edges }]);
      saveProcess();
    }, SAVE_DELAY);

    return () => clearTimeout(handler); // Clear timeout if nodes or edges change within delay
  }, [nodes, edges, saveProcess]);

  // Track node changes
  const onNodesChangeTracked = useCallback(
    (changes: NodeChange<Node<ModuleData>>[]) => onNodesChange(changes),
    [onNodesChange]
  );

  // Track edge changes
  const onEdgesChangeTracked = useCallback(
    (changes: EdgeChange<Edge>[]) => onEdgesChange(changes),
    [onEdgesChange]
  );

  useEffect(() => {
    getProcess();
  }, [processId]);
  const getProcess = async () => {
    if (!processId) {
      return navigate("/processes");
    }
    const process = await fetchProcessById(userId, processId.toString());
    console.log("received process", process);
    if (process?.node_data?.length) {
      setNodes(JSON.parse(process.node_data as any));
    }
    if (process?.edge_data?.length) {
      setEdges(JSON.parse(process.edge_data as any));
    }
  };

  // Render method to update node status
  // const render = (nodeId: string, status: ProcessValidationStatus) => {
  //   const moduleIndex = nodes.findIndex((node) => node?.id === nodeId);
  //   if (!moduleIndex) {
  //     console.warn("Module was not found");
  //   }
  //   nodes[moduleIndex].data = { ...nodes[moduleIndex].data, status };
  //   setNodes(nodes);
  //   console.log("nodes", nodes);
  // };
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );
  const handleValidation = async (nodes: Node<ModuleData>[], edges: Edge[]) => {
    // Step 1: Validate the process
    const validationResponse = ProcessRunner.validateProcess(nodes, edges);
    if (validationResponse.status !== ProcessValidationStatus.Valid) {
      toast({
        variant: "destructive",
        title: "Process Validation Error",
        description: validationResponse.message,
      });
      return;
    }

    // Step 2: Run the process with real-time updates
    await ProcessRunner.run(nodes, edges, (result) => {
      console.log(result);
      toast({
        variant: "default",
        title: `Module ${result.nodeId} Processed`,
        description: `Status: ${result.status}`,
      });
    })
      .then((finalMessage) => {
        // render("2", ProcessValidationStatus.Valid);
        toast({
          variant: "default",
          title: "Process Completed",
          description: finalMessage,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Execution Error",
          description: `There was an error: ${error}`,
        });
      });
  };

  const addModule = (
    selectedModules: {
      baseIntegration: BaseIntegration;
      baseModule: BaseModule;
    }[]
  ) => {
    const newModules = selectedModules.map((newMod, index) => {
      return {
        id: uuidv4(),
        position: { x: 300 + index * 50, y: 100 + index * 50 },
        data: {
          icon: ModuleGenerator.mapActionTypeToModuleIcon(
            newMod.baseModule.action_type as ModuleActionType
          ),
          moduleIconUrl: newMod.baseIntegration.logo_url,
          title: newMod.baseModule.action_name,
          subline: newMod.baseModule.module_actions[0].name,
          status: "loading",
          baseModule: newMod.baseModule,
          baseIntegration: newMod.baseIntegration,
          gradientColors: [
            "#ff7e5f",
            "#feb47b",
            "#86a8e7",
            "rgba(134, 168, 231, 0)",
          ],
          isPaused: true,
        },
        type: "turbo",
      };
    });
    setNodes((prevNodes) => [...prevNodes, ...newModules]);
    setTimeout(() => {
      console.log("Existing nodes", nodes);
      // updateProcess()
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbox (DataTable) */}
      <div className="p-4 bg-gray-100 border-b border-gray-300 flex">
        {/* <DataTable data={tasks} columns={columns} /> */}
        <AddModuleDialog addModule={addModule} />
        <Button
          variant="outline"
          onClick={() => {
            handleValidation(nodes, edges);
          }}
        >
          Run test
        </Button>
      </div>

      {/* Flow Editor */}
      <main className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeTracked}
          onEdgesChange={onEdgesChangeTracked}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          className="h-full"
        >
          <Controls showInteractive={true} />
          <svg>
            <defs>
              <linearGradient id="edge-gradient">
                <stop offset="0%" stopColor="#ae53ba" />
                <stop offset="100%" stopColor="#2a8af6" />
              </linearGradient>
              <marker
                id="edge-circle"
                viewBox="-5 -5 10 10"
                refX="0"
                refY="0"
                markerUnits="strokeWidth"
                markerWidth="10"
                markerHeight="10"
                orient="auto"
              >
                <circle
                  stroke="#2a8af6"
                  strokeOpacity="0.75"
                  r="2"
                  cx="0"
                  cy="0"
                />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      </main>
    </div>
  );
}
