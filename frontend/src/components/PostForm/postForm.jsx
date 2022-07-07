import logo from "../../images/icon-left-font.png";
import './PostForm.css';
import { useState, useEffect } from "react" //fonction qui permet de recuperer des "state"
import postService from '../../services/postService';


function PostForm({post, closeSelf, postWasUpdated, postWasCreated}) {

  const [postFormData, setPostFormData] = useState({
    title: "", content: "", imageUrl: "", imageFile: null, shouldDeleteImage: false, oldImageUrl: ""
  });

  useEffect(() => {
    if(post) {
      const imageUrl = post.imageUrl || logo;
      postService.getContent(post.id).then(res => {
        const postFormData_ = {
          title:post.title, content:res.data.post.content, imageUrl, imageFile: null, shouldDeleteImage: false
        };
        if(post.imageUrl) {
          postFormData_.oldImageUrl =  post.imageUrl;
        }
        setPostFormData(postFormData_);
      });
    }  else {
      const postFormData_ = {
        title: "", content: "", imageUrl: logo, imageFile: null, shouldDeleteImage: false
      }; 
      setPostFormData(postFormData_);
    }
  }, [post]);

  const initFormData = () => {
    const formData = new FormData();
    formData.append("title", postFormData.title);
    formData.append("content", postFormData.content);
    formData.append("image", postFormData.imageFile);
    if(postFormData.shouldDeleteImage && postFormData.oldImageUrl) {
      formData.append("oldImageUrl", postFormData.oldImageUrl);
    }
    return formData;
  }

  const createNewPost = () => {
    const fd = initFormData();
    postService.create(fd)
      .then(res => {
        console.log(res);
        postWasCreated({...res.data.data, User: {nickname: "moi"}});
      }).catch(err => {
        console.log(err);
      })
  }

  const updatePost = () => {
    const fd = initFormData();
    postService.update(post.id, fd)
      .then(res => {
        console.log(res);
        postWasUpdated({...postFormData, index: post.index});
      }).catch(err => {
        console.log(err);
      })
  }

  const handleSubmit = e => {
    e.preventDefault();
    post ? updatePost() : createNewPost();
  };
 
  const postFormFieldChange = e => {
    const value = e.target.value
    const name = e.target.name
    const data = { ...postFormData }
    data[name] = value
    setPostFormData(data)
  }

  const postFormFieldImageChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener("load", function () {
      // on convertit l'image en une chaîne de caractères base64
      const imageBase64Url = reader.result;
      const postFormData_ = {...postFormData};
      
      postFormData_.imageUrl = imageBase64Url;
      postFormData_.imageFile = file;
      if( postFormData_.oldImageUrl) {
        postFormData_.shouldDeleteImage = true;
      }
     
      setPostFormData(postFormData_); 
    }, false);
  } 

  const removeImageUrl = () => {
    const postFormData_ = {...postFormData, imageUrl: logo, imageFile: null};
    if(postFormData_.oldImageUrl) {
      postFormData_.shouldDeleteImage = true;
    }
    setPostFormData(postFormData_);
  }

  return (
    <div className="PostForm">
      <form onSubmit={handleSubmit}>
        <button className="close-form-btn" onClick={closeSelf}>fermer</button>
        <h1>{post ? "Modifier cet article" : "Nouvel article"}</h1>
        <input name="title" onChange={postFormFieldChange} value={postFormData.title} type="text" placeholder="titre de l'article" />
        <textarea name="content" onChange={postFormFieldChange} value={postFormData.content} placeholder="contenu" />
        <div className="form-file-field">
          <input type="file" name="image" onChange={postFormFieldImageChange} />
          <img src={postFormData.imageUrl} alt=""/>
          {
            postFormData.imageUrl !== logo && 
            <button className="remove-img" onClick={removeImageUrl}>Retirer image</button>
          }
          
        </div>
        <input type="submit" value="Publier" />
      </form>
    </div>
  );
}

export default PostForm;