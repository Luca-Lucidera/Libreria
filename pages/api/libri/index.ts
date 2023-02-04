import ILibro from "@/interfaces/ILibro";
import IApiResponse from "@/interfaces/IApiResponse";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<ILibro[]>>
) {
  if (req.method === "GET") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) return res.status(302);
      else {
        const dbResp = await prisma.userLogin.findFirst({
          where: {
            sessionId: sessionUUID,
          },
          select: {
            expiresDate: true,
            Users: true,
          },
        });
        if (!dbResp) return res.status(302);
        else {
          const { Users, expiresDate } = dbResp!;
          if (new Date() >= expiresDate) return res.status(302);
          else {
            const dbResp = await prisma.libreria.findMany({
              where: {
                idUtente: Users.id,
              },
              select: {
                Libro: true,
              },
            });
            let libri: ILibro[] = [];
            dbResp.forEach((libro) => {
              if (libro.Libro.colore == "") {
                libro.Libro.colore = "#ffffff";
              }
              libri.push(libro.Libro);
            });
            return res.status(200).json({ data: libri });
          }
        }
      }
    } catch (error) {}
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO GET" });
  }
}
