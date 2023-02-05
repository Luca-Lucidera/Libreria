import ModalContent from "@/components/ModalContent";
import Tabella from "@/components/Tabella/Tabella";
import IApiResponse from "@/interfaces/IApiResponse";
import ILibro from "@/interfaces/ILibro";
import IUser from "@/interfaces/user/IUser";
import { getUserLibri, updateLibro } from "@/service/libriService";
import { logout } from "@/service/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");
interface userProps {
  user: IUser;
}
export default function HomePage({ user }: userProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [libroSelezionato, setLibroSelezionato] = useState<ILibro>({
    titolo: "",
    casa_editrice: "",
    colore: "",
    numero: 0,
    prezzo: 0,
    status: "",
    tipo: "",
    volumi_letti: 0,
  });
  const [openModal, setOpenModal] = useState(false);

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
      queryClient.invalidateQueries(["prendi-libri"])
      setOpenModal(false)
    }
  });

  if (libriQuery.isLoading)
    return <div className="text-white text-2xl">Caricando i libri</div>;
  if (libriQuery.isError)
    return (
      <div className="text-red-600 text-2xl">{libriQuery.error.message}</div>
    );

  const libri = libriQuery.data!;

  return (
    <div className="h-screen">
      <h1 className="text-white text-3xl flex justify-center pt-8">
        Ecco i tuoi libri {user?.nome}
      </h1>
      {libri?.length == 0 ? (
        <div>Non ci sono libri ☹️</div>
      ) : (
        <Tabella
          libri={libri!}
          setLibroDaSelezionare={setLibroSelezionato}
          setOpenModal={setOpenModal}
        />
      )}
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        style={{
          content: {
            backgroundColor: "#27272A",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            height: "70%",
            margin: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <ModalContent
          libro={libroSelezionato}
          setLibroSelezionato={setLibroSelezionato}
        />
        <div className="pt-4">
          <button
            onClick={() => updateBook.mutate()}
            className="text-white text-2xl rounded p-1 bg-green-700 hover:border-solid hover:shadow-xl"
          >
            Salva
          </button>
          <button
            onClick={() => setOpenModal(false)}
            className="text-white text-2xl ml-4 p-1 rounded bg-red-700 hover:shadow-xl "
          >
            Chiudi senza salvare
          </button>
        </div>
      </Modal>

      <button
        className="text-white text-3xl mt-20 ml-4 border-solid border-4 hover:border-red-900 bg-red-600 border-red-700 rounded-md p-1"
        onClick={() => logoutMutation.mutate()}
      >
        Logout
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session)
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  const resp = await fetch("http://localhost:3000/api/auth/session", {
    method: "GET",
    credentials: "include",
    headers: {
      cookie: serialize("session", req.cookies.session),
    },
  });

  const body = (await resp.json()) as IApiResponse<IUser>;
  if (resp.status != 200)
    return { redirect: { permanent: false, destination: "/" }, props: {} };
  return {
    props: {
      user: body.data,
    },
  };
};
