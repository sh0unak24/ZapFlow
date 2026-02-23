"use client"

import { BACKEND_URL } from "@/app/config"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { SpinnerLoader } from "./Loader"

export const LoginCard = () => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) {
          toast.error("All fields are required")
          return
        }
    
        setLoading(true)
        const toastId = toast.loading("Logging into your account...")
    
        try {
          const res = await axios.post(`${BACKEND_URL}/api/v1/user/login`, {
            email,
            password,
          }, {
            withCredentials : true
          })
    
          toast.success("Login successful", { id: toastId })
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
    
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            "Login failed. Please try again."
    
          toast.error(message, { id: toastId })
          setLoading(false) 
        }
       
      }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-linear-to-br from-[#F8F6F5] to-[#f0eeed]">
            <div className="bg-white px-12 py-10 rounded-2xl shadow-2xl w-1/3 border border-[#F8F6F5]">
                <div className="flex flex-col items-center">

                    <a href="#" className="flex items-center space-x-3 mb-2">
                        <Image src="/images/Background.png" width={48} height={48} alt="ZapFlow Logo" />
                        <span className="text-[#0F172A] text-3xl font-bold">
                            ZapFlow
                        </span>
                    </a>
                    

                    <p className="text-2xl font-bold mt-6 text-center text-[#0F172A]">
                        Welcome Back
                    </p>
                    

                    <p className="text-base mt-2 text-[#8D6D5E] text-center max-w-sm">
                        Login to your account to continue automating
                    </p>


                    <div className="w-full mt-10 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#0F172A] block">
                                Email
                            </label>
                            <input 
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                type="email"
                                placeholder="jon@example.com"
                                className="w-full p-3 border border-[#F8F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition bg-[#F8F6F5] bg-opacity-30 placeholder:text-gray-400"
                            />
                        </div>
                        

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#0F172A] block">
                                Password
                            </label>
                            <input 
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                type="password"
                                placeholder="********"
                                className="w-full p-3 border border-[#F8F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition bg-[#F8F6F5] bg-opacity-30 placeholder:text-gray-400"
                            />
                        </div>

                        <button
                        onClick={() => {
                            handleLogin()
                        }}
                        className="w-full bg-[#FF5100] text-white p-3.5 rounded-lg font-semibold hover:bg-[#1e293b] transition mt-6 shadow-md">
                            { loading ? (
                                <>
                                    <SpinnerLoader size="w-5 h-5" color="#FFFFFF" />
                                    <span>Logging into your account</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <div>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                New to Zap Flow?{' '}
                                <a onClick={() => {
                                }} href="/signup" className="text-[#0F172A] font-semibold hover:underline">
                                    Create an account
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}