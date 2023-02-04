import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { login } from "@/service/userService";
import { useRouter } from "next/router";
import Error from "@/components/Error";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { data, refetch, isLoading, isFetching, status } = useQuery({
    queryKey: ["login"],
    queryFn: async () => await login({ email, password }),
    enabled: false,
  });

  useEffect(() => {
    if (status == "success") {
      console.log(data)
      if (data.statusCode == 200) router.push("/home");
      else setError(data.message!)
    }
  })

  

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    refetch();
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
      {isLoading && isFetching ? <div>Caricamento</div> : <template></template>}
      {error != "" ? <Error message={data!.message!} class={"pt-4 text-red-700"}/> : null}
    </div>
  );
}
