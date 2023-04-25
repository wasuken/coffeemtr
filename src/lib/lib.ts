import { verify, JwtPayload } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function authUser(
  authHeader: string | undefined
): Promise<User | null> {
  if (typeof authHeader !== "string") {
    return null;
  }
  const token: string = authHeader && authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string") return null;

  try {
    // トークンを検証
    const decoded: string | JwtPayload = verify(token, secret);
    let userId = "";
    if (typeof decoded === "string") {
      userId = decoded;
    } else {
      userId = decoded.userId;
    }
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
      },
    });

    // 認証情報をリクエストに追加
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
