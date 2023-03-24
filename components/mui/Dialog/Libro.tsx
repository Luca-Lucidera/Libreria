import Libro, { libroVuoto } from "@/model/Libro";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { editori } from "@/model/Editore";
import { tuttiTipoLibri } from "@/model/TipoManga";
import { status } from "@/model/Status";

type Props = {
  open: boolean;
  setOpen: Function;
  isNewBook: boolean;
  setIsNewBook: Function;
  libro: Libro;
  setLibro: Function;
  create: Function;
  update: Function;
};
export default function CambiaONuovoLibro({
  open,
  setOpen,
  setIsNewBook,
  isNewBook,
  libro,
  setLibro,
  update,
  create,
}: Props) {
  const [modificheFatte, setModificheFatte] = useState(false);

  const handleModifiche = (key: string, value: string | number) => {
    if (!modificheFatte) setModificheFatte(true);
    setLibro({ ...libro, [key]: value });
  };

  const handleChiudiSenzaSalvare = () => {
    setOpen(false);
    setIsNewBook(false);
    setLibro({ ...libroVuoto });
  };

  const saveBook = () => {
    if (!modificheFatte) {
      handleChiudiSenzaSalvare();
    } else if (isNewBook) {
      create();
    } else {
      update();
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleChiudiSenzaSalvare}>
        <DialogTitle>
          <Typography variant="h5">
            {isNewBook
              ? "Aggiungi un nuovo libro alla tua collezione"
              : `Libro scelto: ${libro.titolo}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="titolo"
            onChange={(e) => handleModifiche("titolo", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libro.titolo}
          />
          <TextField
            type="number"
            label="comprati"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libro.comprati}
            inputProps={{ inputMode: "numeric", min: 1 }}
            onChange={(e) =>
              handleModifiche("comprati", parseInt(e.target.value))
            }
          />
          <TextField
            type="number"
            label="letti"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libro.letti}
            inputProps={{
              inputMode: "numeric",
              min: 0,
              max: libro.comprati,
            }}
            onChange={(e) => handleModifiche("letti", parseInt(e.target.value))}
          />
          <Select
            value={libro.tipo}
            onChange={(e) => handleModifiche("tipo", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
          >
            {tuttiTipoLibri.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </Select>
          <Select
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libro.editore}
            onChange={(e) => handleModifiche("editore", e.target.value)}
          >
            {editori.map((editore) => (
              <MenuItem key={editore} value={editore}>
                {editore}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={libro.status}
            onChange={(e) => handleModifiche("status", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
          >
            {status.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
          <TextField
            type="number"
            label="prezzo"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libro.prezzo}
            inputProps={{ min: 1 }}
            onChange={(e) =>
              handleModifiche("prezzo", parseFloat(e.target.value))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            sx={{ marginX: "auto", marginY: 3, width: "40%" }}
            size="large"
            variant={"contained"}
            onClick={handleChiudiSenzaSalvare}
          >
            Annulla
          </Button>
          <Button
            color="success"
            sx={{ marginX: "auto", marginY: 3, width: "40%" }}
            size="large"
            variant={"contained"}
            onClick={saveBook}
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
