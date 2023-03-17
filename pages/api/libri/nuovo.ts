import IApiResponse from "@/interfaces/IApiResponse";
import ILibro from "@/interfaces/ILibro";
import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
  if (req.method === "POST") {
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
      if (!data)
        return res.status(302).json({ message: "sessione non trovata" });
      const { userId, expires } = data!;
      if (new Date() > expires)
        return res.status(302).json({ message: "sessione scaduta" });
      if (!userId)
        return res.status(302).json({ message: "utente non trovato" });
      const libro = req.body.libro as ILibro;
      if (!libro)
        return res.status(400).json({ message: "Inserire il libro nuovo" });
      const libreria = (await prisma.libri.findMany({
        where: { userId: userId },
      })) as ILibro[];
      const libroTrovato = libreria.find((l) =>
        l.titolo.toLowerCase().includes(libro.titolo.toLowerCase())
      );
      if (libroTrovato)
        return res.status(400).json({ message: "Il libro inserito c'è già" });
      const libroCreato = await prisma.libri.create({
        data: {
          comprati: libro.comprati,
          editore: libro.editore,
          letti: libro.letti,
          prezzo: libro.prezzo,
          status: libro.status,
          tipo: libro.tipo,
          titolo: libro.titolo,
          userId: userId,
        },
      });
      if (!libroCreato)
        return res
          .status(404)
          .json({ message: "Errore nella creazione del libro" });
      return res.status(200).json({ message: "ok" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO POST" });
  }
}
