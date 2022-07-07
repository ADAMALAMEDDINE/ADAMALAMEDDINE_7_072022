import './PostDetails.css';
import logo from '../../images/icon-left-font.png';
import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'


import postService from '../../services/postService';
import { __formatDateTime } from '../../services/utils';
import LikeDislikeButtons from '../../components/LikeDislikeButtonsn/LikeDislikeButtons';


function PostDetails() {

  let { postid } = useParams();
  const [post, setPost] = useState({
    title: "", content: "", author: "", updatedAt: "", imageUrl: ""
  });

  useEffect(() => {
    if (postid) {
      postService.getOne(postid).then(res => {
        const post_ = res.data.post;
        post_.updatedAt = __formatDateTime(post_.updatedAt);
        post_.author = post_.User.nickname;
        post_.imageUrl = post_.imageUrl ? post_.imageUrl : logo;
        setPost(post_)
      });
    }
  }, [postid]);


  return (
    <div className="PostDetails">
      <Link to="/accueil" className='go-back-link'>
        <FontAwesomeIcon icon={faChevronLeft} />
      </Link>
      <h1>{post.title}</h1>
      <p className='post-infos-top'>Publié par {post.author}, le {post.updatedAt}</p>
      <div className="post-infos">

        <div className='img-ctnr'>
          <img src={post.imageUrl} alt="" />
          <LikeDislikeButtons post={post}/>
        </div>
        
        <p className="post-content">{post.content}</p>
        
      </div>
    </div>
  );
}

export default PostDetails;
