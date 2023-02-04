import IApiResponse from '@/interfaces/IApiResponse'
import ILibro from '@/interfaces/ILibro'
import axios from 'axios'

axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true
})

export async function getUserLibri() {
    const { data } = await axios.get<IApiResponse<ILibro[]>>("/api/libri")
    return data
}