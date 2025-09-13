import HeaderLogo from "./header-logo";
import SearchBar from "./search-bar";
import Utility from "./utility";

export default function Header() {
    return (
        <div className="bg-sky-500 fixed top-0 left-0 right-0 h-16 z-50">
            <div className="w-full h-full flex flex-row items-stretch gap-2 px-2 md:px-8">
                <HeaderLogo />
                <SearchBar />
                <Utility />
            </div>
        </div>
    );
} 