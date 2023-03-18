import IApiResponse from "@/model/ApiResponse";
import Libro from "@/model/Libro";
import axios, { AxiosError } from "axios";

export async function getUserLibri() {
  try {
    const { data } = await axios.get<IApiResponse<Libro[]>>(`${process.env.NEXT_PUBLIC_API_ROOT}/libri`, {
      withCredentials: true,
    });
    return data.data!
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<Libro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
  
}

export async function updateLibro(libro: Libro) {
  try {
    
    const resp = await axios.put<IApiResponse<any>>(`${process.env.NEXT_PUBLIC_API_ROOT}/libri/update`, { libro },  {
      withCredentials: true, 
    });
    return "ok"
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<Libro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}

export async function createLibro(libro: Libro) {
  try {
    const resp = await axios.post<IApiResponse<any>>(`${process.env.NEXT_PUBLIC_API_ROOT}/libri/nuovo`, { libro }, {
      withCredentials: true,
    });
    return "ok"
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<Libro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}
