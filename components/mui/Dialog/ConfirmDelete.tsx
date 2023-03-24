import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";

type ConfirmDeleteProps = {
  open: boolean;
  setOpen: Function;
  libro: { id: string; titolo: string };
  deleteFn: Function;
};

export default function ConfirmDelete({
  open,
  setOpen,
  libro,
  deleteFn: setDaEliminare,
}: ConfirmDeleteProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={(e) => {
          setOpen(false);
        }}
      >
        <DialogTitle>Elimina {libro.titolo}</DialogTitle>
        <DialogContent>
          <Typography>Sei sicuro di voler eliminare {libro.titolo}?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-evenly" }}>
          <Button
            color="success"
            variant="contained"
            onClick={(e) => setOpen(false)}
          >
            Annulla
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={(e) => {
              setOpen(false);
              setDaEliminare(true);
            }}
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
