import { fetchProductSpecs } from "@/lib/data/fetch-data";
import { ProductType } from "@/lib/definations/types";
import { mapSpecToArray } from "@/lib/utils/types";

export default async function ProductSpecs({ id, type }: { type: ProductType | null, id: string }) {

    if (type === null) {
        return (<div />);
    }

    const resultQuery = await fetchProductSpecs(id, type);

    const specs = mapSpecToArray(resultQuery[0]);

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-10 sm:gap-y-5">
            {specs.map((spec) => {
                return (
                    <div
                        key={spec.name}
                        className="lg:flex lg:flex-row lg:justify-between lg:gap-5 px-5 py-2 md:px-10 md:py-3 border border-gray-300  rounded-xl"
                    >
                        <div className="inline lg:block font-bold">{`${spec.name}: `}</div>
                        <div className="inline lg:block">{spec.value}</div>
                    </div>
                )
            })}

        </div>
    )
}