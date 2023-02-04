import IApiResponse from "@/interfaces/IApiResponse";
import IUser from "@/interfaces/user/IUser";
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse<IUser>>
) {
  if (req.method === "GET") {
    const sessionUUID = req.cookies.session;
    console.log("SESSION UUID", sessionUUID)
    if (!sessionUUID) res.json({ statusCode: 302})
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
      console.log("DB RESP", dbResp)
      if (!dbResp) res.json({ statusCode: 302})
      else {
        const { Users, expiresDate } = dbResp!;
        if (new Date() >= expiresDate) res.json({ statusCode: 302});
        else {
            res.json({ statusCode: 200, data: Users})
        }
      }
    }
  } else {
    res.json({statusCode: 405, message: "ACCETTA SOLO GET"});
  }
}
