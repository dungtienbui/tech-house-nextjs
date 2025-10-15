import { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByPhone, fetchUserFullByPhone } from "./lib/data/fetch-data";
import { SigninFormSchema } from "./lib/definations/data-dto";
import { comparePassword } from "./lib/utils/password";
import { JWT } from "next-auth/jwt"

export default {
    providers: [
        Credentials({
            authorize: async (credentials) => {

                const parsed = SigninFormSchema.safeParse(credentials);

                if (parsed.success) {
                    const { phone, password } = parsed.data;

                    // logic to verify if the user exists
                    const user = await fetchUserFullByPhone(phone);

                    if (!user) {
                        return null;
                    }

                    const isValid = await comparePassword(password, user.password);

                    if (isValid) {
                        return {
                            id: user.id,
                            name: user.name,
                            phone: user.phone
                        }
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Xác định các route cần bảo vệ
            const isProtectedRoute = nextUrl.pathname.startsWith('/user');

            // Xác định các route dành cho việc xác thực (đăng nhập, đăng ký)
            const isAuthRoute =
                nextUrl.pathname.startsWith('/signin') ||
                nextUrl.pathname.startsWith('/signup');

            // QUY TẮC 1: Xử lý các route cần bảo vệ
            if (isProtectedRoute) {
                if (isLoggedIn) {
                    return true; // ✅ Nếu đã đăng nhập, cho phép truy cập
                }
                return false; // ❌ Nếu chưa đăng nhập, từ chối (NextAuth sẽ tự động chuyển hướng đến trang login)
            }

            // QUY TẮC 2: Xử lý các route xác thực
            if (isAuthRoute) {
                if (isLoggedIn) {
                    // Nếu người dùng đã đăng nhập mà lại vào trang login/signup,
                    // chuyển hướng họ đến trang chính sau khi đăng nhập.
                    return Response.redirect(new URL('/user/purchases', nextUrl.origin));
                }
                return true; // ✅ Nếu chưa đăng nhập, cho phép họ ở lại trang login/signup
            }

            // QUY TẮC 3: Các route còn lại (trang chủ, giới thiệu, v.v.)
            // Mặc định cho phép tất cả mọi người truy cập.
            return true;
        },

        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.phone = user.phone;
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.phone = token.phone;
            return session
        },
    },
} satisfies NextAuthConfig