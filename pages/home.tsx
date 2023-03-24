import CambiaONuovoLibro from "@/components/mui/Modal/Libro";
import TableFilter from "@/components/mui/Modal/TableFilter";
import { IEditore } from "@/model/Editore";
import Libro, { libroVuoto } from "@/model/Libro";
import { IStatus } from "@/model/Status";
import { headers } from "@/model/TableHeader";
import IUser from "@/model/user/IUser";
import {
  createLibro,
  deleteLibro,
  getUserLibri,
  updateLibro
} from "@/service/libriService";
import { logout } from "@/service/userService";
import style from "@/styles/home.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

interface userProps {
  user: IUser;
}

export default function HomePage({ user }: userProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [apriDialogFiltri, setApriDialogFiltri] = useState(false);
  const [editoreScelto, setEditoreScelto] = useState<IEditore>("Tutti");
  const [statusScelto, setStatusScelto] = useState<IStatus>("Tutti");
  const [openModalLibro, setOpenModalLibro] = useState(false);
  const [isLibroNuovo, setIsLibroNuovo] = useState(false);
  const [liboDaCreareOModificare, setLibroDaCreareOModificare] =
    useState<Libro>({ ...libroVuoto });

  //TABLE
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const [righePerPagina, setRighePerPagina] = useState(-1);

  const filtraLibri = (): Libro[] => {
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

  const libriDaMostrare = (): Libro[] => {
    const libriFiltrati: Libro[] = filtraLibri();
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
  const libriQuery = useQuery<Libro[], Error>({
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

  const deleteBook = useMutation({
    mutationKey: ["delete-book"],
    mutationFn: async (id: string) => await deleteLibro(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroDaCreareOModificare({ ...libroVuoto });
      setOpenModalLibro(false);
      setIsLibroNuovo(false);
    },
    onError: (error) => {
      console.error("Errore elimina libro: ", error);
      alert("Errore nell eliminazione del libro");
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={(e) => {
              handleDialogModificheONuovoLibro(true);
            }}
          >
            Nuovo libro
          </Button>
        </div>
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

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        height="100%"
      >
        <Grid item height="10%" paddingTop="1.5%">
          <Typography variant="h4">
            {new Date().getHours() < 12
              ? "Buongiorno "
              : new Date().getHours() < 18
              ? "Buon pomeriggio "
              : "Buonasera "}
            {user.nome}
          </Typography>
        </Grid>
        <Grid item height="20%" paddingTop="3%" >
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
                      <Button onClick={() => deleteBook.mutate(libro.id!)}>
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
