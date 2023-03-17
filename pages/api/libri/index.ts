import ILibro from "@/interfaces/ILibro";
import IApiResponse from "@/interfaces/IApiResponse";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<ILibro[]>>
) {
  if (req.method === "GET") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) return res.status(302).json({ message: "uuid non trovato" });
      const data = await prisma.logins.findFirst({
        where: {
          sessionUUID: sessionUUID,
        },
        select: {
          expires: true,
          userId: true,
        },
      });
      if(!data) return res.status(302).json({ message: "sessione non trovata" })
      const { expires, userId } = data!
      if(new Date() > expires) return res.status(302).json({ message: "sessione scaduta" })
      if(!userId) return res.status(302).json({ message: "utente non trovato" })
      const user = await prisma.users.findFirst({ where: { id: userId } })
      if(!user) return res.status(302).json({ message: "utente non trovato" })
      const libri = await prisma.libri.findMany({ 
        where: {
          userId: user.id
        },
        select: {
          id: true,
          titolo: true,
          comprati: true,
          letti: true,
          tipo: true,
          editore: true,
          status: true,
          prezzo: true,
        }
      }) as ILibro[];
      return res.status(200).json({data: libri})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Errore interno al server, ci scusiamo per il disagio" });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO GET" });
  }
}
