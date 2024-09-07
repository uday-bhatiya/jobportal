'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(false);

  return (
   <div className=" w-full h-screen flex items-center justify-center">
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
   </div>
  )
}

