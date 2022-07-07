import './LikeDislikeButtons.css';
import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import likeService from '../../services/likeService';
import dislikeService from '../../services/dislikeService';

function LikeDislikeButtons({ post }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    setLikes(post.likes);
    setDislikes(post.dislikes);
  }, [post]);

  const like = () => {
    likeService.addRemove(post.id).then(res => {
      let likes_ = likes;
      if (res.data.code === "likeAdded") {
        likes_++;
      } else if (res.data.code === "likeRemoved") {
        likes_--;
      }
      setLikes(likes_);
    }).catch(err => {
      alert(JSON.parse(err.request.response).error);
    });
  }

  const dislike = () => {
    dislikeService.addRemove(post.id).then(res => {
      let dislikes_ = dislikes;
      if (res.data.code === "dislikeAdded") {
        dislikes_++;
      } else if (res.data.code === "dislikeRemoved") {
        dislikes_--;
      }
      setDislikes(dislikes_);
    }).catch(err => {
      alert(JSON.parse(err.request.response).error);
    });
  }

  return (
    <div className="LikeDislikeButtons">
      <button onClick={like}>
        <FontAwesomeIcon icon={faThumbsUp} />
        <span>{likes}</span>
      </button>

      <button onClick={dislike}>
        <FontAwesomeIcon icon={faThumbsDown} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}

export default LikeDislikeButtons;
