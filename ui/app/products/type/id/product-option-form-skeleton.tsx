export default async function ProductOptionFormSkeleton() {
    return (
        <div className="shimmer">
            <div className="h-8 bg-gray-300"></div>
            <div className="flex justify-between mt-5">
                <div className="h-5 w-[200px] bg-gray-300"></div>
                <div className="h-5 w-[200px] bg-gray-300"></div>
            </div>
            <div className="h-7 w-[100px] bg-gray-300 mt-5"></div>
            <div className="h-13 w-[300px] bg-gray-300 mt-8"></div>
            <div className="h-13 w-[400px] bg-gray-300 mt-8"></div>
            <div className="h-13 w-[450px] bg-gray-300 mt-8"></div>
        </div>
    );
}