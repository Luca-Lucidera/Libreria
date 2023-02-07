import IApiResponse from "@/interfaces/IApiResponse";
import ILibro from "@/interfaces/ILibro";
import axios, { AxiosError } from "axios";

export async function getUserLibri() {
  try {
    const { data } = await axios.get<IApiResponse<ILibro[]>>("/api/libri", {
      withCredentials: true,
    });
    return data.data!
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<ILibro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
  
}

export async function updateLibro(libro: ILibro) {
  try {
    const resp = await axios.put<IApiResponse<any>>("/api/libri/update", { libro },  {
      withCredentials: true, 
    });
    return "ok"
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<ILibro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}

export async function createLibro(libro: ILibro) {
  try {
    const resp = await axios.post<IApiResponse<any>>("/api/libri/nuovo", { libro }, {
      withCredentials: true,
    });
    return "ok"
  }  catch (error: any) {
    const axiosError: AxiosError<IApiResponse<ILibro>> = error;
    throw new Error(axiosError.response!.data.message);
  }
}
