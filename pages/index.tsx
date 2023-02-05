import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/service/userService";
import { useRouter } from "next/router";
import IUser from "@/interfaces/user/IUser";
import ErrorComponent from "@/components/Error";
import { GetServerSideProps } from "next";
import { serialize } from "cookie";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation<IUser, Error>({
    mutationFn: async () => await login({ email, password }),
    onSuccess: (user) => {
      router.push("/home");
    },
    cacheTime: 0,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate();
  }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-white text-2xl mb-4">Login!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="text-white pr-11">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="pl-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="text-white pr-4">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="pl-2  rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="text-white ml-auto mr-auto rounded bg-green-700 pl-2 pr-2 pb-1 pt-1"
          >
            Login
          </button>
        </div>
      </form>
      {loginMutation.isLoading ? (
        <div className="text-white text-2xl">Let the server cook...</div>
      ) : null}
      {loginMutation.isError ? (
        <div className="text-red-600 text-2xl">
          {loginMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session) return { props: {} };
  const resp = await fetch("http://localhost:3000/api/auth/session", {
    method: "GET",
    credentials: "include",
    headers: {
      cookie: serialize("session", req.cookies.session),
    },
  });
  if (resp.status == 200)
    return { redirect: { permanent: false, destination: "/home" }, props: {} };
  return {
    props: {},
  };
};
