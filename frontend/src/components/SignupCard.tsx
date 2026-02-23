"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

import { BACKEND_URL } from "@/app/config"
import { SpinnerLoader } from "./Loader"

export const SignupCard = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Creating your account...")

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        name,
        email,
        password,
      })

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user))
      }

      toast.success("Signup successful 🎉", { id: toastId })
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Signup failed. Please try again."

      toast.error(message, { id: toastId })
      setLoading(false) 
    }
   
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-linear-to-br from-[#F8F6F5] to-[#f0eeed]">
      <div className="bg-white px-12 py-10 rounded-2xl shadow-2xl w-1/3 border border-[#F8F6F5]">
        <div className="flex flex-col items-center">
          
          <div className="flex items-center space-x-3 mb-2">
            <Image
              src="/images/Background.png"
              width={48}
              height={48}
              alt="ZapFlow Logo"
            />
            <span className="text-[#0F172A] text-3xl font-bold">
              ZapFlow
            </span>
          </div>

          <p className="text-2xl font-bold mt-6 text-center text-[#0F172A]">
            Start automating your work
          </p>

          <p className="text-base mt-2 text-[#8D6D5E] text-center max-w-xs">
            Join hundreds of users saving time with ZapFlow
          </p>

          <div className="w-full mt-10 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0F172A] block">
                Name
              </label>
              <input
                type="text"
                placeholder="John"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-[#F8F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-[#F8F6F5] bg-opacity-30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0F172A] block">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#F8F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-[#F8F6F5] bg-opacity-30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0F172A] block">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#F8F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-[#F8F6F5] bg-opacity-30"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#FF5100] disabled:opacity-60 text-white p-3.5 rounded-lg font-semibold hover:bg-[#1e293b] transition mt-6 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <SpinnerLoader size="w-5 h-5" color="#FFFFFF" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#0F172A] font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}