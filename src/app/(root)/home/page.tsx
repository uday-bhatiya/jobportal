'use client';

import HeroSection from '@/components/HeroSection';
import LatestJob from '@/components/LatestJob';
import React, { useEffect, useState } from 'react';


export default function page() {

    return (
        <div className='text-center mt-40'>
            <HeroSection />
            <LatestJob />
        </div>
    )
}
