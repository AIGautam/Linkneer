import React, { useContext, useState } from 'react'
import Linkneer from "../assets/Linkneer.png"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'

function Signup() {
  const [show, setShow] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(userDataContext)
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        firstName, lastName, userName, email, password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setUserName("")
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f2f7fd] flex flex-col items-center justify-start pt-6 px-4">
      <div className="w-full max-w-[480px] flex items-center justify-center mb-4">
        <img src={Linkneer} alt="Linkneer Logo" className="h-[85px] object-contain" />
      </div>

      <form
        onSubmit={handleSignUp}
        className="w-full max-w-[420px] bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-8 flex flex-col gap-5"
      >
        <h2 className="text-[28px] font-bold text-center text-gray-800 mb-2">Create your account</h2>

        <input
          type="text"
          placeholder="First Name"
          required
          className="h-12 px-4 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38D4F2]"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          required
          className="h-12 px-4 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38D4F2]"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username"
          required
          className="h-12 px-4 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38D4F2]"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="h-12 px-4 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38D4F2]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            required
            className="h-12 w-full px-4 pr-[80px] border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38D4F2]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute top-2 right-4 text-sm text-[#38D4F2] font-medium focus:outline-none"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {err && <p className="text-center text-red-500 text-sm">* {err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="h-12 mt-2 bg-[#38D4F2] hover:bg-[#24b2ff] text-white font-semibold rounded-full transition-all duration-300"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-1">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#F1651F] font-semibold cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  )
}

export default Signup
