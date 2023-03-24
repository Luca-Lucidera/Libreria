import ApiResponse from "@/model/ApiResponse";
import { checkSession } from "@/service/server/authService";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<boolean>>
) {
  if (req.method === "DELETE") {
    try {
      const sessionUUID = req.cookies.session;
      if (!sessionUUID) {
        return res.status(401).json({ message: "Non sei autorizzato" });
      }
      const sessionData = await checkSession(sessionUUID);
      if (sessionData.isError) {
        return res.status(401).json({ message: sessionData.message! });
      }
      if (!req.body.id) {
        return res
          .status(400)
          .json({ message: "Il libro non è stato trovato" });
      }
      console.log("LIBRO DA BODY:", req.body);
      const dbRes = await prisma.libri.delete({
        where: {
          id: req.body.id,
        },
      });
      if (!dbRes) {
        return res
          .status(400)
          .json({ message: "Il libro non è stato trovato" });
      }
      return res.status(200).json({ data: true });
    } catch (error) {
      console.error("Errore /api/libri/delete", error);
      return res.status(500).json({
        message: "Errore interno al server, ci scusiamo per il disagio",
      });
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo DELETE" });
  }
}
