import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return json(true, {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}