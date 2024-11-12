'use client';

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(false);

  const words = [
    {
      text: "Start",
    },
    {
      text: "your",
    },
    {
      text: "career",
    },
    {
      text: "with",
    },
    {
      text: "Connectify.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        {loading ? (
          <Button disabled className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={() => setLoading(true)} variant={"outline"} className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            <Link href='/login'>Get started</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

{/* <div className=" w-full h-screen flex items-center justify-center">
{loading ? (
     <Button disabled>
       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
       Please wait
     </Button>
   ) : (
     <Button variant={"outline"}>
     <Link href='/login'>Get started</Link>
   </Button>
   )}
</div> */}

// <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
// Join now
// </button>
// <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
// Signup
// </button>