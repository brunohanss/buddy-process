
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AutoGeneratedForm from "@/components/shared/form/AutoGeneratedForm";
import { SetupData } from "@brux/shared/src/schemas/baseIntegration";

export function EditModuleModal({ onClose, fields }: { fields: SetupData, onClose: () => {}}) {
  console.log("fields", fields)
  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button>Edit Module</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        <AutoGeneratedForm fields={fields} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}