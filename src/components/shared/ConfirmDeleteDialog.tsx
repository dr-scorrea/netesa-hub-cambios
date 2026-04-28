import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Texto del título. Por defecto: "¿Eliminar elemento?" */
  title?: string;
  /** Nombre del item, se mostrará en negrita dentro de la descripción. */
  itemName?: string;
  /** Texto adicional contextual (sustituye a la descripción por defecto si se pasa). */
  description?: string;
  /** Texto del botón confirmar. Por defecto: "Eliminar". */
  confirmLabel?: string;
  /** Texto del botón cancelar. Por defecto: "Cancelar". */
  cancelLabel?: string;
  /** Acción de borrado al confirmar. */
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = "¿Eliminar elemento?",
  itemName,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </span>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ? (
              description
            ) : (
              <>
                {itemName ? (
                  <>
                    Se eliminará <strong className="text-foreground">{itemName}</strong>.{" "}
                  </>
                ) : (
                  "Esta operación no se puede revertir. "
                )}
                Esta acción no se puede deshacer.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
