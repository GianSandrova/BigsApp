'use client';
import { CaretLeft, CaretRight, DotOutline } from '@phosphor-icons/react'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'


const Slider = () => {
    const slides = [
        { url: 'https://nusalimamedika.com/img/home1/banner/44.jpg' },
        { url: 'https://nusalimamedika.com/img/home1/banner/IMG_6591%20(1).jpg' },
        { url: 'https://nusalimamedika.com/img/home1/banner/31.jpg' },
        { url: 'https://nusalimamedika.com/img/home1/banner/logokuning.jpeg' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndext = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndext)
    }
    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndext = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndext)
    }
    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);


    return (
        <div className='h-[200px] w-full m-auto py-3 my-3 relative group'>
            <Image src={slides[currentIndex].url} layout='fill' objectFit='cover' alt='gambar' loading='eager' className='rounded-2xl bg-center bg-cover duration-500'/>
            {/* <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} loading="lazy" className='w-full h-full rounded-2xl bg-center bg-cover duration-500'></div> */}
            <div className='hidden group-hover:block absolute top-[100px] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer '>
                <CaretLeft onClick={prevSlide} size={32} />
            </div>
            <div className='hidden group-hover:block absolute top-[100px] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer '>
                <CaretRight onClick={nextSlide} size={32} />
            </div>
            <div className='flex justify-center top-[150px] -translate-x-0 translate-y-[-90%] py-2  text-white cursor-pointer'>
                {slides.map((slide, slideIndex) => (
                    <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className='text-2xl cursor-pointer'>
                        <DotOutline size={20} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Slider
