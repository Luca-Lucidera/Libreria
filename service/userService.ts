import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";
import UserLoginDTO from "@/interfaces/user/IUserLoginDTO";
import IUserRegisterDTO from "@/interfaces/user/IUserRegisterDTO";
import axios, { AxiosError } from "axios";

export async function register({
  nome,
  cognome,
  email,
  password,
}: IUserRegisterDTO) {
  try {
    const { data } = await axios.post<IApiResponse<IUser>>(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/register`,{ nome, cognome, email, password });
    return "ok";
  } catch (error: any) {
    const axiosError: AxiosError<IApiResponse<IUser>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}

export async function login({ email, password }: UserLoginDTO) {
  try {
    const { data } = await axios.post<IApiResponse<IUser>>(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/login`, { email, password });
    return data.data!;
  } catch (error: any) {
    const axiosError: AxiosError<IApiResponse<IUser>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}
export async function logout() {
  try {
    const { data } = await axios.delete<IApiResponse<any>>(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/logout`, {
      withCredentials: true,
    });
    return data.data;
  } catch (error: any) {
    const axiosError: AxiosError<IApiResponse<IUser>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}
