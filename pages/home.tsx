import Tabella from "@/components/Tabella/Tabella";
import ILibro from "@/interfaces/ILibro";
import IUser from "@/interfaces/user/IUser";
import { getUserLibri } from "@/service/libriService";
import { getUserWithSession, logout } from "@/service/userService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

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
        <div>Non ci sono libri 🤨</div>
      ) : (
        <Tabella value={libri!} />
      )}
      <button
        className="text-white text-3xl"
        onClick={() => logoutMutation.mutate()}
      >
        Logout
      </button>
    </div>
  );
}
