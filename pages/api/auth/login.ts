import { prisma } from "utils/prisma";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import IApiResponse from "@/model/ApiResponse";
import IUser from "@/model/user/IUser";
import { setSessionCookie } from "@/service/server/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      if (!email || !password) {
        return res.status(400).json({ message: "Credenziali mancanti" });
      }
      const user = await prisma.users.findFirst({
        where: {
          email: email,
          password: password,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Errore nelle credenziali" });
      }

      const data = await setSessionCookie(user);

      if (data.isError) {
        return res
          .status(400)
          .json({ message: data.message! });
      }

      return res
        .setHeader("Set-Cookie", data.data!)
        .status(200)
        .json({ data: user });
    } catch (error) {
      console.error("/auth/login error", error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo POST" });
  }
}
