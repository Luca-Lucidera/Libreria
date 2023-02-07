import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { register } from "@/service/userService";
import axios from "axios";

export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation<string, Error>({
    mutationKey: ["register"],
    mutationFn: async () => await register({ nome, cognome, email, password }),
    onSuccess: () => {
      router.push("/home");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    registerMutation.mutate();
  }
  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-white text-2xl mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome" className="text-white pr-10">Nome:</label>
          <input
            type="text"
            id="nome"
            className="pl-2  rounded-md"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="cognome" className="text-white pr-3">Cognome: </label>
          <input
            type="text"
            id="cognome"
            className="pl-2  rounded-md"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="text-white pr-11">Email: </label>
          <input
            type="email"
            id="email"
            className="pl-2  rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="text-white pr-4">Password: </label>
          <input
            type="password"
            id="password"
            className="pl-2  rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button type="submit" className="text-white text-xl mt-4 border-solid border-2 rounded p-2 hover:bg-neutral-300 hover:text-black">Register</button>
        </div>
        {registerMutation.isLoading ? (
          <p className="text-white text-xl mt-4">Caricamento...</p>
        ) : null}
        {registerMutation.isError ? (
          <p className="text-red text-2xl mt-4">{registerMutation.error.message}</p>
        ) : null}
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session) return { props: {} };
  const { status } = await axios.get(process.env.API_ROOT_URL + "/api/auth/session", {
    withCredentials: true,
    headers: {
      cookie: serialize("session", req.cookies.session),
    }
  })
  if (status == 200)
    return { redirect: { permanent: false, destination: "/home" }, props: {} };
  return {
    props: {},
  };
};
