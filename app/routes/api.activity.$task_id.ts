import type { activity } from "@prisma/client";
import { json, type ActionFunction } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { task_id } = params;
  const data: (activity & { user_ids?: string[] }) = await request.json();
  const auth = await auth_middleware(request);

  try {
    if (auth && task_id && data && data.user_ids) {
      const user_ids = data.user_ids;
      let _dt = { ...data };
      delete _dt.user_ids;
      const dt_: Omit<typeof data, 'user_ids'> = _dt;
      const act_ = await prisma?.activity.create({
        data: {
          ...dt_,
          status: "incomplete",
          task_id: task_id,
          user_id: auth.user.id,
          activity_users: {
            createMany: {
              data: user_ids.map(user_id => ({ user_id }))
            }
          }
        }
      });
      return json(act_);
    }
  } catch (error) {
    console.log(error);
    return json(error);
  }

  return null;
}