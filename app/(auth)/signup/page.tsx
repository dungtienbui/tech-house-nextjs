
import AuthFormSkeleton from "@/ui/app/auth/auth-form-skeleton";
import SignupForm from "@/ui/app/auth/signup-form";
import { Suspense } from "react";

export default function SignUpPage() {
    return (
        <Suspense fallback={<AuthFormSkeleton type="signup" />}>
            <SignupForm />
        </Suspense>
    );
}
