export default function SearchBar() {
    return (
        <form className="order-3 w-full flex-2 md:flex-1 sm:order-2 flex justify-center items-center">
            <input
                type="search"
                className="bg-gray-50 w-full md:w-11/12 px-3 py-1 rounded-full"
                placeholder="Tìm kiếm..."
            />
        </form>
    );
}