import './Profil.css';
import { useState, useEffect } from "react"

import Header from '../../components/Header/Header';

import userService from '../../services/userService';
import { __parseJwt } from '../../services/utils';
import storageService from '../../services/storage';
import { useNavigate } from "react-router-dom";


function Profil() {

  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState({
    firstname: "", lastname: "", email: "", nickname: "", newPassword: "", actualPassword: ""
  });
  const [actual, setActual] = useState({
    firstname: "", lastname: "", email: "", nickname: "", newPassword: "", actualPassword: ""
  });
  const [invalidFields, setInvalidFields] = useState({
    email: false, nickname: false, newPassword: false
  });
  const [invalidFieldsNbr, setInvalidFieldsNbr] = useState(0);
 
  useEffect(() => {
    const token = storageService.get("token");
    const parsedToken = __parseJwt(token);
    const data = {newPassword: "", actualPassword: ""};
    for(const key in parsedToken) {
      if(["firstname", "lastname", "email", "nickname"].includes(key)) {
        data[key] = parsedToken[key];
      }
    }
    setActual(data);
    setUserFormData(data);
  }, [])

  const updateProfile = e => {
    e.preventDefault();
    if(!userFormData.email.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
      return;
    }
    userService.updateProfile(userFormData).then(res => {
      console.log(res);
      alert("Votre profil a bien été mis à jour !");
      userService.disconnect();
      navigate("/");
    });
  }

  const userFormFieldChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    const data = { ...userFormData };
    data[name] = value;
    setUserFormData(data);
    checkFieldValidity(name, value);
  }

  const checkFieldValidity = (name, value) => {
    const invalidFields_ = {...invalidFields};
    let invalidFieldsNbr_ = invalidFieldsNbr;
    if (name === "nickname") {
      const match = value.match(/([A-Za-z0-9])\w+/);
      if (!match && !invalidFields.nickname) {
        invalidFields_.nickname = true;
        invalidFieldsNbr_ ++;
      } else if (match && invalidFields.nickname) {
        invalidFields_.nickname = false;
        invalidFieldsNbr_ --;
      }
    } else if (name === "email") {
      const match = value.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/);
      if (!match && !invalidFields.email) {
        invalidFields_.email = true;
        invalidFieldsNbr_ ++;
      } else if (match && invalidFields.email) {
        invalidFields_.email = false;
        invalidFieldsNbr_ --;
      }
    } else if (name === "newPassword") {
      const match = value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
      if (!match && !invalidFields.newPassword) {
        invalidFields_.newPassword = true;
        invalidFieldsNbr_ ++;
      } else if (match && invalidFields.newPassword) {
        invalidFields_.newPassword = false;
        invalidFieldsNbr_ --;
      }
    }

    if(invalidFieldsNbr_ !== invalidFieldsNbr) {
      setInvalidFieldsNbr(invalidFieldsNbr_);
      setInvalidFields(invalidFields_);
    }
  }

  return (
    <div className="Profil">
      <Header/>
      <h1 className="text-center">Connecté(e) en tant que {userFormData.firstname + " " + userFormData.lastname}</h1>
      
      <form onSubmit={updateProfile}>
      <h2 className="text-center">Modifier mon compte </h2>
        <label htmlFor="email">Adresse mail (à saisir de nouveau ou saisir une nouvelle adresse)</label>
        <input id="email" name="email" onChange={userFormFieldChange} value={userFormData.email} type="email"/>
        { invalidFields.email && <p className="invalid-feild-msg">Adresse mail non valide</p> }
        
        <label htmlFor="nickname">Pseudo</label>
        <input id="nickname" name="nickname" onChange={userFormFieldChange} value={userFormData.nickname} type="text" />
        { invalidFields.nickname && <p className="invalid-feild-msg">Votre pseudo doit être  composé d'au moins 2 caractères alphanumériques (a-zA-Z0-9)</p> }
        
        <label htmlFor="new-password">Nouveau mot de passe (ne sera pas modifié si laissé vide)</label>
        <input id="new-password" name="newPassword" onChange={userFormFieldChange} value={userFormData.newPassword} type="password"/>
        { invalidFields.newPassword && <p className="invalid-feild-msg">Votre nouveau mot de pase doit être composé d'au moins 8 caractères dont une majuscule, une minuscule et un chiffre.</p> }
        
        <label htmlFor="actual-password">Mot de passe actuel (obligatoire)</label>
        <input id="actual-password" name="actualPassword" onChange={userFormFieldChange} value={userFormData.actualPassword} type="password" />
       
        { (userFormData.actualPassword && invalidFieldsNbr === 0 && (
            userFormData.email !== actual.email || 
            userFormData.nickname !== actual.nickname ||
            userFormData.password !== actual.password
          )) &&
          <input type="submit" value="Modifier mon profil" />
        }
        
      </form>
    </div>
  );
}

export default Profil;
