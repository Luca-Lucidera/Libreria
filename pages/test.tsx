import axios from "axios"
import { useRouter } from "next/router"

export default function Test() {
    const router = useRouter();

    async function login() {
        const {data} = await axios.post("http://localhost:3000/api/test", { data: "login"})
        console.log(data)
    }

    async function logout() {
        const { data } = await axios.post("http://localhost:3000/api/test", { data: "logout"})
        console.log(data)
        if(data.statusCode === 200) {
            router.push("/")
        } else {
            console.log("ti puzza il culo")
        }
    }
    return (
        <>
            <div>
                <button onClick={login} className="text-white text-3xl">Login</button>
            </div>
            <div>
                <button onClick={logout} className="text-white text-3xl">Logout</button>
            </div>
        </>
    )
}