import { User } from "@prisma/client";

export type UserSafeDTO = Omit<User, "id42" | "secret2FA">
