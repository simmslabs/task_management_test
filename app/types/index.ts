import type { Prisma } from "@prisma/client";

export type Task = Prisma.taskGetPayload<{
  include: {
    user: true;
    activities: {
      include: {
        user: true;
        activity_users: {
          include: {
            user: true;
          }
        };
      }
    },
    comment: true;
    task_man_tags: {
      include: {
        task: true;
        task_tag: true;
      }
    };
    user_tasks: {
      include: {
        user: true;
      }
    }
  }
}>

export type TaskTag = Prisma.task_man_tagsGetPayload<{
  include: {
    task: true;
    task_tag: true;
  }
}>;

export type Activity = Prisma.activityGetPayload<{
  include: {
    activity_users: true;
    // activity_user_ids: true;
  }
}>;