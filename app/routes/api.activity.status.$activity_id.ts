import { ActionFunction, json } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { activity_id } = params;
  const { status } = await request.json();
  const auth = await auth_middleware(request);
  if (activity_id && auth) {
    const activity = await prisma?.activity.findFirst({
      where: {
        id: activity_id,
        task: {
          user_id: auth.user.id
        }
      }
    });
    if (activity) {
      await prisma?.activity.update({
        where: {
          id: activity_id
        },
        data: {
          status
        }
      });
      return json({ success: true, message: "Status updated successfully" });
    } else {
      return json({ success: false, message: "You are not allowed to take this action" }, {
        status: 401
      });
    }
  }
  return json(null);
}