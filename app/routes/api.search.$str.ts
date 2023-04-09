import { LoaderFunction, json } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";
import prisma from "~/services/prisma";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { str } = params;
  const auth = await auth_middleware(request);
  if (str && auth) {
    const resps = await prisma.$transaction([
      prisma.task.findMany({
        where: {
          OR: [
            {
              title: {
                contains: str
              }
            },
            {
              description: {
                contains: str
              }
            },
            {
              task_man_tags: {
                some: {
                  task_tag: {
                    title: {
                      contains: str,
                    }
                  }
                }
              }
            }
          ]
        }
      }),
      prisma.task_tag.findMany({
        where: {
          OR: [
            {
              title: {
                contains: str
              }
            }
          ]
        }
      }),
      prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: str
              }
            },
            {
              email: {
                contains: str
              }
            }
          ]
        }
      })
    ]);
    return {
      tasks: resps[0],
      tags: resps[1],
      user: resps[2]
    }
  }
  return json(null);
}