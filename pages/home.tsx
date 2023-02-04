import Tabella from "@/components/Tabella/Tabella";
import { getUserLibri } from "@/service/libriService";
import { getUserWithSession } from "@/service/userService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  const { data: userResponse, isLoading: loadingUser } = useQuery({
    queryKey: ["session"],
    queryFn: async () => await getUserWithSession(),
  });

  const { data: libriResponse, isLoading: loadingLibri } = useQuery({
    queryKey: ["prendi-libri", userResponse?.data?.id],
    queryFn: async () => await getUserLibri(),
    enabled: userResponse?.data?.id != null,
  });

  useEffect(() => {
    if (userResponse?.statusCode === 302 || libriResponse?.statusCode === 302) {
      router.push("/");
    }
  });
  if (loadingUser) return <div>Recuperando i dati dell'utente...</div>;
  if (loadingLibri) return <div>Recuperando i libri...</div>;

  const libri = libriResponse?.data;
  const user = userResponse?.data;

  return (
    <div>
      <h1>Ecco i tuoi libri {user?.nome}</h1>
      {libri?.length == 0 ? (
        <div>Non ci sono libri 🤨</div>
      ) : (
        <Tabella value={libri} />
      )}
    </div>
  );
}
