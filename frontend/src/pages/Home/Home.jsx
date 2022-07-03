import './Home.css';
import { useState, useEffect } from "react" //fonction qui permet de recuperer des "state", useEffect permet de charger les postes avec l'ensembles
import Header from '../../components/Header/Header';
import postsService from '../../services/postService';
import storage from '../../services/storage';



function Home() {

  const [posts, setPosts] = useState([]);
  const {user_id, user_role} = storage.getAll();
  useEffect(() => {
    postsService.getAll()
      .then((res) => {
        console.log(res);
        setPosts(res.data)
      })
  }, [])


  /*const toggleDisplayLogin = (e) => {
    e.preventDefault()
    setDisplayLogin(!displayLogin)
  }*/

  const deletePost = (postId, index) => {
    postsService.delete(postId);
    const posts_ = [...posts];
    posts_.splice(index, 1);
    setPosts(posts_);
  }

  const updatePost = (post, index) => {

  }


  return (
    <div className="Home">
      <Header />
      <h1>Voir les dernières publications</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            { ( user_role === "admin" || post.user_id === user_id) && 
              <div className="post-author-buttons">
                <button onClick={() => {deletePost(post.id, index)}}>Supprimer</button>
                <button onClick={() => {updatePost(post, index)}}>Modifier</button>
              </div>
            }
           
            
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p className="post-author">Posté par {post.User.nickname}, le {post.updatedAt}</p>
          </li>
        ))
        }
      </ul>

    </div>
  );
}

export default Home;
