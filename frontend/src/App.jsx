import './App.css';
import { useState } from "react" //fonction qui permet de recuperer des "state"
import userService from './services/userService';
import storage from './services/storage';
import { useNavigate } from "react-router-dom";


function App() {
  const [displayLogin, setDisplayLogin] = useState(true)
  const [loginFormData, setLoginFormData] = useState({
    email: "", password: ""
  })
  const [signUpFormData, setSignUpFormData] = useState({
    email: "", password: "", nickname: "", firstname: "", lastname: ""
  })

  const navigate = useNavigate();


  const toggleDisplayLogin = (e) => {
    e.preventDefault()
    setDisplayLogin(!displayLogin)
  }
  const onsignUp = (e) => {
    e.preventDefault()
    userService.signUp(signUpFormData)
      .then(res => {
        console.log(res);
        alert("Vous êtes inscrit !");
        login(signUpFormData);
      }).catch(err => {
        console.log(err);
        alert(err.response.data.message);
      });
  }

  const login = (userEmailAndPassword) => {
    userService.login(userEmailAndPassword)
    .then(res => {
      storage.init(res.data);
      navigate("/accueil");
    }).catch(err => {
      console.log(err);
      alert(err.response.data.message);
    });
  }
  const onlogin = (e) => {
    e.preventDefault();
    login(loginFormData);
  }
  const signUpFormFieldChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    const data = { ...signUpFormData }
    data[name] = value
    setSignUpFormData(data)
  }
  const loginFormFieldChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    const data = { ...loginFormData }
    data[name] = value
    setLoginFormData(data)
  }
  

  return (
    <div className="App">
      {displayLogin ?
        <form>
          <h1>Connexion</h1>
          <input name="email" onChange={loginFormFieldChange} value={loginFormData.email} type="email" placeholder="email" />
          <input name="password" onChange={loginFormFieldChange} value={loginFormData.password} type="password" placeholder="mot de passe" />
          <input onClick={onlogin} type="submit" value="Se connecter" />
          <button onClick={toggleDisplayLogin}>Pas encore inscrit ?</button>
        </form> : <form>
          <h1>Inscription</h1>
          <input name="email" onChange={signUpFormFieldChange} value={signUpFormData.email} type="email" placeholder="email" />
          <input name="nickname" onChange={signUpFormFieldChange} value={signUpFormData.nickname} type="text" placeholder="votre pseudo" />
          <input name="password" onChange={signUpFormFieldChange} value={signUpFormData.password} type="password" placeholder="mot de passe" />
          <input name="firstname" onChange={signUpFormFieldChange} value={signUpFormData.firstname} type="text" placeholder="votre prénom" />
          <input name="lastname" onChange={signUpFormFieldChange} value={signUpFormData.lastname} type="text" placeholder="votre nom" />
          <input onClick={onsignUp} type="submit" value="S'inscrire" />
          <button onClick={toggleDisplayLogin}>Se connecter</button>
        </form>

      }

    </div>
  );
}




export default App;
