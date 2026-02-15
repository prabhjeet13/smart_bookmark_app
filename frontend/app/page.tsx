"use client";
import Googleicon from "./assets/googleicon.png";
import { supabase } from "./supabaseclient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const router = useRouter();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/bookmarks");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
}, [router]);
  
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">

    <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
      SMART BOOKMARK MANAGER
    </h1>

    <div className="text-gray-700 space-y-3 leading-relaxed">
      <p>Save and manage your bookmarks securely.</p>
      <p>All bookmarks are private and synced in real time across devices.</p>

      <p>
        Bookmarks, both Physical and Digital help you remember pages or links for later use.
      </p>
      <p>
        Bookmarks make it easy to find useful information quickly without searching again.      </p>
      <p>
        Manage them efficiently using this bookmark manager application.
      </p>
    </div>

    <button
      onClick={handleGoogleLogin}
      className="cursor-pointer mt-8 mx-auto flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
      <img className="w-8 h-8" src={Googleicon.src} alt="Google icon" />
      <span className="font-semibold text-gray-800 text-lg">
        Sign in with Google
      </span>
    </button>

  </div>
</div>

  );
}
