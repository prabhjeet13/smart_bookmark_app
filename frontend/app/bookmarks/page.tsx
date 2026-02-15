"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {supabase} from "../supabaseclient";
import { useRouter } from 'next/navigation';
interface bookmark {
  id? : number;
  title : string;
  url : string;
  userId? : string;
}


export default function BookmarksPage() {

  const [isSave,setisSave] = useState<boolean>(true);
  const [bookmarks,setbookmarks] = useState<bookmark[]>([]);
  const [bookmarkId,setBookmarkId] = useState<number>();
  const router = useRouter();
  const {setValue,register,reset,handleSubmit} = useForm<bookmark>({defaultValues:{
    title: '',
    url:''  
  }})

  
  const fetchBookmarks = async () => {

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert((error as any).message);  
      return;
    }

    setbookmarks(data || []);
  };

  useEffect(() => {

    fetchBookmarks();
    const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      (payload) => {
        console.log('real-time',payload);
        fetchBookmarks();
      }
    )
    .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };

  },[])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          router.replace("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
}, [router]);

const submitHandler = async (data: bookmark) => {
  try {
    
    
    if (bookmarkId && !isSave) {
      const { error } = await supabase
        .from("bookmarks")
        .update({
          title: data.title,
          url: data.url        })
        .eq("id", bookmarkId)

      if (error) throw error;
      setisSave(true);
      setBookmarkId(undefined);
    } else {
    
      const { error } = await supabase
        .from("bookmarks")
        .insert([
          {
            title: data.title,
            url: data.url
          },
        ]);

      if (error) throw error;
    }
    reset();
    fetchBookmarks();
  } catch (err : any) {
      alert(err.message);  
  }
};
const deleteHandler = async (bookmark: bookmark) => {
  try {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id)

    if (error) throw error;
    fetchBookmarks();
  } catch (err : any) {
    alert(err.message);
  }
};

const logout = async () => {
  await supabase.auth.signOut(); 
} 


  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 p-6">
  
  <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-10">
    BOOKMARKS
  </h1>

  <button onClick={logout} className="cursor-pointer rounded-md p-2 m-2 text-center bg-red-500 text-white transition-all duration-200 hover:scale-90">
       logout
  </button>

  <form onSubmit={handleSubmit(submitHandler)} className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-center">
    
    <input
      {...register("title",{required:true})}
      type="text"
      required
      placeholder="Enter title"
      className="w-full md:w-1/3 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <input
     {...register("url",{required:true})}
      type="text"
      required
      placeholder="Enter URL"
      className="w-full md:w-1/2 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <button
      type="submit"
      className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-200 hover:bg-green-600 hover:scale-95"
    >
      {isSave ? "Create Bookmark" : "Update Bookmark"}
    </button>
    {!isSave && (<button
      onClick={() => {setisSave(true); setValue("title",""); setValue("url",''); setBookmarkId(undefined)}}
      className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-200 hover:bg-green-600 hover:scale-95"
    >
      cancel
    </button>
    )}
  </form>

  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {bookmarks.map((b) => (
      <div
        key={b.id}
        className="flex flex-col  bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
      >
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">#bookmark</p>
          <div className="flex gap-2"><p 
          onClick={() => {setisSave(false); setBookmarkId(b.id); setValue("title",b.title); setValue("url",b.url)}}
          className="text-blue-400 text-md cursor-pointer">Edit</p>
          <p 
           onClick={() => deleteHandler(b)}
          className="text-red-400 text-md cursor-pointer">Delete</p></div>
        </div> 
        <p className="text-lg mb-2 mt-2">
          <span className="font-semibold text-gray-700">Title:</span>{" "}
          {b.title}
        </p>

        <p className="text-lg">
          <span className="font-semibold text-gray-700">URL:</span>{" "}
          <a
            href={b.url}
            target="_blank"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {b.url}
          </a>
        </p>
      </div>
    ))}
  </div>

</div>
  );
}
