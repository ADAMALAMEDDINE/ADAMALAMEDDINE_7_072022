import './Header.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../images/icon-left-font-monochrome-black.png"
import { Link } from "react-router-dom";
import storage from "../../services/storage.js";
import userService from '../../services/userService';



function Header() {

    const navigate = useNavigate();

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        if(storage.get("user_id")) {
            setIsLogged(true);
        }
    }, []);

    const disconnect = () => {
        userService.disconnect();
        navigate("/");
    }

    return (
        <header className="Header">
            <img src={logo} alt='logo Groupomania' />
            <nav>
                <ul>
                    <li className="header-nav-menu-item">
                        <Link to="/accueil">Accueil</Link>
                    </li>
                    <li className="header-nav-menu-item">
                        <Link to="/nouvel-article">Crée un article</Link>
                    </li>
                    {isLogged && 
                        <li>
                         <button className="header-logout-btn" onClick={disconnect}>Se déconnecter</button>
                        </li>
                    }
                   
                </ul>
            </nav>
        </header>
    );
}

export default Header;
