// src/components/CreateProcessDialog.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Process } from "@brux/shared/src/queries/process/schema";
import React, { useState } from "react";

type CreateProcessDialogProps = {
  createProcess: (userId: string, data: Omit<Process, "id" | "created_at" | "updated_at">) => Promise<Process | null>;
  fetchProcesses:  () => Promise<void>,
  user: any
};

export default function CreateProcessDialog({
  createProcess,
  fetchProcesses,
  user
}: CreateProcessDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProcess(user?.id, {
        name,
        description,
        customer_id: user?.id,
        user_id: 0,
        node_data: [],
        edge_data: []
      });
      toast({
        variant: "default",
        title: "Process Created",
        description: "The new process has been created successfully.",
      });
      setIsDialogOpen(false);
      fetchProcesses()
    } catch (error) {
      console.error("Failed to create process", error);
      toast({
        variant: "destructive",
        title: "Process Creation Error",
        description: "An error occurred while creating the process.",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>New process</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Process</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter process name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter process description"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Process</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
