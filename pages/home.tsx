import style from "@/styles/home.module.css";
import ILibro from "@/interfaces/ILibro";
import IUser from "@/interfaces/user/IUser";
import axios from "axios";
import { createLibro, getUserLibri, updateLibro } from "@/service/libriService";
import { logout } from "@/service/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Dialog,
  Typography,
  TablePagination,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Grid,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/system";

interface userProps {
  user: IUser;
}

const libroVuoto: ILibro = {
  titolo: "",
  comprati: 1,
  letti: 0,
  tipo: "manga",
  editore: "J-POP",
  status: "Da leggere",
  prezzo: 1,
  id: "",
};

export default function HomePage({ user }: userProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  //dropdown case editrici
  const [editoreSelezionato, setCasaSelezionata] = useState("Tutto");
  const [statusSelezionato, setStatusSelezionato] = useState("Tutto");

  //modal/dialog
  const [openModal, setOpenModal] = useState(false);
  const [isNewBook, setIsNewBook] = useState(false);
  const [libroSelezionato, setLibroSelezionato] = useState<ILibro>({
    ...libroVuoto,
  });

  //Table Pagination
  const [rowsPerPage, setRowsPerPage] = useState(-1);
  const [page, setPage] = useState(0);

  const libriQuery = useQuery<ILibro[], Error>({
    queryKey: ["prendi-libri"],
    queryFn: async () => await getUserLibri(),
    enabled: user.id != null,
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => await logout(),
    onSuccess: () => {
      router.push("/");
    },
  });

  const updateBook = useMutation({
    mutationKey: ["update-libro"],
    mutationFn: async () => await updateLibro(libroSelezionato),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroSelezionato({ ...libroVuoto });
      setOpenModal(false);
      setIsNewBook(false)
    },
  });

  const createBook = useMutation({
    mutationKey: ["create"],
    mutationFn: async () => await createLibro(libroSelezionato),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroSelezionato({ ...libroVuoto });
      setOpenModal(false);
      setIsNewBook(false)
    },
  });

  if (libriQuery.isLoading)
    return (
      <div className={style.div_loading}>
        <CircularProgress color="inherit" />
      </div>
    );
  if (libriQuery.isError) return <div>{libriQuery.error.message}</div>;

  const libri = libriQuery.data!;
  if (libri.length == 0)
    return (
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Button onClick={handleNewBook} variant={"contained"} sx={{marginRight: "5%"}}>
            Nuovo libro
          </Button>
          <Button
            onClick={() => {
              logoutMutation.mutate();
            }}
            variant={"contained"}
            color={"error"}
          >
            Logout
          </Button>
        </Box>
        <Dialog open={openModal} onClose={handleCloseWithoutSave}>
          <DialogTitle>
            <Typography variant="h5">
              {isNewBook
                ? "Aggiungi un nuovo libro alla tua collezione"
                : `Libro scelto: ${libroSelezionato.titolo}`}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              label="titolo"
              onChange={(e) => handleModificheLibro("titolo", e.target.value)}
              sx={{ marginTop: 3, marginLeft: 3 }}
              value={libroSelezionato.titolo}
            />
            <TextField
              type="number"
              label="comprati"
              sx={{ marginTop: 3, marginLeft: 3 }}
              value={libroSelezionato.comprati}
              inputProps={{ inputMode: "numeric", min: 1 }}
              onChange={(e) =>
                handleModificheLibro("comprati", parseInt(e.target.value))
              }
            />
            <TextField
              type="number"
              label="letti"
              sx={{ marginTop: 3, marginLeft: 3 }}
              value={libroSelezionato.letti}
              inputProps={{
                inputMode: "numeric",
                min: 0,
                max: libroSelezionato.comprati,
              }}
              onChange={(e) =>
                handleModificheLibro("letti", parseInt(e.target.value))
              }
            />
            <Select
              value={libroSelezionato.tipo}
              onChange={(e) => handleModificheLibro("tipo", e.target.value)}
              sx={{ marginTop: 3, marginLeft: 3 }}
            >
              <MenuItem value={"manga"}>Manga</MenuItem>
              <MenuItem value={"light novel"}>Light novel</MenuItem>
              <MenuItem value={"novel"}>Novel</MenuItem>
            </Select>
            <Select
              sx={{ marginTop: 3, marginLeft: 3 }}
              value={libroSelezionato.editore}
              onChange={(e) => handleModificheLibro("editore", e.target.value)}
            >
              <MenuItem value={"J-POP"}>J-POP</MenuItem>
              <MenuItem value={"Planet manga"}>Planet manga</MenuItem>
              <MenuItem value={"Star Comics"}>Star Comics</MenuItem>
              <MenuItem value={"Goen"}>Goen</MenuItem>
              <MenuItem value={"Altro"}>Altro</MenuItem>
            </Select>
            <Select
              value={libroSelezionato.status}
              onChange={(e) => handleModificheLibro("status", e.target.value)}
              sx={{ marginTop: 3, marginLeft: 3 }}
            >
              <MenuItem value={"Da leggere"}>Da leggere</MenuItem>
              <MenuItem value={"In lettura"}>In lettura</MenuItem>
              <MenuItem value={"In pari"}>In pari</MenuItem>
              <MenuItem value={"In pausa"}>In pausa</MenuItem>
              <MenuItem value={"Finito"}>Finito</MenuItem>
              <MenuItem value={"In rilettura"}>In rilettura</MenuItem>
            </Select>
            <TextField
              type="number"
              label="prezzo"
              sx={{ marginTop: 3, marginLeft: 3 }}
              value={libroSelezionato.prezzo}
              inputProps={{ min: 1 }}
              onChange={(e) =>
                handleModificheLibro("prezzo", parseFloat(e.target.value))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              sx={{ marginX: "auto", marginY: 3, width: "40%" }}
              size="large"
              variant={"contained"}
              onClick={handleCloseWithoutSave}
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
      </div>
    );
  const headers = Object.keys(libri.at(0)!);
  const handleRowsPerPage =
    libriToShow().length > 10
      ? [10, 20, 50, 100, { label: "Tutti", value: -1 }]
      : [3, { label: "Tutti", value: -1 }];

  //HANDLER PER MODAL
  function handleNewBook() {
    setOpenModal(true);
    setIsNewBook(true);
  }

  function handleChangeBook(libro: ILibro) {
    setOpenModal(true);
    setIsNewBook(false);
    setLibroSelezionato(libro);
  }

  function handleDeleteBook(id: string) {}

  function handleCloseWithoutSave() {
    setOpenModal(false);
    setIsNewBook(false);
    setLibroSelezionato({ ...libroVuoto });
  }

  function saveBook() {
    if (isNewBook) createBook.mutate();
    else updateBook.mutate();
  }

  function handleModificheLibro(key: string, value: string | number) {
    setLibroSelezionato({ ...libroSelezionato, [key]: value });
  }

  //HANDLER TABELLA
  function handleNewRowPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  }

  function handleNextPage(e: unknown, nextPage: number) {
    setPage(nextPage);
  }

  function libriToShow(): ILibro[] {
    let libriDaPrendere: ILibro[] = [...libri];
    if (editoreSelezionato != "Tutto") {
      libriDaPrendere = libriDaPrendere.filter(
        (l) => l.editore == editoreSelezionato
      );
    }
    if (statusSelezionato != "Tutto") {
      libriDaPrendere = libriDaPrendere.filter(
        (l) => l.status == statusSelezionato
      );
    }
    libriDaPrendere = libriDaPrendere.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage < 0
        ? undefined
        : page * rowsPerPage + rowsPerPage
    );
    return libriDaPrendere;
  }

  return (
    <div className={style.div_pagina}>
      <div id="zona fixed">
        <Typography
          variant="h4"
          sx={{ top: "10.5%", left: "25%", position: "fixed" }}
        >
          Editore
        </Typography>
        <Select
          sx={{ top: "10%", left: "32%", position: "fixed", minWidth: "5%" }}
          value={editoreSelezionato}
          onChange={(e) => setCasaSelezionata(e.target.value)}
        >
          <MenuItem value={"Tutto"}>Tutto</MenuItem>
          <MenuItem value={"J-POP"}>J-POP</MenuItem>
          <MenuItem value={"Planet manga"}>Planet manga</MenuItem>
          <MenuItem value={"Star Comics"}>Star Comics</MenuItem>
          <MenuItem value={"Goen"}>Goen</MenuItem>
          <MenuItem value={"Altro"}>Altro</MenuItem>
        </Select>
        <Typography
          variant="h4"
          sx={{ top: "10.5%", left: "40%", position: "fixed" }}
        >
          Status
        </Typography>
        <Select
          value={statusSelezionato}
          onChange={(e) => setStatusSelezionato(e.target.value)}
          sx={{ top: "10.5%", left: "48%", position: "fixed" }}
        >
          <MenuItem value={"Tutto"}>Tutto</MenuItem>
          <MenuItem value={"Da leggere"}>Da leggere</MenuItem>
          <MenuItem value={"In lettura"}>In lettura</MenuItem>
          <MenuItem value={"In pari"}>In pari</MenuItem>
          <MenuItem value={"In pausa"}>In pausa</MenuItem>
          <MenuItem value={"Finito"}>Finito</MenuItem>
          <MenuItem value={"In rilettura"}>In rilettura</MenuItem>
        </Select>

        <Button
          sx={{ top: "50%", left: "15%", position: "fixed" }}
          onClick={handleNewBook}
          variant={"contained"}
        >
          Nuovo libro
        </Button>
        <Button
          sx={{ top: "60%", left: "16%", position: "fixed" }}
          onClick={() => {
            logoutMutation.mutate();
          }}
          variant={"contained"}
          color={"error"}
        >
          Logout
        </Button>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <TableContainer className={style.table_container}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) =>
                  header !== "id" ? (
                    <TableCell key={header} align="center">
                      {header}
                    </TableCell>
                  ) : null
                )}
                <TableCell align="center">Modifica</TableCell>
                <TableCell align="center">Elimina</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {libriToShow().map((libro, i) => (
                <TableRow key={libro.id!}>
                  {Object.entries(libro).map(([key, value], i) =>
                    key !== "id" ? (
                      <TableCell key={i} align="center">
                        {value}
                      </TableCell>
                    ) : null
                  )}
                  <TableCell align="center">
                    <Button onClick={() => handleChangeBook(libro)}>
                      <SettingsIcon color="success" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleDeleteBook(libro.id!)}>
                      <ClearIcon color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={handleRowsPerPage}
                  onRowsPerPageChange={handleNewRowPerPage}
                  page={page}
                  onPageChange={handleNextPage}
                  count={libriToShow().length}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={openModal} onClose={handleCloseWithoutSave}>
        <DialogTitle>
          <Typography variant="h5">
            {isNewBook
              ? "Aggiungi un nuovo libro alla tua collezione"
              : `Libro scelto: ${libroSelezionato.titolo}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="titolo"
            onChange={(e) => handleModificheLibro("titolo", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libroSelezionato.titolo}
          />
          <TextField
            type="number"
            label="comprati"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libroSelezionato.comprati}
            inputProps={{ inputMode: "numeric", min: 1 }}
            onChange={(e) =>
              handleModificheLibro("comprati", parseInt(e.target.value))
            }
          />
          <TextField
            type="number"
            label="letti"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libroSelezionato.letti}
            inputProps={{
              inputMode: "numeric",
              min: 0,
              max: libroSelezionato.comprati,
            }}
            onChange={(e) =>
              handleModificheLibro("letti", parseInt(e.target.value))
            }
          />
          <Select
            value={libroSelezionato.tipo}
            onChange={(e) => handleModificheLibro("tipo", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
          >
            <MenuItem value={"manga"}>Manga</MenuItem>
            <MenuItem value={"light novel"}>Light novel</MenuItem>
            <MenuItem value={"novel"}>Novel</MenuItem>
          </Select>
          <Select
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libroSelezionato.editore}
            onChange={(e) => handleModificheLibro("editore", e.target.value)}
          >
            <MenuItem value={"J-POP"}>J-POP</MenuItem>
            <MenuItem value={"Planet manga"}>Planet manga</MenuItem>
            <MenuItem value={"Star Comics"}>Star Comics</MenuItem>
            <MenuItem value={"Goen"}>Goen</MenuItem>
            <MenuItem value={"Altro"}>Altro</MenuItem>
          </Select>
          <Select
            value={libroSelezionato.status}
            onChange={(e) => handleModificheLibro("status", e.target.value)}
            sx={{ marginTop: 3, marginLeft: 3 }}
          >
            <MenuItem value={"Da leggere"}>Da leggere</MenuItem>
            <MenuItem value={"In lettura"}>In lettura</MenuItem>
            <MenuItem value={"In pari"}>In pari</MenuItem>
            <MenuItem value={"In pausa"}>In pausa</MenuItem>
            <MenuItem value={"Finito"}>Finito</MenuItem>
            <MenuItem value={"In rilettura"}>In rilettura</MenuItem>
          </Select>
          <TextField
            type="number"
            label="prezzo"
            sx={{ marginTop: 3, marginLeft: 3 }}
            value={libroSelezionato.prezzo}
            inputProps={{ min: 1 }}
            onChange={(e) =>
              handleModificheLibro("prezzo", parseFloat(e.target.value))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            sx={{ marginX: "auto", marginY: 3, width: "40%" }}
            size="large"
            variant={"contained"}
            onClick={handleCloseWithoutSave}
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session)
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  const { status, data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ROOT}/auth/session`,
    {
      withCredentials: true,
      headers: {
        cookie: serialize("session", req.cookies.session),
      },
    }
  );
  if (status != 200)
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  return {
    props: {
      user: data.data,
    },
  };
};
