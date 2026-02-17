"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.replace("/");
        return;
      }
      setUser(data.user);
      await fetchBookmarks(data.user.id);

      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${data.user.id}`,
          },
          () => fetchBookmarks(data.user.id)
        )
        .subscribe();
      setLoading(false);
    };
    init();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookmarks = async (uid) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url || !user) return;
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ title, url, user_id: user.id })
      .select()
      .single();

    if (!error) {
      setBookmarks((prev) => [data, ...prev]);
      setTitle("");
      setUrl("");
    }
  };

  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-18 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Smart<span className="text-blue-600">Mark</span>
            </h1>
          </div>
          <button 
            onClick={logout} 
            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-6 md:p-10">
        {/* User Info */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Hey, Welcome! 👋</h2>
          <p className="text-gray-500 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             {user.email}
          </p>
        </div>

        {/* Add Bookmark Card */}
        <section className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-10 transition-all hover:shadow-2xl hover:shadow-gray-300/50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Quick Add</h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Site Name"
              className="md:col-span-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3 outline-none border transition-all"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL (https://...)"
              className="md:col-span-3 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3 outline-none border transition-all"
            />
            <button
              onClick={addBookmark}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Add to List
            </button>
          </div>
        </section>

        {/* Search Bar */}
        <div className="relative mb-8 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input
            className="w-full bg-white border border-gray-200 pl-12 pr-4 py-4 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all text-lg"
            placeholder="Search your saved links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.length ? (
              filteredBookmarks.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="flex-grow min-w-0 pr-4">
                    <p className="font-bold text-gray-800 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {b.title}
                    </p>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 text-sm truncate block mb-2 hover:underline"
                    >
                      {b.url}
                    </a>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       {new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} • {new Date(b.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    title="Delete"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20"
              >
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <p className="text-gray-400 font-medium">No bookmarks match your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center">
         <p className="mt-2 text-gray-600 font-medium">
  Created with ❤️ by{" "}
  <a 
    href="https://wa.me/916265301893" 
    target="_blank" 
    rel="noreferrer"
    className="text-blue-600 font-bold italic hover:underline cursor-pointer"
  >
    Mantasha Sarfaraj
  </a>
</p>
        </div>
      </footer>
    </div>
  );
}