import Axios from 'axios';
import React, { useRef, useState } from 'react'
import SvgUploadImage from '../assets/svg/SvgUploadImage';
import { API, DEFAULT_PROFILE_IMAGE } from '../constants';
import { useAppSelector } from '../hooks/Actions';
import { useAutosizeTextArea } from '../hooks/helpers';
import './PostEditor.css'

interface Props {
  setCreatingPost: any,
  refreshPosts: any
}

interface PostContent {
  body: string,
  userID: number,
  formData: FormData
}

export const PostEditor: React.FC<Props> = (props: Props) => {
  
  const selector = useAppSelector(state => state)
  const [postContent, setPostContent] = useState<PostContent>({ body: '', formData: new FormData(), userID: selector.user.userID });
  const [imageUrl, setImageUrl] = useState(selector.user.profileImageUrl)
  const [postImage, setPostImage] = useState('')
  const [errored, setErrored] = useState(false)
  const [imageHover, setImageHover] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    if (ref.current) {
      ref.current.click();
    }
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, postContent.body);
  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setPostContent(prevState => ({ ...prevState, body: val }));
  };

  const uploadPostImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    setPostContent(prevState => ({ ...prevState, formData: fd }));
    setPostImage(URL.createObjectURL(e.target.files[0]))
  }

  const createPost = () => {
    postContent.formData.append('userID', selector.user.userID.toString())
    postContent.formData.append('body', postContent.body)
    props.setCreatingPost(false);
    Axios.post(`${API}/post/create/${selector.user.userID}`, postContent.formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => props.refreshPosts('>'))
  }

  const onError = () => {
    if (!errored) {
      setErrored(true)
      setImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }

  return (
    <div className='post'>
      <div id='header' className='postHeader'>
        <img src={API + imageUrl} onError={onError} alt='profile' className='profileImage'/>
        <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'start', flex: 1 }}>
          <span className='headerTextName'>{selector.user.name}</span>
          <span className='headerTextCompany'>{selector.user.company}</span>
        </div>

      </div>
      <textarea className='postBodyInput' maxLength={157} placeholder='hello moon - 🌏' onChange={handleChange} value={postContent.body} rows={2}
        ref={textAreaRef} />
      
      {postImage !== '' ? (<img src={postImage} alt='post' className='postImage'/>) : null}
      
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem'}}>
        <SvgUploadImage onMouseEnter={() => setImageHover(true)} onMouseLeave={() => setImageHover(false)}
          style={{ cursor: 'pointer'}} width={30} height={30} onClick={(e) => handleClick(e)} fill={imageHover ? '#3fffb9' : '#CCFFED'} />
        
        <button className='postButton' style={{ flex: 1, marginLeft: '1rem', cursor: 'pointer', backgroundColor: (postContent.body === '' ? '#d9fff1' : '#3fffb9') }}
         onClick={() => createPost()} disabled={postContent.body === ''} >
          <span>post</span>
        </button>
      </div>

      <input ref={ref} type={'file'} name="file" onChange={uploadPostImage} hidden/>
    </div>
  )
}
