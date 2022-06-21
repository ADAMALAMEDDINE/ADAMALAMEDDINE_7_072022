import './Header.css';
import logo from "../../logo.svg"
import { Link } from "react-router-dom";


function Header() {

    return (
        <header className="Header">
            <img src={logo} alt='logo Groupomania' />
            <nav>
                <ul>
                    <li>
                        <Link to="/accueil">Accueil</Link>
                    </li>
                    <li>
                        <Link to="/nouvel-article">Crée un article</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
