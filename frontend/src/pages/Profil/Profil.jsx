import './Profil.css';
import logo from "../../images/icon-left-font.png";
import { useState, useEffect } from "react" //fonction qui permet de recuperer des "state", useEffect permet de charger les postes avec l'ensembles

import Header from '../../components/Header/Header';

import userService from '../../services/userService';
import { __parseJwt } from '../../services/utils';
import storageService from '../../services/storage';


function Profil() {

  const [userFormData, setUserFormData] = useState({
    firstname: "", lastname: "", email: "", nickname: "", imageUrl: "", imageFile: null, shouldDeleteImage: false, oldImageUrl: ""
  });
 
  useEffect(() => {
    const token = storageService.get("token");
    console.log(__parseJwt(token));
  }, [])

  const updateProfil = () => {
    
  }

  return (
    <div className="Profil">
      <Header/>
      <h1>Mes informations</h1>
      
      <form onSubmit={updateProfil}>

      </form>
    </div>
  );
}

export default Profil;
