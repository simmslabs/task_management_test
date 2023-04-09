import { redirect, type LoaderFunction } from "@remix-run/node";
import { auth_middleware } from "~/services/helpers.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await auth_middleware(request);
  if (auth) {
    return redirect("/dashboard");
  } else {
    return redirect("/login");
  }
}