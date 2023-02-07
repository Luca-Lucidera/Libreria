import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";
import UserLoginDTO from "@/interfaces/user/IUserLoginDTO";
import IUserRegisterDTO from "@/interfaces/user/IUserRegisterDTO";

export async function register({nome, cognome, email, password}: IUserRegisterDTO) {
  const resp = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ nome, cognome, email, password})
  })
  const body = await resp.json() as IApiResponse<any>
  if(resp.status != 200) throw new Error(body.message)
  return "ok"
}

export async function login({ email, password }: UserLoginDTO) {
  const resp = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const body = await resp.json() as IApiResponse<IUser>
  if(resp.status != 200) throw new Error(body.message)
  return body.data!;
}

export async function getUserWithSession() {
  const resp = await fetch("/api/auth/session", {
    credentials: "include"
  })
  const body = await resp.json() as IApiResponse<IUser>
  if(resp.status != 200) throw new Error(body.message)
  return body.data!;
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "DELETE",
    credentials: "include"
  })
  return "ok";
}


