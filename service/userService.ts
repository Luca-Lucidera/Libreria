import IApiResponse from '@/interfaces/IApiResponse';
import IUser from "@/interfaces/user/IUser";
import UserLoginDTO from "@/interfaces/user/IUserLoginDTO";
import axios from "axios"

axios.create({
    baseURL: "http://localhost:300",
    withCredentials: true
})

export async function login({email, password}: UserLoginDTO) {
    const {data} = await axios.post<IApiResponse<IUser>>("/api/auth/login", { email, password })
    return data;
}

export async function getUserWithSession() {
    const { data } = await axios.get<IApiResponse<IUser>>("/api/auth/session")
    return data
}