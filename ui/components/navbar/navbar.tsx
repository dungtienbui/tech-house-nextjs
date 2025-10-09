import NavLinks from './nav-link';
import NavBarScrolled from './navbar-scrolled';

export default function NavBar() {

    return (
        <NavBarScrolled>
            <div className="flex flex-row gap-2 px-2 py-1 max-[450px]:pb-2 justify-start md:gap-3 md:pl-20 max-[450px]:overflow-auto">
                <NavLinks />
            </div>
        </NavBarScrolled>
    );
}