import IApiResponse from "@/model/ApiResponse";
import { logout } from "@/service/server/authService";
import { prisma } from "@/utils/prisma";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
  if (req.method === "DELETE") {
    try {
      const sessionCookie = req.cookies.session;
      
      if (!sessionCookie) {
        return res
          .status(302)
          .json({ message: "Cookie di sessione non trovato" });
      }
      
      const data = await logout(sessionCookie);
      if (data.isError) {
        return res.status(302).json({ message: data.message! });
      }

      return res
        .status(200)
        .setHeader("Set-Cookie", data.data!)
        .json({ message: "Utente sloggato" });
    } catch (error) {
      console.error("Errore api/auth/logout", error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo DELETE" });
  }
}
