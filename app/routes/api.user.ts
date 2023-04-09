import { json, type LoaderFunction } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await auth_middleware(request);
  if (auth) {
    try {
      const users = await prisma?.user.findMany({
        where: {
          NOT: {
            id: auth.user.id
          }
        }
      });
      return json(users);
    } catch (error) {
      console.log(error);
    }
  }
  return json(null);
}