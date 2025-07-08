import React, { useContext, useEffect, useState } from 'react';
import logo from "../assets/logo.png";
import { IoSearchSharp, IoChatbubblesSharp, IoNotificationsSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { MdExplore } from "react-icons/md";
import dp from "../assets/dp.webp";
import { userDataContext } from '../context/userContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const [activeSearch, setActiveSearch] = useState(false);
  const { userData, setUserData, handleGetProfile } = useContext(userDataContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSignOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      setUserData(null);
      navigate("/login");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true });
      setSearchData(result.data);
    } catch (error) {
      setSearchData([]);
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchInput]);

  return (
    <div className='w-full h-[80px] bg-gradient-to-r from-[#e0f7ff] via-[#c4e4ff] to-[#e0f7ff] fixed top-0 shadow-md flex justify-between md:justify-around items-center px-4 left-0 z-[80] border-b border-blue-200 backdrop-blur-[2px] transition-all duration-300'>

      {/* Logo and Search */}
      <div className='flex items-center gap-3'>
        <div onClick={() => { setActiveSearch(false); navigate("/") }} className='cursor-pointer'>
          <img src={logo} alt="Logo" className='w-[140px] hover:scale-105 transition-transform duration-300' />
        </div>

        {!activeSearch && (
          <IoSearchSharp className='w-6 h-6 text-gray-600 lg:hidden cursor-pointer hover:text-[#38D4F2]' onClick={() => setActiveSearch(true)} />
        )}

        <form className={`transition-all duration-300 ease-in-out rounded-xl bg-[#f4f4f4] lg:flex items-center gap-2 px-3 py-2 ${!activeSearch ? "hidden" : "flex"} w-[180px] lg:w-[320px]`}>
          <IoSearchSharp className='w-5 h-5 text-gray-500' />
          <input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className='bg-transparent outline-none w-full text-sm'
          />
        </form>

        {searchData.length > 0 && (
          <div className='absolute top-[85px] left-0 lg:left-[20px] w-full lg:w-[650px] max-h-[450px] bg-white shadow-xl rounded-xl overflow-y-auto p-4 z-[100]'>
            {searchData.map((sea) => (
              <div key={sea.userName} className='flex gap-4 items-center border-b py-2 hover:bg-gray-100 rounded-md px-2 cursor-pointer'
                onClick={() => handleGetProfile(sea.userName)}>
                <img src={sea.profileImage || dp} alt="Profile" className='w-12 h-12 rounded-full object-cover' />
                <div>
                  <div className='font-semibold text-gray-800'>{sea.firstName} {sea.lastName}</div>
                  <div className='text-sm text-gray-500'>{sea.headline}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nav Icons & Profile */}
      <div className='flex items-center gap-6'>

        {/* Popup Profile Card */}
        {showPopup && (
          <div className='absolute top-[75px] right-4 lg:right-[100px] w-[280px] bg-white shadow-2xl rounded-xl p-4 z-[90] flex flex-col gap-3 animate-fade-in'>
            <div className='flex flex-col items-center'>
              <img src={userData.profileImage || dp} className='w-16 h-16 rounded-full object-cover' alt="Profile" />
              <div className='font-semibold text-gray-800 mt-2'>{userData.firstName} {userData.lastName}</div>
            </div>

            <button className='border border-[#38D4F2] text-[#38D4F2] hover:bg-[#38D4F2]/10 py-2 rounded-full transition-all'
              onClick={() => handleGetProfile(userData.userName)}>View Profile</button>

            <hr className='border-gray-200' />

            <div className='flex items-center gap-2 text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/network")}>
              <FaUserGroup className='w-5 h-5' />
              <span>My Networks</span>
            </div>

            <div className='flex items-center gap-2 text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/messages")}>
              <IoChatbubblesSharp className='w-5 h-5' />
              <span>Messages</span>
            </div>

            <div className='flex items-center gap-2 text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/explore")}>
              <MdExplore className='w-5 h-5' />
              <span>Explore</span>
            </div>

            <button className='border border-[#F1651F] text-[#F1651F] hover:bg-[#F1651F]/10 py-2 rounded-full mt-2 transition-all'
              onClick={handleSignOut}>Sign Out</button>
          </div>
        )}

        {/* Icons */}
        <div className='hidden lg:flex flex-col items-center text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/")}>
          <TiHome className='w-6 h-6' />
          <span className='text-xs'>Home</span>
        </div>

        <div className='hidden md:flex flex-col items-center text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/network")}>
          <FaUserGroup className='w-6 h-6' />
          <span className='text-xs'>Network</span>
        </div>

        <div className='flex flex-col items-center text-gray-600 hover:text-[#F1651F] cursor-pointer' onClick={() => navigate("/notification")}>
          <IoNotificationsSharp className='w-6 h-6' />
          <span className='text-xs hidden md:block'>Alerts</span>
        </div>

        <div className='w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-[#38D4F2] cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
          <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
      </div>
    </div>
  );
}

export default Nav;
