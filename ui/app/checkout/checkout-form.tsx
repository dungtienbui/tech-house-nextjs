import { auth } from "@/auth";
import { CartItems } from "@/lib/definations/data-dto";
import CheckoutFormClient from "./checkout-form-client";
import { fetchUserById } from "@/lib/data/fetch-data";

interface props {
    checkoutItems: CartItems;
    checkoutId: string;
}

export default async function CheckoutForm({ checkoutId, checkoutItems }: props) {
    const session = await auth();

    if (!session?.user.id) {
        return <CheckoutFormClient checkoutItems={checkoutItems} checkoutId={checkoutId} />
    }

    const user = await fetchUserById(session?.user.id);

    if (!user) {
        return <CheckoutFormClient checkoutItems={checkoutItems} checkoutId={checkoutId} />
    }

    return <CheckoutFormClient checkoutItems={checkoutItems} checkoutId={checkoutId} user={user} />
}