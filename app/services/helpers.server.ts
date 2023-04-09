import { getSession } from "./session.server";
import jwt from "jsonwebtoken";
import type { user } from "@prisma/client";
import * as dotenv from 'dotenv';
import prisma from "~/services/prisma";
dotenv.config();
export type _Request = Request & { user: user, token: string };

export function auth_middleware(req: Request, token: string | undefined = undefined): Promise<_Request | null> {
  return new Promise<_Request | null>((resolve, reject) => {
    let _req: _Request | null;
    (async () => {
      const session = await getSession(req.headers.get("Cookie"));
      console.log("Session .........", session.get("token"));
      const _token: string | undefined = session.get("token") ?? req.headers.get("token") ?? token;
      if (!_token) resolve(null);
      if (_token) {
        try {
          jwt.verify(_token, String(process.env.JWT_KEY), async (err: any, dt: any) => {
            type dt_type = {
              email: string
            };
            const dt_ = dt as dt_type;
            try {
              if (dt_ && dt_.email) {
                const user = await prisma.user.findFirst({
                  where: { email: dt_.email },
                });
                if (err) {
                  resolve(null);
                }
                if (user) {
                  _req = req as _Request;
                  _req.user = {
                    ...user,
                  } as user;
                  _req.token = _token;
                  resolve(_req)
                } else {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            } catch (error) {
              resolve(null);
            }
          });
        } catch (error) {
          return null;
        }
      }
    })();
  });
}

export const get_access_token = (email: string) => {
  console.log(email, process.env.JWT_KEY);
  if (email) {
    return jwt.sign({ email }, String(process.env.JWT_KEY), { expiresIn: '60d' });
  } else {
    return null;
  }
};