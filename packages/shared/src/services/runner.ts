import { Node, Edge } from "@xyflow/react";
import { ModuleData } from "../types/flow-editor/ModuleData";

export class ProcessRunner {
  /**
   * Runs the process and provides incremental progress updates.
   *
   * @param nodes - The nodes in the process flow.
   * @param edges - The edges in the process flow.
   * @param progressCallback - A callback function that receives updates after each node is processed.
   * @returns A promise that resolves with a final success message after all nodes are processed.
   */
  static async run(
    nodes: Node<ModuleData>[],
    edges: Edge[],
    progressCallback?: (result: { nodeId: string; status: string; data?: any }) => void
  ): Promise<string> {
    // Helper to build adjacency list from edges
    const buildAdjacencyList = (nodes: Node<ModuleData>[], edges: Edge[]): Map<string, string[]> => {
      const adjList = new Map<string, string[]>();
      nodes.forEach((node) => {
        adjList.set(node.id, []);
      });
      edges.forEach((edge) => {
        adjList.get(edge.source)?.push(edge.target);
      });
      return adjList;
    };

    // Check for at least one node
    if (nodes.length === 0) {
      return Promise.reject("No nodes to execute in the process.");
    }

    // Build the adjacency list
    const adjList = buildAdjacencyList(nodes, edges);
    const visited = new Set<string>();
    const processedModules: string[] = [];

    // Helper function to execute each node
    const executeNode = async (nodeId: string): Promise<void> => {
      if (visited.has(nodeId)) return; // Skip already visited nodes

      // Process dependencies first (DFS)
      const dependencies = adjList.get(nodeId) || [];
      for (const dep of dependencies) {
        await executeNode(dep);
      }

      // Simulate node execution and report progress
      const result = { nodeId, status: "success", data: { message: `Node ${nodeId} processed.` } };
      visited.add(nodeId);
      processedModules.push(nodeId);

      // Call the progress callback if provided
      if (progressCallback) {
        progressCallback(result);
      }
    };

    // Execute nodes sequentially, starting from each node
    for (const node of nodes) {
      await executeNode(node.id);
    }

    // Final result message after all nodes are processed
    const resultMessage = `Process completed successfully in order: ${processedModules.join(" -> ")}.`;
    return Promise.resolve(resultMessage);
  }
  static validateProcess(nodes: Node<ModuleData>[], edges: Edge[]): { status: ProcessValidationStatus, message?: string } {
    // Step 1: Ensure there are at least two nodes
    if (nodes.length < 2) {
      return {status: ProcessValidationStatus.ProcessError, message: "At least two modules are required in the flow."};
    }

    // Step 2: Build a set of all valid node IDs
    const nodeIds = new Set(nodes.map((node) => node.id));

    // Step 3: Check that each edge points to an existing node
    for (const edge of edges) {
      if (!nodeIds.has(edge.target)) {
        return {status: ProcessValidationStatus.ModuleError, message: `Edge with source ${edge.source} points to a non-existent node ${edge.target}.`};
      }
    }

    // Step 4: Build adjacency list for cycle detection
    const adjList = new Map<string, string[]>();
    nodes.forEach((node) => {
      adjList.set(node.id, []);
    });
    edges.forEach((edge) => {
      adjList.get(edge.source)?.push(edge.target);
    });

    // Step 5: Detect cycles using DFS
    const visited = new Set<string>();
    const stack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (stack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      stack.add(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      stack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (hasCycle(node.id)) {
        return {status: ProcessValidationStatus.ProcessError, message: "Infinite loop detected in the process flow."};
      }
    }

    // If all checks pass, return null indicating no errors
    return {status : ProcessValidationStatus.Valid};
  }
}
export enum ProcessValidationStatus {
    Valid = 'ok',
    ProcessError = 'all',
    ModuleError = 'mod',
    RunError = 'run',
    UnexcpectedError = '_'
}