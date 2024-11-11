import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { columns } from "./columns";
import {
  baseIntegrationCatalog,
  baseModuleCatalog,
} from "@brux/shared/src/integrations/catalog";
import { Module } from "../../data/schema";
import { DataTable } from "./data-table";

export function AddModuleDialog({
  addModule,
}: {
  addModule: (selectedModules: any[]) => void;
}) {
  const modules: Module[] = [];
  baseModuleCatalog.forEach((baseModule) => {
    const baseIntegration = baseIntegrationCatalog.find(
      (baseInt) => baseInt.id === baseModule.base_integration_id
    );
    if (!baseIntegration) {
      throw new Error("Base integration was not found");
    }
    modules.push(
      ...baseModule.module_actions.map((moduleAction) => {
        return {
          logoUrl: baseIntegration.logo_url,
          name: moduleAction.name,
          code: `${baseIntegration.integration_code}-${baseModule.action_code}-${moduleAction.code}`,
          moduleName: baseModule.name,
          integrationName: baseIntegrationCatalog.find(
            (baseInt) => baseInt.id === baseModule.base_integration_id
          )?.integration_name!,
          actionType: baseModule.action_type,
          addModule: () => {
            addModule([{ baseIntegration, baseModule }]);
          },
        };
      })
    );
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add module</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add module</DialogTitle>
          <DialogDescription>
            Select the modules to be add to the current process.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DataTable
            columns={columns}
            data={modules}
          />

          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
        </div>
        {/* <DialogFooter>
          <Button type="submit" onClick={() => {
            addModule(selectedModules)
          }}>Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
