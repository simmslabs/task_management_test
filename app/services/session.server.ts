import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "task-session",
    secrets: ["tasking123"]
  }
});

export {
  getSession,
  commitSession,
  destroySession
};