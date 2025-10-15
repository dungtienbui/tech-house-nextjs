'use server'

import z from "zod"
import { AuthFormState, SigninFormSchema, SignupFormSchema } from "../definations/data-dto"
import { fetchUserByPhone } from "../data/fetch-data";
import { insertUser } from "../data/insert-data";
import { redirect } from "next/navigation";

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {

    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        }
    }


    const { name, phone, password } = validatedFields.data;

    // Call the provider or db to create a user...
    const userExisted = await fetchUserByPhone(phone);

    if (userExisted) {
        return {
            errors: {
                other: ["Số điện thoại đã được đăng ký trước đó. Hãy đăng nhập."]
            }
        }
    }

    const user = await insertUser({ name, phone, password });

    redirect(`/signin?phone=${user.phone}`);
}