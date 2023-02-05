import IApiResponse from "@/interfaces/IApiResponse";
import ILibro from "@/interfaces/ILibro";
import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
    if(req.method === 'PUT') {
        const sessionUUID = req.cookies.session;
      if (!sessionUUID)
        return res.status(302).json({ message: "uuid non trovato" });
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
          if (new Date() >= expiresDate) res.status(302);
          else {
            const libro = JSON.parse(req.body) as ILibro
            console.log(libro)
            if(!libro) return res.status(400).json({ message: "Body mancante" });
            const libroUpdated = await prisma.libro.update({
                where: {
                    titolo: libro.titolo
                },
                data: libro
            })
            if(!libroUpdated) return res.status(404).json({message: "libro non trovato"})
            return res.status(200).json({message: "ok"})
          }
        }
      }
    } else {
        return res.status(405).json({ message: "IL METODO ACCETTA SOLO PUT"})
    }
}
