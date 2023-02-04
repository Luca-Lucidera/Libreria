import prisma from "utils/prisma";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import IApiResponse from "@/interfaces/IApiResponse";
import IUser  from "@/interfaces/user/IUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ statusCode: 400, message: "body mancante" });
      }
      const user = await prisma.users.findFirst({
        where: {
          email: email,
          password: password,
        },
      });

      if (!user)
        return res.json({ statusCode: 404, message: "Utente non trovato" });

      const expires = new Date(Date.now() + 3600000 * 24); //24 = numero di ore, 3600000: millisecondi == 1 ora
      const now = new Date();
      const sessionUUID = randomUUID();
      const sessionCookie = cookie.serialize("session", sessionUUID, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expires,
        path: "/"
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
      return res.setHeader("Set-Cookie", sessionCookie).json({ statusCode: 200, data: user });
    } catch (error) {
      console.error(error);
      return res.json({ statusCode: 500, message: "errore interno al server" });
    }
  } else {
    return res.json({ statusCode: 405 });
  }
}
