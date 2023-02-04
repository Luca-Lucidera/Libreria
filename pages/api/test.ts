import { NextApiRequest, NextApiResponse } from "next";
import IApiResponse from "@/interfaces/IApiResponse";
import { serialize } from "cookie";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IApiResponse<any>>
) {
    if(req.body.data === "login") {
        const exp = new Date()
        exp.setDate(5)

        res.setHeader("Set-Cookie", serialize("session", "ciao", { expires: exp, path: "/", sameSite: "lax"}))
        res.json({statusCode: 200})
    } else {
        const exp = new Date()
        exp.setDate(-1)
        res.setHeader("Set-Cookie", serialize("session", "ciao", { expires: exp, path: "/", sameSite: "lax"}))
        res.json({statusCode: 200})    
    }
}