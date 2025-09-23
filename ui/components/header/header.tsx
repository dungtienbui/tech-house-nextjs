import HeaderLogo from "./header-logo";
import SearchBar from "./search-bar";
import Utility from "./utility";

export default function Header() {
    return (
        <div className="bg-sky-500 fixed top-0 left-0 right-0 h-28 min-[800px]:h-16 z-50">
            <div className="w-full h-full flex flex-row flex-wrap items-center content-evenly gap-x-1 min-[800px]:gap-x-2 px-2 lg:px-8">
                <HeaderLogo />
                <SearchBar />
                <Utility />
            </div>
        </div>
    );
} 