import './Home.css';
import logo from "../../images/icon-left-font.png";
import { useState, useEffect } from "react" //fonction qui permet de recuperer des "state", useEffect permet de charger les postes avec l'ensembles
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import PostForm from '../../components/PostForm/postForm';
import postsService from '../../services/postService';
import storage from '../../services/storage';
import { __formatDateTime } from '../../services/utils';
import LikeDislikeButtons from '../../components/LikeDislikeButtonsn/LikeDislikeButtons';



function Home() {

  const [posts, setPosts] = useState([]);
  const [displayPostForm, setDisplayPostForm] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  const {user_id, user_role} = storage.getAll();
  useEffect(() => {
    postsService.getAll()
      .then((res) => {
        const posts = res.data.map(post => {
          if(post.content.length >= 150) post.content += "...";
          post.updatedAt = __formatDateTime(post.updatedAt);
          return post;
        })
        setPosts(posts)
      })
  }, [])


  const openPostForm = (post) => {
    setPostToEdit(post);
    setDisplayPostForm(true);
  }

  const deletePost = (post, index) => {
    const user_id = storage.get("user_id");
    let adminUrlSuffix = "";
    if(post.user_id !== user_id) {
      adminUrlSuffix = "/admin"
    }
    postsService.delete(post.id, adminUrlSuffix);
    const posts_ = [...posts];
    posts_.splice(index, 1);
    setPosts(posts_);
  }

  const updatePost = (post, index) => {
    openPostForm({...post, index});
  }

  const postWasUpdated = (post) => {
    const posts_ = [...posts];
    posts_[post.index] = {
      ...posts_[post.index],
      title: post.title,
      content: post.content.slice(0, 150)+"...",
      imageUrl: post.imageUrl
    };
    setDisplayPostForm(false);
    setPosts(posts_);
  }

  const postWasCreated = newPost => {
    const posts_ = [...posts];
    newPost.updatedAt = __formatDateTime(newPost.updatedAt); 
    newPost.content = newPost.content.slice(0, 150)+"..."
    posts_.splice(0, 0, newPost);
    setDisplayPostForm(false);
    setPosts(posts_);
  }

  return (
    <div className="Home">
      <Header postWasCreated={postWasCreated}/>
      {!posts || posts.length === 0 ?<h1>Aucune publication pour le moment ...</h1> : <h1>Voir les dernières publications</h1>}
      
      <ul>
        {posts.map((post, index) => (
          <li key={index} className="post-item">
            <Link className="post-item-top" to={{
              pathname: "/article-details/" + post.id,
            }}>
              <div className='post-item-left'>
                <img src={post.imageUrl || logo} alt="" />
              </div>
              <div className="post-item-right">
                <h2>{post.title}</h2>
                <p className="post-item-infos">Posté par {post.User.nickname}, le {post.updatedAt}</p>
                <p className='post-item-content'>{post.content}</p>
              </div>  
            </Link>
            <div className="post-item-bottom">
              <LikeDislikeButtons post={post}/>
              { ( user_role === "admin" || post.user_id === user_id) && 
                <div className="post-author-buttons">
                  <button onClick={() => {deletePost(post, index)}}>Supprimer</button>
                  <button onClick={() => {updatePost(post, index)}}>Modifier</button>
                </div>
              }
            </div>
          </li>
        ))
        }
      </ul>
      
      {
        displayPostForm && 
        <PostForm 
        post={postToEdit}
        closeSelf={()=>{setDisplayPostForm(false)}}
        postWasUpdated={postWasUpdated}/>
      }
    </div>
  );
}

export default Home;
