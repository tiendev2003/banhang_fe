
import { LogOutIcon, MenuIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext, AuthContextType } from "../../context/AuthContext";

interface breadCampTitleType {
    breadCampTitle: string;
}

const HeaderAdmin = ({ breadCampTitle }: breadCampTitleType) => {
    const [collapse, setCollapse] = useState(false);
    const [emailactive, setemailactive] = useState(false);
    const [notificationActive, setnotificationActive] = useState(false);
    const [userDropdown, setuserDropdown] = useState(false);
    const { toggleSideMenu, logout } = useContext<AuthContextType>(AuthContext as any);
    const addPost = () => {
        setCollapse(!collapse);
        setemailactive(false);
        setnotificationActive(false);
        setuserDropdown(false);
    };


    const handleShowuserDrowdown = () => {
        setuserDropdown(!userDropdown);
        setemailactive(false);
        setnotificationActive(false);
        setCollapse(false);
    };

    return (
        <>
            <div className=" cashier-header-area">
                <div className="cashier-header-wrapper custom-height-70 px-7 custom-height-70 bg-white border-b border-solid border-grayBorder">
                    <div className="grid grid-cols-12 items-center h-full">
                        <div className="col-span-12">
                            <div className="cashier-header-content flex items-center justify-between custom-height-70">
                                <div className="cashier-header-breadcrumb">
                                    <h5 className="text-[20px] text-heading font-bold mb-1 leading-none">
                                        Dashboard
                                    </h5>
                                    <ul>
                                        <li className="text-[14px] text-bodyText font-normal inline-block mr-2">
                                            Home
                                        </li>
                                        <li className="text-[12px] text-bodyText font-normal inline-block mr-2 translate-y-0">
                                            <i className="far fa-chevron-right"></i>
                                        </li>
                                        <li className="text-[14px] text-bodyText font-normal inline-block mr-2">
                                            {breadCampTitle}
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex items-center">
=
                                    <div
                                        onClick={toggleSideMenu}
                                        id="sidebarToggle"
                                        className="cashier-header-bar-responsive cursor-pointer mr-5"
                                    >
                                        {/* sidebar toggle */}
                                        <MenuIcon />
                                    </div>
                                    <div className="cashier-header-notify-wrapper px-5 flex items-center border-l border-solid border-grayBorder custom-height-70 pr-0">
                                        <div
                                            id="langdropdown"
                                            onClick={handleShowuserDrowdown}
                                            className="cashier-header-language flex items-center relative"
                                        >
                                            <div
                                                className={`cashier-quick-dropdown cashier-quick-lang-dropdown ${userDropdown ? "langmenu-enable" : ""
                                                    }`}
                                            >
                                                <ul className="lang-dropdown-wrapper">

                                                    <li>
                                                        <Link onClick={logout} to="/login">
                                                            <LogOutIcon />
                                                            Logout
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cashier-header-overlay"></div>
                            <div className="cashier-header-overlay"></div>
                            <div className="cashier-header-overlay"></div>
                            <div className="cashier-header-overlay"></div>
                            <div className="cashier-header-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderAdmin;