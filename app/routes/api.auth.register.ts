import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "~/services/prisma";
import bcrypt from "bcryptjs";

export const action: ActionFunction = async ({ request }) => {
  const { email, password, full_name } = await request.json();
  try {
    // console.log(email, password, full_name);
    if (email && password && full_name) {
      const user = await prisma.user.findFirst({
        where: {
          email
        }
      });
      if (user) {
        return json({
          success: false,
          message: "User already exists"
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const _phash = bcrypt.hashSync(password, salt);
      await prisma.user.create({
        data: {
          email,
          name: full_name,
          password: _phash
        }
      });
      return json({
        success: true,
        message: "Account successfully created"
      });
    }
  } catch (error) {
    console.log(error);
  }
  return json(null);
}