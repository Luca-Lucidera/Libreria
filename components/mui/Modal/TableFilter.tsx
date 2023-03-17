import { filterEditori, IEditore } from "@/interfaces/Editore";
import { filterStatus, IStatus } from "@/interfaces/Status";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

type TableFilterProps = {
  open: boolean;
  setOpen: Function;
  editoreScelto: IEditore;
  setEditoreScelto: Function;
  statusScelto: IStatus;
  setStatusScelto: Function;
};
export default function TableFilter({
  open,
  setOpen,
  editoreScelto,
  setEditoreScelto,
  statusScelto,
  setStatusScelto,
}: TableFilterProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={(e) => {
          setOpen(false);
        }}
      >
        <DialogTitle>Imposta filtri di ricerca</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ marginTop: "5%" }}>Editore</Typography>
          <Select
            sx={{ marginTop: "2%" }}
            value={editoreScelto}
            onChange={(e) => {
              setEditoreScelto(e.target.value);
            }}
          >
            {filterEditori.map((editore) => (
              <MenuItem key={editore} value={editore}>
                {editore}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ marginTop: "15%" }}>Status</Typography>
          <Select
            sx={{ marginTop: "2%" }}
            value={statusScelto}
            onChange={(e) => {
              setStatusScelto(e.target.value);
            }}
          >
            {filterStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            onClick={(e) => {
              setOpen(false);
            }}
          >
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
