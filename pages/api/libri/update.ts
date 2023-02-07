import IApiResponse from "@/interfaces/IApiResponse";
import ILibro from "@/interfaces/ILibro";
import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
  if (req.method === "PUT") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) return res.status(302).json({ message: "uuid non trovato" });
      const data = await prisma.logins.findFirst({
        where: {
          sessionUUID: sessionUUID,
        },
        select: {
          expires: true,
          User: true,
        },
      });
      if(!data) return res.status(302).json({ message: "sessione non trovata" })
      const { User: user, expires } = data!
      if(new Date() > expires) return res.status(302).json({ message: "sessione scaduta" })
      if(!user) return res.status(302).json({ message: "utente non trovato" })
      const libro = JSON.parse(req.body) as ILibro
      if(!libro) return res.status(400).json({ message: "Inserire il libro nuovo"})
      const {id, ...libroNoId} = libro
      const libroDB = await prisma.libri.update({where:{ id: id }, data: libroNoId})
      if(!libroDB) return res.status(400).json({message: "Errore nell'update"})
      return res.status(200).json({ message: "ok" })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Errore interno al server, ci scusiamo per il disagio" });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO PUT" });
  }
}