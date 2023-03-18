import IApiResponse from "@/model/ApiResponse";
import IUserRegisterDTO from "@/model/user/IUserRegisterDTO";
import { setSessionCookie } from "@/service/server/authService";
import { prisma } from "@/utils/prisma";
import { serialize } from "cookie";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IApiResponse<any>>) {
  if (req.method === "POST") {
    try {
      const { nome, cognome, email, password } = req.body as IUserRegisterDTO;
      if(!nome || !cognome || !email || !password) return res.status(400).json({ message: "Credenziali mancano"})

      const userFound = await prisma.users.findFirst({
        where: {
          email: email
        },
      });

      if (userFound) return res.status(404).json({ message: "Utente già esistente" });

      const user = await prisma.users.create({
        data: {
            nome: nome,
            cognome: cognome,
            email: email,
            password: password
        }
      })
      
      const data = await setSessionCookie(user)
      if(data.isError) {
        return res.status(400).json({ message: data.message! })
      }
      
      return res
        .setHeader("Set-Cookie", data.data!)
        .status(200)
        .json({ data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo POST" });
  }
}
