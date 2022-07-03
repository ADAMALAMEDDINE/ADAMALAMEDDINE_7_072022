import './NewPost.css';
import { useState } from "react" //fonction qui permet de recuperer des "state"
import Header from '../../components/Header/Header';
import postService from '../../services/postService';


function NewPost() {

  const [newPostFormData, setNewPostFormData] = useState({
    title: "", content: ""
  })

  const createNewPost = (e) => {
    e.preventDefault()
    postService.create(newPostFormData)
      .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
  }

  const newPostFormFieldChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    const data = { ...newPostFormData }
    data[name] = value
    setNewPostFormData(data)
  }

  return (
    <div className="NewPost">
      <Header />
      <form onSubmit={createNewPost}>
        <h1>Nouvel article</h1>
        <input name="title" onChange={newPostFormFieldChange} value={newPostFormData.title} type="text" placeholder="titre de l'article" />
        <textarea name="content" onChange={newPostFormFieldChange} value={newPostFormData.content} placeholder="contenu" />
        <input type="submit" value="Publier" />
      </form>

    </div>
  );
}

export default NewPost;