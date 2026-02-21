"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
export const AppBar = () => {

    const router = useRouter()

    return <nav className="bg-[#F8F6F5] fixed z-20 w-full border-b top-0 inset-s-0 border-amber-600">
        <div className="max-w-screen flex items-center justify-between mx-auto p-4 relative">
            {/* Left section - Logo */}
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse pl-4">
                <Image src="/images/Background.png" width={44} height={44} alt="Picture">
                </Image>
                <span className="text-[#0F172A] text-3xl font-bold">
                    ZapFlow
                </span>
            </a>

            {/* Center section - Navigation */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                <ul className="flex font-medium space-x-8">
                    <li>
                        <a  className="text-[#475569] hover:text-[#FF5100] transition-colors cursor-pointer">
                            Home
                        </a>
                    </li>
                    <li>
                        <a className="text-[#475569] hover:text-[#FF5100] transition-colors cursor-pointer">
                            Features
                        </a>
                    </li>
                    <li>
                        <a className="text-[#475569] hover:text-[#FF5100] transition-colors cursor-pointer">
                            Pricing
                        </a>
                    </li>
                    <li>
                        <a className="text-[#475569] hover:text-[#FF5100] transition-colors cursor-pointer">
                            Contact
                        </a>
                    </li>
                </ul>
            </div>

            {/* Right section - Empty for balance (optional) */}
            <div className="w-50 hidden md:block">
                <div className="flex space-x-5">
                    <span onClick={() => {
                        router.push("/login")
                    }}  className="text-[#334155] pt-2 text-xl font-bold cursor-pointer">
                        Log In
                    </span>
                    <button onClick={() => {
                        router.push("/signup")
                    }} className="bg-[#FF5100] px-4 py-2 rounded-xl hover:bg-[#E64900] transition-colors">
                        <span className="text-white text-lg font-bold">
                            Sign Up
                        </span>
                    </button>
                </div>
                
            </div>
        </div>
    </nav>
}