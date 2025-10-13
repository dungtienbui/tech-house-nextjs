import NextAuth, { DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            phone?: string
            id: string
        } & DefaultSession["user"]
    }

    interface User extends User {
        phone?: string
        id: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        phone?: string
        id: string
    }
}
