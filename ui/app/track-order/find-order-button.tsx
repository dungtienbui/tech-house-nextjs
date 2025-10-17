import { LoaderCircle, ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function FindOrderButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg disabled:bg-gray-400"
        >
            {pending ? (
                <>
                    <LoaderCircle className="animate-spin" size={20} />
                    ĐANG TÌM KIẾM...
                </>
            ) : (
                <>
                    TIẾP TỤC
                    <ArrowRight size={20} />
                </>
            )}
        </button>
    );
}