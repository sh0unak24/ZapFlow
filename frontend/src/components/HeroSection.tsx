export const HeroSection = () => {
    return <div className="bg-red-100 z-0 w-full h-screen mt-16 pt-8">
        <div className="container mx-auto px-4">
            <div className="mt-40 flex justify-center items-center">
                <div className="grid text-center">
                    <span className="font-extrabold text-[#0F172A] text-7xl">Automate Your Workday</span>
                    <span className="font-extrabold text-[#0F172A] text-7xl">
                        on the <span className="text-[#FF5100]">Big Screen</span>
                    </span>
                    <p className="w-120 pt-4 text-center mx-auto text-xl text-[#475569]">
                        Experience the power of desktop-class automation. ZapFlow brings
                        ultra-fast workflows to your native environment with zero latency and
                        massive efficiency.
                    </p>
                    <div className="space-x-4 p-4 pt-8">
                        <button className="bg-[#FF5100] px-6 py-3 rounded-xl text-white hover:text-black hover:bg-white transition-colors">
                            <span className=" text-xl font-bold">
                                Get Started For Free
                            </span>
                        </button>
                        <button className="bg-white px-6 py-3 rounded-xl text-black  hover:bg-[#FF5100] transition-colors hover:text-white">
                            <span className="text-xl font-bold">
                                View Demo
                            </span>
                        </button>
                    </div>
                    <div className="w-20 h-0.5 bg-[#FF5100] mx-auto mt-10"></div>
                </div>
            </div>
        </div>
    </div>
}