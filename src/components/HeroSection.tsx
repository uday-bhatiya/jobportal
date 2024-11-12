'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { TypewriterEffectSmooth } from './ui/typewriter-effect';

export default function HeroSection() {

    const category = [
        "Frontend Developer",
        "Backend Developer",
        "Data Science",
        "Graphic Designer",
        "FullStack Developer"
    ]

    const words = [
        {
          text: "Search,",
        },
        {
          text: "Apply & ",
        },
        {
          text: "Get Your",
        },
        {
          text: "Dream Jobs.",
          className: "text-blue-500 dark:text-blue-500",
        },
      ];

    return (
        <div>
            <div className='flex flex-col gap-5 my-10 items-center'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                <TypewriterEffectSmooth words={words} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!</p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'

                        className='outline-none border-none w-full bg-transparent'

                    />
                    <Button className="rounded-r-full bg-blue-500">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>

            <Carousel className="w-full max-w-xl mx-auto my-10">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                <Button variant="outline" className="rounded-full">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
