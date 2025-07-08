import React, { useContext, useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import dp from "../assets/dp.webp";
import { FiPlus, FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';
import './Home.css';

function Home() {
  const { userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadPost, setUploadPost] = useState(false);
  const image = useRef();
  const [posting, setPosting] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState([]);

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  async function handleUploadPost() {
    setPosting(true);
    try {
      const formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }
      const result = await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true });
      console.log(result);
      setPosting(false);
      setUploadPost(false);
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/suggestedusers", { withCredentials: true });
      console.log(result.data);
      setSuggestedUser(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
  }, []);

  useEffect(() => {
    getPost();
  }, [uploadPost]);

  return (
    <div className='w-full min-h-[100vh] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px] bg-gradient-to-r from-[#e0f7ff] via-[#c4e4ff] to-[#e0f7ff]'>

      {edit && <EditProfile />}
      <Nav />

      {/* LEFT PROFILE CARD */}
      <div className='card w-full lg:w-[25%] min-h-[200px] relative'>
        <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.coverImage || ""} alt="" className='w-full' />
          <FiCamera className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white cursor-pointer' />
        </div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer profile-img' onClick={() => setEdit(true)}>
          <img src={userData.profileImage || dp} alt="" className='h-full' />
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center cursor-pointer'>
          <FiPlus className='text-white' />
        </div>
        <div className='mt-[30px] pl-[20px] font-semibold text-gray-700'>
          <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className='text-[18px] font-semibold text-gray-600'>{userData.headline || ""}</div>
          <div className='text-[16px] text-gray-500'>{userData.location}</div>
        </div>
        <button className='w-full h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
          Edit Profile <HiPencil />
        </button>
      </div>

      {/* DARK OVERLAY WHEN POST IS OPEN */}
      {uploadPost && <div className='w-full h-full bg-black fixed top-0 z-[100] left-0 opacity-[0.6]'></div>}

      {/* UPLOAD POST MODAL */}
      {uploadPost &&
        <div className='card w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg top-[100px] rounded-lg fixed z-[200] p-[20px] flex items-start justify-start flex-col gap-[20px]'>
          <div className='absolute top-[20px] right-[20px] cursor-pointer'>
            <RxCross1 className='w-[25px] h-[25px] text-gray-800 font-bold' onClick={() => setUploadPost(false)} />
          </div>
          <div className='flex justify-start items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
              <img src={userData.profileImage || dp} alt="" className='h-full' />
            </div>
            <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`}</div>
          </div>
          <textarea className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} outline-none border-none p-[10px] resize-none text-[19px]`} placeholder='What do you want to talk about..?' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          <input type="file" ref={image} hidden onChange={handleImage} />
          {frontendImage && (
            <div className='w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg'>
              <img src={frontendImage} alt="" className='h-full rounded-lg' />
            </div>
          )}
          <div className='w-full h-[200px] flex flex-col'>
            <div className='p-[20px] flex items-center justify-start border-b-2 border-gray-500'>
              <BsImage className='w-[24px] h-[24px] text-gray-500 icon-hover' onClick={() => image.current.click()} />
            </div>
            <div className='flex justify-end items-center'>
              <button className='btn-primary w-[100px] h-[50px] rounded-full mt-[40px]' disabled={posting} onClick={handleUploadPost}>
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>}

      {/* POST FEED */}
      <div className='w-full lg:w-[50%] min-h-[200px] flex flex-col gap-[20px]'>
        <div className='w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center p-[20px] justify-center gap-[10px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer'>
            <img src={userData.profileImage || dp} alt="" className='h-full' />
          </div>
          <button className='w-[80%] h-[60px] border-2 rounded-full border-gray-500 flex items-center justify-start px-[20px] hover:bg-gray-200' onClick={() => setUploadPost(true)}>Start a post</button>
        </div>

        {postData.map((post, index) => (
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
        ))}
      </div>

      {/* SUGGESTED USERS */}
      <div className='card w-full lg:w-[25%] min-h-[200px] hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
        {suggestedUser.length > 0 ? (
          <div className='suggestion-list flex flex-col gap-[10px]'>
            {suggestedUser.map((su) => (
              <div key={su._id} className='flex items-center gap-[10px] mt-[10px] cursor-pointer hover:bg-gray-200 rounded-lg p-[5px]' onClick={() => handleGetProfile(su.userName)}>
                <div className='w-[40px] h-[40px] rounded-full overflow-hidden profile-img'>
                  <img src={su.profileImage || dp} alt="" className='w-full h-full' />
                </div>
                <div>
                  <div className='text-[19px] font-semibold text-gray-700'>{`${su.firstName} ${su.lastName}`}</div>
                  <div className='text-[12px] font-semibold text-gray-700'>{su.headline}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No Suggested Users</div>
        )}
      </div>
    </div>
  );
}

export default Home;
