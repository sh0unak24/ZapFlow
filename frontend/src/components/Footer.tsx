"use client"

import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="w-full bg-[#0F172A] text-white">
            <div className="container mx-auto px-10 py-20">
                {/* Everything in one row - maximum size */}
                <div className="flex flex-row items-start justify-between gap-16">
                    
                    {/* Left section - maximum size */}
                    <div className="flex flex-col max-w-lg">
                        <a href="#" className="flex items-center gap-5 mb-6">
                            <Image src="/images/Background.png" width={44} height={44} alt="ZapFlow Logo" />
                            <span className="text-3xl font-bold">ZapFlow</span>
                        </a>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Automating the world&apos;s workflows, one app at a time. 
                            Join over 10,000+ companies using ZapFlow.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Features</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Integrations</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Enterprise</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Press</a></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Community</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Security</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Status</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section with copyright and horizontal privacy links */}
                <div className="mt-20 pt-10 border-t border-gray-800">
                    {/* Privacy links in horizontal line */}
                    <div className="flex flex-row justify-center gap-12 mb-6">
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition">Cookies</a>
                    </div>
                    
                    {/* Copyright */}
                    <div className="flex justify-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 ZapFlow Inc. All rights reserved.
                        </p>
                    </div>
                </div>
                
                {/* BIG EMPTY SPACE AT BOTTOM */}
                {/* <div className="h-48"></div> */}
            </div>
        </footer>
    )
}