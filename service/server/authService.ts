import ServiceResponse from "@/model/ServiceResponse";
import IUser from "@/model/user/IUser";
import { prisma } from "@/utils/prisma";
import { serialize } from "cookie";
import { randomUUID } from "crypto";

export async function checkSession(
  sessionUUID: string
): Promise<ServiceResponse<IUser>> {
  try {
    if (!sessionUUID) {
      return { isError: true, message: "UUID di sessione non trovato" };
    }
    const login = await prisma.logins.findFirst({
      where: {
        sessionUUID: sessionUUID,
      },
      select: {
        expires: true,
        userId: true,
      },
    });

    if(!login) {
      return { isError: true, message: "Utente non loggato" }
    }

    const { expires, userId } = login;
    if(new Date() > expires) {
      return { isError: true, message: "Sessione scaduta"}
    }

    const user = await prisma.users.findFirst({
      where: {
        id: userId
      }
    })

    if(!user) {
      return { isError: true, message: "Utente non trovato" }
    }

    return { isError: false, data: user }
  } catch (error) {
    console.error("Errore authService.ts -> checkSession()", error)
    return { isError: true, message: "Errore interno al server" }
  }
}

export async function setSessionCookie(
  user: IUser
): Promise<ServiceResponse<string>> {
  try {
    if (!user) {
      return { isError: true, message: "Utente non trovato" };
    }

    const now = new Date();
    const expires = new Date(Date.now() + 3600000 * 24); //24 = numero di ore, 3600000: millisecondi == 1 ora
    const sessionUUID = randomUUID();
    const session = serialize("session", sessionUUID, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: expires,
      path: "/",
    });

    await prisma.logins.upsert({
      create: {
        userId: user.id!,
        sessionUUID: sessionUUID,
        expires: expires,
        lastLogin: now,
      },
      update: {
        sessionUUID: sessionUUID,
        expires: expires,
        lastLogin: new Date(),
      },
      where: {
        userId: user.id!,
      },
    });

    return { isError: false, data: session };
  } catch (error) {
    console.error("Errore authService.ts -> setSessionCookie()", error);
    return { isError: true, message: "Errore" };
  }
}

export async function logout(
  sessionCookie: string
): Promise<ServiceResponse<string>> {
  try {
    const userLogin = await prisma.logins.findFirst({
      where: {
        sessionUUID: sessionCookie,
      },
    });

    if (!userLogin) {
      return { isError: true, message: "Nessun login trovato" };
    }

    const { id: loginId } = userLogin!;

    await prisma.logins.update({
      data: {
        sessionUUID: "",
        expires: new Date(),
      },
      where: {
        id: loginId,
      },
    });

    const date = new Date();
    date.setDate(date.getDate() - 2);

    const sessionRemoved = serialize("session", "", {
      expires: date,
      path: "/",
    });

    return { isError: false, data: sessionRemoved };
  } catch (error) {
    console.error("Errore authService.ts -> Logout()", error);
    return { isError: true, message: "Errore interno" };
  }
}
