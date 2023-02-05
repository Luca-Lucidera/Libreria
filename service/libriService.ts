import IApiResponse from '@/interfaces/IApiResponse'
import ILibro from '@/interfaces/ILibro'
import axios from 'axios'

axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true
})

export async function getUserLibri() {
    const resp = await fetch("/api/libri", { 
        credentials: "include"
    })
    const body = await resp.json() as IApiResponse<ILibro[]>
    if(resp.status != 200) throw new Error(body.message)
    return body.data!
}

export async function updateLibro(libro: ILibro) {
    const resp = await fetch("/api/libri/update", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(libro)
    })
    const body = await resp.json() as IApiResponse<any>
    if(resp.status != 200) throw new Error(body.message)
    return "ok"
}