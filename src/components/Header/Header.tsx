import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../contexts/AuthContext";
import { faAddressCard, faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { SettingsModal } from "../SettingsModal/SettingsModal";
import { NavLink } from "react-router-dom";


export const Header = () => {
    const { user, logOut } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="navbar bg-base-100 shadow-sm lg:px-5">
            <div className="flex-1">
                <NavLink to='/' className="btn btn-ghost text-xl ">
                    <div className="avatar mr-2">
                        <div className="h-8 rounded">
                            <img src="./Logo.png" />
                        </div>
                    </div>
                    Job-Flow
                </NavLink>
            </div>

            {user && (
                <div className="flex">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-14 rounded-full">
                                <img
                                    alt="Foto de perfil"
                                    src={user.photoURL || ''} />
                            </div>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>


                                <NavLink className="link link-hover cursor-pointer" to='/applications'>
                                    <FontAwesomeIcon icon={faAddressCard} />
                                    Candidaturas
                                </NavLink>
                            </li>
                            <li>
                                <a className="link link-hover cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                                    <FontAwesomeIcon icon={faGear} />
                                    Gemini
                                </a>
                            </li>

                            <div className="divider m-0"></div>

                            <li onClick={logOut}>
                                <a className="link-error link-hover cursor-pointer">
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    )
}