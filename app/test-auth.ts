'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react";

export default function TestAuth() {
    const { data, status } = useSession();

    useEffect(() => {
        console.log("Test auth status: ", status);
    }, [status]);

    useEffect(() => {
        console.log("Test auth data: ", data);
    }, [data]);

    return null;
}