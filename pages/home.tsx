import style from "@/styles/home.module.css";
import ILibro, { libroVuoto } from "@/interfaces/ILibro";
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
import TableFilter from "@/components/mui/Modal/TableFilter";
import { IEditore } from "@/interfaces/Editore";
import { IStatus } from "@/interfaces/Status";
import CambiaONuovoLibro from "@/components/mui/Modal/Libro";

interface userProps {
  user: IUser;
}

export default function HomePage({ user }: userProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  //Da qui rework dello state
  //MODAL
  const [apriDialogFiltri, setApriDialogFiltri] = useState(false);
  const [editoreScelto, setEditoreScelto] = useState<IEditore>("Tutti");
  const [statusScelto, setStatusScelto] = useState<IStatus>("Tutti");
  const [openModalLibro, setOpenModalLibro] = useState(false);
  const [isLibroNuovo, setIsLibroNuovo] = useState(false);
  const [liboDaCreareOModificare, setLibroDaCreareOModificare] =
    useState<ILibro>({ ...libroVuoto });

  //TABLE
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const [righePerPagina, setRighePerPagina] = useState(-1);

  const filtraLibri = (): ILibro[] => {
    let libriFiltrati = [...libri];
    if (editoreScelto !== "Tutti")
      libriFiltrati = libriFiltrati.filter(
        (libro) => libro.editore === editoreScelto
      );
    if (statusScelto !== "Tutti")
      libriFiltrati = libriFiltrati.filter(
        (libro) => libro.status === statusScelto
      );
    return libriFiltrati;
  };

  const libriDaMostrare = (): ILibro[] => {
    const libriFiltrati: ILibro[] = filtraLibri();
    const inizio = paginaCorrente * righePerPagina;
    const fine = paginaCorrente * righePerPagina + righePerPagina;
    if (fine < 0) return libriFiltrati;
    return libriFiltrati.slice(inizio, fine);
  };

  const handleDialogModificheONuovoLibro = (
    isNewBook: boolean,
    libro = { ...libroVuoto }
  ) => {
    setOpenModalLibro(true);
    setIsLibroNuovo(isNewBook);
    setLibroDaCreareOModificare(libro);
  };

  //TANSTACK QUERY
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
    mutationFn: async () => await updateLibro(liboDaCreareOModificare),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroDaCreareOModificare({ ...libroVuoto });
      setOpenModalLibro(false);
      setIsLibroNuovo(false);
    },
  });

  const createBook = useMutation({
    mutationKey: ["create"],
    mutationFn: async () => await createLibro(liboDaCreareOModificare),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroDaCreareOModificare({ ...libroVuoto });
      setOpenModalLibro(false);
      setIsLibroNuovo(false);
    },
  });

  
  const aggiungiLibro = () => createBook.mutate();
  const modificaLibro = () => updateBook.mutate();
  const triggerLogout = () => logoutMutation.mutate();

  if (libriQuery.isLoading) {
    return (
      <CircularProgress
        color="primary"
        sx={{ position: "fixed", left: "50%", top: "50%" }}
      />
    );
  }
  if (libriQuery.isError) {
    return (
      <Typography
        color="red"
        variant="h4"
        position="fixed"
        top="50%"
        left="50%"
      >
        {libriQuery.error.message}
      </Typography>
    );
  }

  const libri = libriQuery.data!;

  if (libri.length == 0) {
    return (
      <>
        <Button
          variant="contained"
          sx={{ position: "fixed", top: "50%", left: "50%" }}
          onClick={(e) => {
            handleDialogModificheONuovoLibro(true);
          }}
        >
          Nuovo libro
        </Button>
        <CambiaONuovoLibro
          open={openModalLibro}
          setOpen={setOpenModalLibro}
          isNewBook={isLibroNuovo}
          setIsNewBook={setIsLibroNuovo}
          libro={liboDaCreareOModificare}
          setLibro={setLibroDaCreareOModificare}
          create={aggiungiLibro}
          update={modificaLibro}
        />
      </>
    );
  }

  const headers = [
    "titolo",
    "comprati",
    "letti",
    "tipo",
    "editore",
    "status",
    "prezzo",
    "modifica",
    "elimina",
  ];





  return (
    <>
      <Box height="100%">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          height="100%"
        >
          <Grid item paddingTop="3%" height="20%">
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => setApriDialogFiltri(true)}
            >
              Filtri
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: "50px" }}
              onClick={(e) => {
                handleDialogModificheONuovoLibro(true);
              }}
            >
              Nuovo libro
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: "50px" }}
              color="error"
              onClick={triggerLogout}
            >
              Logout
            </Button>
          </Grid>
          <Grid item height="70%">
            <TableContainer
              sx={{ height: "100%", width: "60vw", scrollBehavior: "smooth" }}
              className={style.table_container}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {headers.map((h) => (
                      <TableCell
                        key={`header-${h}`}
                        sx={{ backgroundColor: "black" }}
                        align="center"
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {libriDaMostrare().map((libro) => (
                    <TableRow key={libro.id}>
                      {Object.entries(libro).map(([key, value], i) =>
                        key !== "id" ? (
                          <TableCell key={i} align="center">
                            {value}
                          </TableCell>
                        ) : null
                      )}
                      <TableCell align="center">
                        <Button
                          onClick={() =>
                            handleDialogModificheONuovoLibro(false, libro)
                          }
                        >
                          <SettingsIcon color="success" />
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => alert("NON IMPLEMENTATA")}>
                          <ClearIcon color="error" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TablePagination
                    sx={{
                      position: "sticky",
                      bottom: 0,
                      backgroundColor: "black",
                    }}
                    count={filtraLibri().length}
                    page={paginaCorrente}
                    rowsPerPage={righePerPagina}
                    rowsPerPageOptions={
                      filtraLibri().length > 5
                        ? [5, 10, 20, { value: -1, label: "Tutti" }]
                        : []
                    }
                    onRowsPerPageChange={(e) => {
                      setRighePerPagina(+e.target.value);
                      setPaginaCorrente(0);
                    }}
                    onPageChange={(e, nuovaPagina) => {
                      setPaginaCorrente(nuovaPagina);
                    }}
                  />
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      <TableFilter
        open={apriDialogFiltri}
        setOpen={setApriDialogFiltri}
        editoreScelto={editoreScelto}
        setEditoreScelto={setEditoreScelto}
        statusScelto={statusScelto}
        setStatusScelto={setStatusScelto}
      />
      <CambiaONuovoLibro
        open={openModalLibro}
        setOpen={setOpenModalLibro}
        isNewBook={isLibroNuovo}
        setIsNewBook={setIsLibroNuovo}
        libro={liboDaCreareOModificare}
        setLibro={setLibroDaCreareOModificare}
        create={aggiungiLibro}
        update={modificaLibro}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session)
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  try {
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
  } catch (error) {
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  }
};
