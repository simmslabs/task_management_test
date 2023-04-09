import { json, type ActionFunction } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";
import prisma from "~/services/prisma";
export const action: ActionFunction = async ({ request }) => {
  const { title, description, start_date, end_date } = await request.json();
  const auth = await auth_middleware(request);
  if (auth && title && start_date && end_date) {
    const task = await prisma?.task.create({
      data: {
        title,
        start_date,
        end_date,
        description,
        user_id: auth.user.id,
        status: "incomplete",
        user_tasks: {
          create: {
            user_id: auth.user.id,
          }
        }
      }
    });
    return json(task);
  }

  return null;
}