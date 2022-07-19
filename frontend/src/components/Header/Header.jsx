import './Header.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../images/icon-left-font-monochrome-black.png"
import { Link } from "react-router-dom";
import storage from "../../services/storage.js";
import userService from '../../services/userService';
import PostForm from '../PostForm/postForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { isVisible } from '@testing-library/user-event/dist/utils';


function Header({postWasCreated}) {

    const navigate = useNavigate();

    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [displayPostForm, setDisplayPostForm] = useState(false);

    useEffect(() => {
        if (storage.get("user_id")) {
            setIsLogged(true);
        }
    }, []);

    const openPostForm = () => {
        setDisplayPostForm(true);
    }

    const disconnect = () => {
        userService.disconnect();
        navigate("/");
    }

    const postWasCreated_ = newPost => {
        if(postWasCreated) {
            postWasCreated(newPost);
        }
        setDisplayPostForm(false);
    }

    

    return (
        <div className="Header">
            <header>
                <img src={logo} alt='logo Groupomania' />
                <button onClick={()=> {setMenuIsVisible(!menuIsVisible)}} className='responsive-burger-menu-btn'>
                    {   menuIsVisible ?
                        <FontAwesomeIcon icon={faXmark} /> :
                        <FontAwesomeIcon icon={faBars} />
                    }
                    
                </button>
                <nav>
                    <ul className={menuIsVisible ? "responsive-header-menu-is-visible" : ""}>
                        <li className="header-nav-menu-item">
                            <Link to="/accueil">Accueil</Link>
                        </li>
                        <li className="header-nav-menu-item">
                            <Link to="/mon-profil">Mon profil</Link>
                        </li>
                        <li>
                            <button className="header-logout-btn" onClick={openPostForm}>Créer un article</button>
                        </li>
                        {isLogged &&
                            <li>
                                <button className="header-logout-btn" onClick={disconnect}>Se déconnecter</button>
                            </li>
                        }
                    </ul>
                </nav>
            </header>
            {
                displayPostForm && <PostForm 
                postWasCreated={postWasCreated_}
                closeSelf={()=>{setDisplayPostForm(false)}}/>
            }
        </div>

    );
}

export default Header;
