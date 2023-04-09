import { json, type LoaderFunction } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";
import prisma from "~/services/prisma";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;
  const auth = await auth_middleware(request);
  if (auth && id) {
    try {
      const data = await prisma?.task.deleteMany({
        where: {
          user_id: auth.user.id,
          id
        }
      });
      if (data.count > 0) {
        return json(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return json(null);
}