import IApiResponse from "@/model/ApiResponse";
import IUser from "@/model/user/IUser";
import { checkSession } from "@/service/server/authService";
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
      if (!sessionUUID) {
        return res.status(302).json({ message: "uuid non trovato" });
      }

      const data = await checkSession(sessionUUID);
      if (data.isError) {
        return res.status(302).json({ message: data.message! });
      }

      return res.status(200).json({ data: data.data });
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
