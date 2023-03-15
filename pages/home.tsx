import ModalContent from "@/components/ModalContent";
import Tabella from "@/components/Tabella/Tabella";
import IApiResponse from "@/interfaces/IApiResponse";
import style from "@/styles/home.module.css";
import ILibro from "@/interfaces/ILibro";
import IUser from "@/interfaces/user/IUser";
import { createLibro, getUserLibri, updateLibro } from "@/service/libriService";
import { logout } from "@/service/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  Typography
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";

Modal.setAppElement("#__next");

interface userProps {
  user: IUser;
}

const libroVuoto: ILibro = {
  titolo: "",
  comprati: 1,
  letti: 0,
  tipo: "manga",
  editore: "",
  status: "Da leggere",
  prezzo: 1,
  id: "",
};
export default function HomePage({ user }: userProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [openModal, setOpenModal] = useState(false);
  const [isNewBook, setIsNewBook] = useState(false);

  const [libroSelezionato, setLibroSelezionato] = useState<ILibro>({
    ...libroVuoto,
  });

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
    },
  });

  const createBook = useMutation({
    mutationKey: ["create"],
    mutationFn: async () => await createLibro(libroSelezionato),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setLibroSelezionato({ ...libroVuoto });
    },
  });

  if (libriQuery.isLoading) return <div>Caricando i libri</div>;
  if (libriQuery.isError) return <div>{libriQuery.error.message}</div>;

  const libri = libriQuery.data!;
  const headers = Object.keys(libri.at(0)!);

  function handleNewBook() {
    setOpenModal(true);
    setIsNewBook(true)
  }

  function handleChangeBook() {
    setOpenModal(true);
    setIsNewBook(false);
  }

  function handleDeleteBook(id: string) {

  }

  function handleClose() {
    setOpenModal(false);
    setIsNewBook(false);
  }

  // function handleUpdateOrCreate() {
  //   if (updateModalClick) updateBook.mutate();
  //   else createBook.mutate();
  // }

  // function handleClose() {
  //   setUpdateModalClick(false);
  //   setCreateModalClick(false);
  //   setLibroSelezionato({ ...libroVuoto });
  // }

  return (
    <div className={style.div_pagina}>
      <Button sx={{ top: "50%", left: "15%", position: "fixed"}} onClick={handleNewBook}>Nuovo libro</Button>
      <Table sx={{ maxWidth: "50%" }} stickyHeader>
        <TableHead color="primary" sx={{ margin: "auto" }}>
          <TableRow>
            {headers.map((header) =>
              header !== "id" ? (
                <TableCell key={header} align="center">
                  {header}
                </TableCell>
              ) : null
            )}
            <TableCell>Modifica</TableCell>
            <TableCell>Elimina</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {libri.map((libro, i) => (
            <TableRow key={libro.id!}>
              {Object.entries(libro).map(([key, value], i) =>
                key !== "id" ? (
                  <TableCell key={i} align="center">
                    {value}
                  </TableCell>
                ) : null
              )}
              <TableCell>
                <Button onClick={handleChangeBook}>
                  <SettingsIcon color="success"/>
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDeleteBook(libro.id!)}>
                  <ClearIcon color="error"/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openModal} onClose={handleClose}>
        <Typography>{isNewBook ? "Aggiungi un nuovo libro alla tua collezione" : `Libro scelto: ${libroSelezionato.titolo}`}</Typography>
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
