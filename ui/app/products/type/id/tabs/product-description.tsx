import { fetchProductDescription } from "@/lib/data/fetch-data";

export default async function ProductDescription({ id }: { id: string }) {

    const resultQuery = await fetchProductDescription(id);
    const description = resultQuery[0].description;
    return (
        <div className="w-full min-h-64 border border-gray-300 rounded-xl p-5 md:p-10 bg-white shadow-lg">{description}</div>
    )
}