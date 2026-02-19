import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../contexts/AuthContext";
import { faAddressCard, faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { SettingsModal } from "../SettingsModal/SettingsModal";


export const Header = () => {
    const { user, signInWithGoogle, logOut } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Job-Flow</a>
            </div>

            {!user ? (
                <a
                    className="btn btn-outline text-lg"
                    onClick={signInWithGoogle}
                >
                    Entrar
                </a>
            ) : (
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
                                <a className="link link-hover cursor-pointer">
                                    <FontAwesomeIcon icon={faAddressCard} />
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="link link-hover cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                                    <FontAwesomeIcon icon={faGear} />
                                    Settings
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