import React, { useContext, useState } from 'react'
import Linkneer from "../assets/Linkneer.png"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'

function Login() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f4f9ff] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={Linkneer} alt="Linkneer Logo" className="h-[100px] object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-center text-[#1a1a1a] mb-6">Welcome Back 👋</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            required
            className="h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#38D4F2] focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              className="h-12 px-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#38D4F2] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-3 text-sm text-[#38D4F2] font-medium cursor-pointer select-none"
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>
          {err && (
            <p className="text-center text-red-500 text-sm">* {err}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-12 bg-[#38D4F2] hover:bg-[#24b2ff] transition-colors text-white font-semibold rounded-full mt-4"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-gray-600 mt-2">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#F1651F] font-medium cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
