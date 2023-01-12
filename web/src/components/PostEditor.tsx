import Axios from 'axios';
import React, { useRef, useState } from 'react'
import { API } from '../constants';
import { useAppSelector } from '../redux/Actions';

interface Props {
  setCreatingPost: any,
  getPosts: any
}

interface PostContent {
  body: string,
  userID: number,
  formData: FormData
}

export const PostEditor: React.FC<Props> = (props: Props) => {
  
  const selector = useAppSelector(state => state)
  const [postContent, setPostContent] = useState<PostContent>({ body: '', formData: new FormData(), userID: selector.user.userID });
  
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    console.log(e.target.id)
    if (ref.current) {
      ref.current.click();
    }
  }

  const uploadPostImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    setPostContent(prevState => ({...prevState, formData: fd}))
  }

  const createPost = () => {
    postContent.formData.append('userID', selector.user.userID.toString())
    postContent.formData.append('body', postContent.body)
    console.log(postContent.formData)
    props.setCreatingPost(false);
    Axios.post(`${API}/post/create`, postContent.formData, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(props.getPosts())
  }

  return (
    <div>
      <button id='postImage' onClick={(e) => handleClick(e)}>image</button>
      <input value={postContent.body} onChange={(e) => setPostContent(prevState => ({...prevState, body: e.target.value}))} />
      <button onClick={() => createPost()}>post</button>
      <button onClick={() => props.setCreatingPost(false)}>cancel</button>
      <input ref={ref} type={'file'} name="file" onChange={uploadPostImage} hidden/>
    </div>
  )
}
