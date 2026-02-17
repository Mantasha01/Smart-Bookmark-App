"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // dynamic origin use karne se localhost aur production dono pe chalega
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-gray-200 border border-white flex flex-col items-center text-center">
          {/* Logo Section */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Smart<span className="text-blue-600">Mark</span>
          </h1>
          <p className="text-gray-500 mb-10 font-medium">
            Manage your bookmarks smartly. <br /> Fast, Private, and Real-time.
          </p>

          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold px-6 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 group"
          >
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/046/861/647/small/google-logo-transparent-background-free-png.png" 
              alt="Google" 
              className="w-6 h-6"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-xs text-gray-400">
            By signing in, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </motion.div>

      {/* Mini Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-sm font-medium">
          Created with ❤️ by{" "}
          <a 
            href="https://wa.me/916265301893" 
            target="_blank" 
            rel="noreferrer"
            className="text-blue-600 font-bold italic hover:underline"
          >
            Mantasha Sarfaraj
          </a>
        </p>
      </footer>
    </div>
  );
}