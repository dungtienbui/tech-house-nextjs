export default function SearchBar() {
    return (
        <form className="w-full min-[800px]:flex-1 flex justify-center items-center order-last min-[800px]:order-none">
            <input
                type="search"
                className="bg-gray-50 w-full md:w-11/12 px-3 py-1 rounded-full"
                placeholder="Tìm kiếm..."
            />
        </form>
    );
}