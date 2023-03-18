import IApiResponse from "@/model/ApiResponse";
import Libro from "@/model/Libro";
import { checkSession } from "@/service/server/authService";
import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
  if (req.method === "PUT") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) {
        return res.status(302).json({ message: "uuid non trovato" });
      }

      const session = await checkSession(sessionUUID);

      if (session.isError) {
        return res.status(302).json({ message: session.message! });
      }

      const libro = req.body.libro as Libro;

      if (!libro) {
        return res.status(400).json({ message: "Inserire il libro nuovo" });
      }

      const libroDB = await prisma.libri.update({
        where: {
          id: libro.id!,
        },
        data: {
          comprati: libro.comprati,
          editore: libro.editore,
          letti: libro.letti,
          prezzo: libro.prezzo,
          status: libro.status,
          tipo: libro.tipo,
          titolo: libro.titolo,
        },
      });

      if (!libroDB) {
        return res.status(400).json({ message: "Errore nell'update" });
      }

      return res.status(200).json({ message: "ok" });
    } catch (error) {
      console.error("Errore /api/libri/update", error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO PUT" });
  }
}
