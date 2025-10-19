'use client'

import { auth } from "@/auth";
import { UserDTO } from "../definations/data-dto";
import { fetchUserById } from "../data/fetch-data";

export async function getUserByAuth(): Promise<UserDTO | null> {
    try {
        const session = await auth();

        const userId = session?.user.id;

        if (!userId) {
            return null;
        }

        const user = await fetchUserById(userId);

        if (user) {
            return user;
        }

        return null;

    } catch (error) {
        console.log("error: ", (error as Error).message);
        return null;
    }
}