import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
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
          if (new Date() >= expiresDate) res.status(302);
          else {
            return res.status(200).json({ data: Users });
          }
        }
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Errore interno al server, ci scusiamo per il disagio"})
    }
  } else {
    return res.status(405).json({ message: "ACCETTA SOLO GET" });
  }
}
