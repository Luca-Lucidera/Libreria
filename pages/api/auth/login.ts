import { prisma } from "utils/prisma";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
) {
  if (req.method === "POST") {
    try {
      const { email, password } = JSON.parse(req.body) as {
        email: string;
        password: string;
      };
      if (!email || !password) {
        return res.status(400).json({ message: "Body mancante" });
      }
      const user = await prisma.users.findFirst({
        where: {
          email: email,
          password: password,
        },
      });

      if (!user)
        return res.status(404).json({ message: "Credenziali errate" });

      const expires = new Date(Date.now() + 3600000 * 24); //24 = numero di ore, 3600000: millisecondi == 1 ora
      const now = new Date();
      const sessionUUID = randomUUID();
      const sessionCookie = cookie.serialize("session", sessionUUID, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expires,
        path: "/",
      });

      await prisma.userLogin.upsert({
        create: {
          userId: user.id,
          sessionId: sessionUUID,
          expiresDate: expires,
          lastLogin: now,
        },
        update: {
          sessionId: sessionUUID,
          expiresDate: expires,
          lastLogin: new Date(),
        },
        where: {
          userId: user.id,
        },
      });
      
      return res
        .setHeader("Set-Cookie", sessionCookie)
        .status(200)
        .json({ data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Errore interno al server, ci scusiamo per il disagio"});
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo POST"})
  }
}
