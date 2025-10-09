'use client'

import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import { CircleUserRound, ListOrdered, ShoppingBag } from "lucide-react";

export default function AccountButton() {
    return (
        <>
            <SignedOut>
                <SignInButton>
                    <div
                        className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50"
                    >
                        <CircleUserRound className="w-[30px]" />
                        <p className="hidden min-[550px]:block">Khách hàng</p>
                    </div>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton
                    showName
                    appearance={{
                        elements: {
                            userButtonBox: "gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50 text-white",
                            userButtonOuterIdentifier: "hidden min-[550px]:block order-last"
                        }
                    }}
                >
                    <UserButton.MenuItems>
                        <UserButton.Link
                            label="Danh sách đơn hàng"
                            labelIcon={<ShoppingBag width={16} height={16} />}
                            href="/user/purchase"
                        />
                        <UserButton.Action label="manageAccount" />
                        <UserButton.Action label="signOut" />
                    </UserButton.MenuItems>
                </UserButton>
            </SignedIn>
        </>
    );
}