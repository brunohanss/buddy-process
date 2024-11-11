import { v4 as uuidv4 } from "uuid";
import { ProcessRunner, ProcessValidationStatus } from "@brux/shared/src/services/runner";
import { ModuleGenerator } from "./ModuleGenerator";
import { ModuleData } from "@brux/shared/src/types/flow-editor/ModuleData";
import { Node, Edge } from "@xyflow/react";
import { ModuleActionType } from "@brux/shared/src/queries/baseModule/schema";

export const getProcess = async (fetchProcessById: (arg0: any, arg1: any) => any, userId: any, processId: { toString: () => any; }, setNodes: (arg0: any[]) => void, setEdges: (arg0: any[]) => void) => {
  try {
    const process = await fetchProcessById(userId, processId.toString());
    if (process?.node_data?.length) setNodes([...process.node_data]);
    if (process?.edge_data?.length) setEdges([...process.edge_data]);
  } catch (error) {
    console.error("Failed to fetch process:", error);
  }
};

export const render = (nodeId: any, status: any, nodes: any, setNodes: (arg0: (nodes: any) => any) => void) => {
  setNodes((nodes: any[]) =>
    nodes.map((node: { id: any; data: any; }) =>
      node.id === nodeId ? { ...node, data: { ...node.data, status } } : node
    )
  );
};

export const handleValidation = async (nodes: Node<ModuleData>[], edges: Edge[], toast: (arg0: { variant: "default" | "destructive" | null | undefined; title: string; description: string | undefined; }) => void, setNodes: any) => {
  const validationResponse = ProcessRunner.validateProcess(nodes, edges);
  if (validationResponse.status !== ProcessValidationStatus.Valid) {
    toast({
      variant: "destructive",
      title: "Process Validation Error",
      description: validationResponse.message,
    });
    return;
  }

  try {
    await ProcessRunner.run(nodes, edges, (result) => {
      console.log(result);
      toast({
        variant: "default",
        title: `Module ${result.nodeId} Processed`,
        description: `Status: ${result.status}`,
      });
    });
    toast({
      variant: "default",
      title: "Process Completed",
      description: "Successfully executed.",
    });
  } catch (error) {
    console.error("Execution error:", error);
    toast({
      variant: "destructive",
      title: "Execution Error",
      description: `There was an error: ${error}`,
    });
  }
};

export const addModule = (selectedModules: any[], nodes: any, setNodes: (arg0: (prevNodes: any) => any[]) => void) => {
  const newModules = selectedModules.map((newMod: { baseModule: { action_type: ModuleActionType; action_name: any; module_actions: { name: any; }[]; }; baseIntegration: { logo_url: any; }; }, index: number) => ({
    id: uuidv4(),
    position: { x: 300 + index * 50, y: 100 + index * 50 },
    data: {
      icon: ModuleGenerator.mapActionTypeToModuleIcon(newMod.baseModule.action_type),
      moduleIconUrl: newMod.baseIntegration.logo_url,
      title: newMod.baseModule.action_name,
      subline: newMod.baseModule.module_actions[0].name,
      status: "loading",
      baseModule: newMod.baseModule,
      baseIntegration: newMod.baseIntegration,
    },
    type: "turbo",
  }));
  
  setNodes((prevNodes: any) => [...prevNodes, ...newModules]);
};
