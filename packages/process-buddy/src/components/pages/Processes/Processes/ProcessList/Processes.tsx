import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useEffect, useState } from "react";
import { DailyUsage } from "@/components/shared/charts/BarChart";
import { RangePicker } from "@/components/shared/charts/datepicker/RangePicker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CreateProcessDialog from "./CreateProcessDialog";
import { Process } from "@brux/shared/src/queries/process/schema";
export default function Processes({
  fetchProcesses,
  deleteProcess,
  createProcess,
  user
}: {
  deleteProcess: (userId: string, processId: string) => Promise<boolean>;
  fetchProcesses: (userId: string) => Promise<Process[]>;
  createProcess: (
    userId: string, data: Omit<Process, "id" | "created_at" | "updated_at">
  ) => Promise<Process | null>;
  user: { id: string }
}) {
  const [processList, setProcessList] = useState(
    [] as {
      name: string;
      code: string;
      status: string;
      label: string;
      lastRun: string;
    }[]
  );
  const getProcesses = async () => {
    const processes = await fetchProcesses(user?.id);
    setProcessList(
      processes?.map((process) => {
        return {
          name: process?.name,
          label: process?.name,
          code: process?.id?.toString(),
          status: "in-progress",
          lastRun: new Date().toUTCString(),
          deleteProcess: async () => {
            await deleteProcess(user?.id, process?.id.toString());
            getProcesses()
          },
          duplicateProcess: async () => {
            await createProcess(user?.id, {
              name: `COPY - ${process.name}`,
              description: `COPY - ${process.description}`,
              customer_id: user!.id.toString(),
              user_id: 0,
              node_data: process?.node_data,
              edge_data: process.edge_data,
            });
            getProcesses()
          },
        };
      })
    );
  };
  useEffect(() => {
    getProcesses();
  }, [user]);
  return (
    <div className="flex flex-col">
      {/* Main content section with table always visible */}

      <div className="h-full flex-1 flex-col space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Your processes
            </h2>
            {/* <p className="text-muted-foreground">
              Here's a list of your tasks for this month!
            </p> */}
          </div>

          <CreateProcessDialog
            createProcess={createProcess}
            fetchProcesses={getProcesses}
            user={user}
          />
          {/* <DateRangePicker/> */}
          <RangePicker />
        </div>

        {/* Data Table */}
        {/* <div className="overflow-x-auto"> */}
        <div className="w-full">
          <ScrollArea className="w-full">
            <DailyUsage />
            {/* <div className="w-full">*/}
            <DataTable data={processList} columns={columns} />
            {/* </div> */}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
