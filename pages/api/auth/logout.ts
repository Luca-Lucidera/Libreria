import IApiResponse from "@/interfaces/IApiResponse";
import prisma from "@/utils/prisma";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<any>>
) {
  if (req.method === "DELETE") {
    const sessionCookie = req.cookies.session;
    if (!sessionCookie) return res.status(302).json({ message: "ok"});
    else {
      const data = await prisma.userLogin.findFirst({
        where: {
          sessionId: sessionCookie
        },
      })
      if(!data) return res.status(302).json({ message: "ok"})
      const { id } = data!
      await prisma.userLogin.update({
        data: {
          sessionId: "",
          expiresDate: new Date()
        },
        where: {
          id: id
        }
      })
      const date = new Date();
      date.setDate(date.getDate() - 2)
      const sessionRemoved = serialize("session", '', {
        expires: date,
        path: "/"
      });
      res.setHeader("Set-Cookie", sessionRemoved)
      res.status(200).json({ message: "ok" });
    }
  } else {
    return res.status(405).json({ message: "Il metodo accetta solo DELETE" });
  }
}
