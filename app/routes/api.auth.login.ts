import bcrypt from 'bcryptjs';
import { json, type ActionFunction } from "@remix-run/node";
import { commitSession, getSession } from '~/services/session.server';
import { get_access_token } from '~/services/helpers.server';
import prisma from '~/services/prisma';

export const action: ActionFunction = async ({ request }) => {
  const { email, password } = await request.json();
  try {
    if (email && password) {
      const user = await prisma?.user.findFirst({
        where: {
          email
        }
      });
      if (user) {
        const p_check = bcrypt.compareSync(password, user.password);
        if (p_check) {
          const session = await getSession(request.headers.get("Cookie"));
          const token = get_access_token(user.email);
          if (token) {
            session.set("token", token);
            return json({
              success: true,
              message: 'Authentication successful'
            }, {
              headers: {
                "Set-Cookie": await commitSession(session)
              }
            });
          }
        }
        return json({
          success: false,
          message: 'Authentication failed'
        });
      }
      return json({
        success: false,
        message: 'Authentication failed'
      });
    }
    return json({
      success: false,
      message: "Check email or password"
    });
  } catch (error) {
    console.log(error);
    return json({ success: false, message: error })
  }
}