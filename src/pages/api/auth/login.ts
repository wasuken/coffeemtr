import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(401).json({ message: "unauthorized." });
  }
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user === null) {
    return res.status(401).json({ message: "unknown user." });
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string") {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = sign({ userId: user.id }, secret, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
  return;
}
