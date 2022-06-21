import './Home.css';
import { useState } from "react" //fonction qui permet de recuperer des "state"
import Header from '../../components/Header/Header';


function Home() {

    /*const [loginFormData, setLoginFormData] = useState({
      emailLogin: "", passwordLogin: ""
    })*/



    /*const toggleDisplayLogin = (e) => {
      e.preventDefault()
      setDisplayLogin(!displayLogin)
    }*/


    return (
        <div className="Home">
            <Header />

            <h1>Voir les dernières publications</h1>

        </div>
    );
}

export default Home;
