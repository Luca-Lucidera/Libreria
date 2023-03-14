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
} from "@mui/material";

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
  console.log('ENV', process.env.NEXT_PUBLIC_API_ROOT)
  const [updateModalClick, setUpdateModalClick] = useState(false);
  const [createModalClick, setCreateModalClick] = useState(false);

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
      setUpdateModalClick(false);
      setCreateModalClick(false);
      setLibroSelezionato({ ...libroVuoto });
    },
  });

  const createBook = useMutation({
    mutationKey: ["create"],
    mutationFn: async () => await createLibro(libroSelezionato),
    onSuccess: () => {
      queryClient.invalidateQueries(["prendi-libri"]);
      setUpdateModalClick(false);
      setCreateModalClick(false);
      setLibroSelezionato({ ...libroVuoto });
    },
  });

  if (libriQuery.isLoading) return <div>Caricando i libri</div>;
  if (libriQuery.isError) return <div>{libriQuery.error.message}</div>;

  const libri = libriQuery.data!;
  const headers = Object.keys(libri.at(0)!);
  function handleUpdateOrCreate() {
    if (updateModalClick) updateBook.mutate();
    else createBook.mutate();
  }

  function handleClose() {
    setUpdateModalClick(false);
    setCreateModalClick(false);
    setLibroSelezionato({ ...libroVuoto });
  }

  return (
    // <div className="h-full">
    //   <div id="div-header">
    //     <h1 className="text-white text-3xl flex justify-center pt-8">
    //       Ecco i tuoi libri {user?.nome}
    //     </h1>
    //   </div>
    //   <div id="tabella-o-p">
    //     {libri?.length == 0 ? (
    //       <p className="flex justify-center text-xl text-white pt-8">
    //         Non ci sono libri ☹️
    //       </p>
    //     ) : (
    //       <Tabella
    //         libri={libri!}
    //         setLibroDaSelezionare={setLibroSelezionato}
    //         setUpdateModalClick={setUpdateModalClick}
    //       />
    //     )}
    //   </div>
    //   <div>
    //     <button
    //       onClick={() => setCreateModalClick(true)}
    //       className="text-white text-xl mt-10 ml-4 border-solid border-4 hover:border-green-800 bg-green-600 border-green-700 rounded-md p-1"
    //     >
    //       Nuovo libro
    //     </button>
    //   </div>
    //   <button
    //     className="text-white text-xl mt-10 ml-4 border-solid border-4 hover:border-red-900 bg-red-600 border-red-700 rounded-md p-1"
    //     onClick={() => logoutMutation.mutate()}
    //   >
    //     Logout
    //   </button>
    //   <Modal
    //     isOpen={updateModalClick || createModalClick}
    //     onRequestClose={handleClose}
    //     style={{
    //       content: {
    //         backgroundColor: "#27272A",
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         width: "50%",
    //         height: "70%",
    //         margin: "auto",
    //       },
    //       overlay: {
    //         backgroundColor: "rgba(0,0,0,0.5)",
    //       },
    //     }}
    //   >
    //     <ModalContent
    //       libro={libroSelezionato}
    //       setLibroSelezionato={setLibroSelezionato}
    //     />
    //     <div className="pt-4">
    //       <button
    //         onClick={handleUpdateOrCreate}
    //         className="text-white text-2xl rounded p-1 bg-green-700 hover:border-solid hover:shadow-xl"
    //       >
    //         Salva
    //       </button>
    //       <button
    //         onClick={handleClose}
    //         className="text-white text-2xl ml-4 p-1 rounded bg-red-700 hover:shadow-xl "
    //       >
    //         Chiudi senza salvare
    //       </button>
    //     </div>
    //   </Modal>
    // </div>

    <Table sx={{ maxWidth: 600, margin: "auto" }} stickyHeader>
      <TableHead color="primary">
        <TableRow>
          {headers.map((header) =>
            header !== "id" ? (
              <TableCell key={header}>{header}</TableCell>
            ) : null
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {libri.map((libro, i) => (
          <TableRow key={libro.id!}>
            {Object.entries(libro).map(([key, value ], i) => (
              key !== "id" ? <TableCell key={i}>{value}</TableCell> : null 
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // console.log('ENTRO IN SERVER SIDE PROPS')
  // if (!req.cookies.session)
  //   return { redirect: { permanent: false, destination: "/" }, props: {} };
  // console.log('FETCH DATI UTENTE')
  //   const { status, data } = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_ROOT}/auth/session`,
  //   {
  //     withCredentials: true,
  //     headers: {
  //       cookie: serialize("session", req.cookies.session),
  //     },
  //   }
  // );
  // console.log('SONO HO PASSATO IL FETCH')
  // if (status != 200)
  //   return { redirect: { permanent: false, destination: "/" }, props: {} };
  // return {
  //   props: {
  //     user: data.data,
  //   },
  // };
  return {
    props: { 
      user: {
        id: "63e219477a583146a1b784c1",
        nome: "luca",
        cognome: "lucidera",
        email: "luca@luca",
        password: "luca1234"
      }
    }
  }
};
