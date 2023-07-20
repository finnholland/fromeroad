import Axios from 'axios';
import React, { useRef, useState } from 'react'
import SvgUploadImage from '../assets/svg/SvgUploadImage';
import { API, DEFAULT_PROFILE_IMAGE, EIGHT_MEGABYTES, S3_BUCKET } from '../constants';
import { useAppSelector } from '../hooks/Actions';
import { useAutosizeTextArea } from '../hooks/helpers';
import './PostEditor.css'
import { Link, getDomain } from '../hooks/posts/postHelpers';

interface Props {
  setCreatingPost: any,
  refreshPosts: any,
  placeholder: string
}

interface PostContent {
  body: string,
  userId: number,
  formData: FormData
}

export const PostEditor: React.FC<Props> = (props: Props) => {
  
  const selector = useAppSelector(state => state)
  const [postContent, setPostContent] = useState<PostContent>({ body: '', formData: new FormData(), userId: selector.user.userId });
  const [imageUrl, setImageUrl] = useState(selector.user.profileImageUrl)
  const [postImage, setPostImage] = useState('')
  const [errored, setErrored] = useState(false)
  const [imageHover, setImageHover] = useState(false);
  const [fileTooLarge, setFileTooLarge] = useState(false);
  const [postLinks, setPostLinks] = useState<Link[]>([]);

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
    if (postContent.body.length === 0) {
      setPostLinks([]);
    }
  };

  const handlePaste = (evt: React.ClipboardEvent<HTMLTextAreaElement>) => {
    evt.preventDefault();
    const domain = getDomain(evt.clipboardData.getData('Text'))
    
    if (domain.fullUrl !== '' && domain.domain !== '') {
      const tempBody = postContent.body + domain.domain;
      if (!postLinks.find(link => link === domain)) {
        setPostLinks(prevState => [...prevState, domain])
      }
      setPostContent(prevState => ({ ...prevState, body: tempBody }));
    }
  };

  const uploadPostImage = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size >= EIGHT_MEGABYTES) {
        setTimeout(() => {
          setFileTooLarge(false)
        }, 5000);
        setFileTooLarge(true)
        return;
      } else {
        const fd = new FormData();
        fd.append('file', e.target.files[0])
        setPostContent(prevState => ({ ...prevState, formData: fd }));
        setPostImage(URL.createObjectURL(e.target.files[0]))
      }
    }
    const fd = new FormData();
    fd.append('file', e.target.files[0])
  }

  const createPost = () => {
    postContent.formData.append('userId', selector.user.userId.toString())
    let tempBody = postContent.body;

    const map = new Map();
    postLinks.forEach(a => map.set(a.domain, (map.get(a.domain) || 0) + 1));

    const duplicateLinks = postLinks.filter(dl => map.get(dl.domain) > 1)
    const uniqueLinks = postLinks.filter(ul => map.get(ul.domain) === 1)

    uniqueLinks.forEach(ul => {
      tempBody = tempBody.replace(ul.domain, ul.fullUrl);
    });
    
    for (let i = 0; i < duplicateLinks.length; i++) {
      const dl = duplicateLinks[i];
      const re = new RegExp(`^(?:.*?${dl.domain}){${i+1}}`);
      tempBody = tempBody.replace(re, function (x) { return x.replace(RegExp(dl.domain + "$"), dl.fullUrl) });
    }
    postContent.formData.append('body', tempBody);
    props.setCreatingPost(false);
    Axios.post(`${API}/post/create/${selector.user.userId}`, postContent.formData, {
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
    <div className={selector.settings.darkMode ? 'post postDarkMode' : 'post'}>
      <div id='header' className='postHeader'>
          <div className='user' style={{width: '100%'}}>
            <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className='profileImage' />
            <div className='headerDetails'>
              <span className='headerTextName'>{selector.user.name}</span>
              <span className='headerTextCompany'>{selector.user.company}</span>
            </div>
          </div>

      </div>
      <textarea className={selector.settings.darkMode ? 'postBodyInput postBodyInputDarkMode' : 'postBodyInput'} maxLength={157} placeholder={props.placeholder} onChange={handleChange} onPaste={handlePaste} value={postContent.body} rows={2}
        ref={textAreaRef} />
      
      {postImage !== '' ? (<img src={postImage} alt='post' className='postImage'/>) : null}
      {fileTooLarge ? (<span style={{color: 'red', fontSize: 12, marginTop: 10}}>files cannot be more than <b>8mb</b> thanks!</span>) : null}
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem'}}>
        <SvgUploadImage onMouseEnter={() => setImageHover(true)} onMouseLeave={() => setImageHover(false)}
          style={{ cursor: 'pointer' }} width={30} height={30} onClick={(e) => handleClick(e)}
          fill={imageHover ? (selector.settings.darkMode ? '#F6C6FF' : '#3fffb9') : (selector.settings.darkMode ? '#F6C6FF50' : '#CCFFED')} />
        
        <button className={postContent.body.trim() === '' ? 'postButton postButtonDisabled' : 'postButton'}
          style={{ flex: 1, marginLeft: '1rem', cursor: 'pointer' }}
         onClick={() => createPost()} disabled={postContent.body === ''} >
          <span>post</span>
        </button>
      </div>

      <input ref={ref} type={'file'} name="file" onChange={uploadPostImage} hidden/>
    </div>
  )
}
