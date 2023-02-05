import Tabella from "@/components/Tabella/Tabella";
import ILibro from "@/interfaces/ILibro";
import IUser from "@/interfaces/user/IUser";
import { getUserLibri } from "@/service/libriService";
import { getUserWithSession, logout } from "@/service/userService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");
export default function HomePage() {
  const router = useRouter();
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

  const userQuery = useQuery<IUser, Error>({
    queryKey: ["session"],
    queryFn: async () => await getUserWithSession(),
  });

  const libriQuery = useQuery<ILibro[], Error>({
    queryKey: ["prendi-libri"],
    queryFn: async () => await getUserLibri(),
    enabled: userQuery.data?.id != null,
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => await logout(),
    onSuccess: () => {
      router.push("/");
    },
  });

  if (userQuery.isLoading)
    return <div className="text-white">Caricando l'utente</div>;

  if (userQuery.isError)
    return (
      <div className="text-red-600 text-2xl">{userQuery.error.message}</div>
    );

  if (libriQuery.isLoading)
    return <div className="text-white text-2xl">Caricando i libri</div>;
  if (libriQuery.isError)
    return (
      <div className="text-red-600 text-2xl">{libriQuery.error.message}</div>
    );
  const user = userQuery.data!;
  const libri = libriQuery.data!;
  return (
    <div>
      <h1>Ecco i tuoi libri {user?.nome}</h1>
      {libri?.length == 0 ? (
        <div>Non ci sono libri ☹️</div>
      ) : (
        <>
          <Tabella
            value={libri!}
            setLibroDaSelezionare={setLibroSelezionato}
            setOpenModal={setOpenModal}
          />
        </>
      )}
      <div>
        {/* qui inserire il modal */}
        <Modal
          isOpen={openModal}
          shouldCloseOnOverlayClick={true}
          style={{
            content: {
              backgroundColor: "#27272A",
            },
            overlay: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          <div>
            <label htmlFor="titolo" className="text-white text-2xl pr-2">
              Titolo
            </label>
            <input
              type="text"
              id="titolo"
              className="rounded pl-2 "
              value={libroSelezionato.titolo}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  titolo: e.target.value,
                })
              }
            />
          </div>
          <div className="pt-4">
            <label htmlFor="numero" className="text-white text-2xl pr-2">
              Numeri che possiedi
            </label>
            <input
              type="number"
              id="numero"
              className="rounded pl-2 "
              value={libroSelezionato.numero!}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  numero: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="pt-4">
            <label htmlFor="tipo" className="text-white text-2xl pr-2">
              Tipo
            </label>
            <select
              id="tipo"
              className="rounded pl-2 "
              value={libroSelezionato.tipo}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  tipo: e.target.value,
                })
              }
            >
              <option value="manga">Manga</option>
              <option value="light novel">Light novel</option>
              <option value="novel">Novel</option>
            </select>
          </div>
          <div className="pt-4">
            <label htmlFor="casa" className="text-white text-2xl pr-2">
              Casa editrice
            </label>
            <input
              type="text"
              id="casa"
              className="rounded pl-2 "
              value={libroSelezionato.casa_editrice}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  casa_editrice: e.target.value,
                })
              }
            />
          </div>
          <div className="pt-4">
            <label htmlFor="status" className="text-white text-2xl pr-2">
              Status
            </label>
            <select
              className="rounded pl-2 "
              id="status"
              value={libroSelezionato.status}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  status: e.target.value,
                })
              }
            >
              <option value="Da leggere">Da leggere</option>
              <option value="In lettura">In lettura</option>
              <option value="In pari">In pari</option>
              <option value="Finito">Finito</option>
              <option value="In rilettura">In rilettura</option>
            </select>
          </div>
          <div className="pt-4">
            <label htmlFor="letti" className="text-white text-2xl pr-2">
              Volumi che hai letto
            </label>
            <input
              className="rounded pl-2 "
              type="number"
              id="letti"
              max={libroSelezionato.numero!}
              min={0}
              value={libroSelezionato.volumi_letti}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  volumi_letti: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="pt-4">
            <label htmlFor="prezzo" className="text-white text-2xl pr-2">
              Prezzo
            </label>
            <input
              className="rounded pl-2 "
              type="number"
              id="prezzo"
              value={libroSelezionato.prezzo!}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  prezzo: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="pt-4">
            <label htmlFor="colore" className="text-white text-2xl pr-2">
              Colore
            </label>
            <input
              className="rounded pl-2 pr-2"
              type="color"
              id="colore"
              value={libroSelezionato.colore}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libroSelezionato,
                  colore: e.target.value,
                })
              }
            />
          </div>
          <div className="pt-4">
            <button
              onClick={() => setOpenModal(false)}
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
      </div>
      <button
        className="text-white text-3xl"
        onClick={() => logoutMutation.mutate()}
      >
        Logout
      </button>
    </div>
  );
}
