import Libro from "@/model/Libro";
import IApiResponse from "@/model/ApiResponse";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { checkSession } from "@/service/server/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<Libro[]>>
) {
  if (req.method === "GET") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) {
        return res.status(302).json({ message: "uuid non trovato" });
      }

      const session = await checkSession(sessionUUID);
      if (session.isError) {
        return res.status(302).json({ message: session.message! });
      }
      const user = session.data!;

      const libri = (await prisma.libri.findMany({
        where: {
          userId: user.id!,
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
        },
      })) as Libro[];

      return res.status(200).json({ data: libri });
    } catch (error) {
      console.error("Errore /api/libri", error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO GET" });
  }
}
