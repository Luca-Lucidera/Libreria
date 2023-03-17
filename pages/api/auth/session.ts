import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";
import { prisma } from "@/utils/prisma";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
) {
  if (req.method === "GET") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID)
        return res.status(302).json({ message: "uuid non trovato" });
      const data = await prisma.logins.findFirst({
        where: {
          sessionUUID: sessionUUID,
        },
        select: {
          expires: true,
          userId: true,
        },
      });

      const date = new Date();
      date.setDate(date.getDate() - 2);
      const sessionRemoved = serialize("session", "", {
        expires: date,
        path: "/",
      });
      res.setHeader("Set-Cookie", sessionRemoved);

      if (!data)
        return res.status(302).json({ message: "sessione non trovata" });

      const { expires, userId } = data!;
      if (new Date() > expires)
        return res.status(302).json({ message: "sessione scaduta" });

      if (!userId)
        return res.status(302).json({ message: "utente non trovato" });
      const utente = await prisma.users.findFirst({ where: { id: userId } });
      if (!utente)
        return res.status(302).json({ message: "utente non trovato" });
      return res.status(200).json({ data: utente });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO GET" });
  }
}
