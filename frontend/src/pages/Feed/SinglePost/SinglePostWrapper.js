import React from 'react';
import { useParams } from 'react-router-dom';
import SinglePost from './SinglePost';
import './SinglePost.css';

const SinglePostWrapper = (props) => {
  const { postId } = useParams();
  return <SinglePost {...props} postId={postId} />;
};

export default SinglePostWrapper;
