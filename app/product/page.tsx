import { phoneSpecs, products, productVariants } from "@/lib/definations/product-example-data";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    console.log("Product id: ", id);

    const product = products[0];
    const productVariant = productVariants[0];
    const phoneSpec = phoneSpecs[0];

    return (
        <div>
            <h1>{product.name}</h1>
        </div>
    )
}