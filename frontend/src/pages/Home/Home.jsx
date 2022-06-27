import './Home.css';
import { useState, useEffect } from "react" //fonction qui permet de recuperer des "state", useEffect permet de charger les postes avec l'ensembles
import Header from '../../components/Header/Header';
import logo from "../../images/icon-left-font-monochrome-black.png"
import postsService from '../../services/postService';



function Home() {

  const [posts, setPosts] = useState([])
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


  return (
    <div className="Home">
      <Header />
      <h1>Voir les dernières publications</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))
        }
      </ul>

    </div>
  );
}

export default Home;
