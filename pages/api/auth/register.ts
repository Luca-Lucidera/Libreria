import IApiResponse from "@/interfaces/IApiResponse";
import IUserRegisterDTO from "@/interfaces/user/IUserRegisterDTO";
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
      
      const expires = new Date(Date.now() + 3600000 * 24); //24 = numero di ore, 3600000: millisecondi == 1 ora
      const now = new Date();
      const sessionUUID = randomUUID();
      const sessionCookie = serialize("session", sessionUUID, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expires,
        path: "/",
      });

      await prisma.logins.create({
        data: {
          userId: user.id,
          sessionUUID: sessionUUID,
          expires: expires,
          lastLogin: now,
        },
      });

      return res
        .setHeader("Set-Cookie", sessionCookie)
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
