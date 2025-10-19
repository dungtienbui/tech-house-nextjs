'use client';

import { useQuery } from "@tanstack/react-query";
import { getUserByAuth } from "../actions/user";


export function useUserByAuth() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUserByAuth(),
    });
}