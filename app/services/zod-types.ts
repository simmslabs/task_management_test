import { z } from "zod";

export const RegistrationZod = z.object({
  full_name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
  confirm_password: z.string()
});

export type RegistrationZodType = z.infer<typeof RegistrationZod>;