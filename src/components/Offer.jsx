import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Offer = () => {
  const offerRef = useRef(null);
  const bgRef = useRef(null);

  useGSAP(() => {
    // أنميشن الخلفية تتسع (Scale) مع السكرول
    gsap.fromTo(bgRef.current, 
      { scale: 1.2, filter: "brightness(0.2)" },
      {
        scale: 1,
        filter: "brightness(0.6)",
        scrollTrigger: {
          trigger: offerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    // أنميشن النص يظهر من الجوانب
    gsap.from(".offer-content", {
      scrollTrigger: {
        trigger: offerRef.current,
        start: "top 60%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, { scope: offerRef });

  return (
    <section 
      ref={offerRef} 
      className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* الصورة الخلفية (تقدر تحط صورة ملابس أو موديل) */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero7.png')", // استخدم صورة قوية من اللي عندك
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* طبقة سواد خفيفة للتغطية */}
      <div className="absolute inset-0 bg-black/40 z-1" />

      <div className="offer-content relative z-10 text-center px-6">
        <h4 className="text-red-500 font-mono tracking-[0.5em] text-sm mb-4 uppercase">
          Limited Time Offer
        </h4>
        
        <h2 className="text-white text-7xl md:text-9xl font-black mb-6 tracking-tighter">
          GET <span className="text-transparent bg-clip-text bg-stroke-white" style={{ WebkitTextStroke: "1px white" }}>20%</span> OFF
        </h2>

        <p className="text-white/80 text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto">
          Upgrade your wardrobe with our latest disruptive collection. 
          The future of fashion is here.
        </p>

        <a 
          href="/shop" // حط لينك المتجر بتاعك هنا
          className="inline-block bg-white text-black px-12 py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-500 transform hover:scale-105"
        >
          Shop Collection Now
        </a>
      </div>

      {/* عناصر جمالية متطايرة باستخدام data-speed */}
      <div 
        className="absolute top-10 left-10 text-white/10 text-9xl font-black pointer-events-none"
        data-speed="1.4"
      >
        20%
      </div>
      <div 
        className="absolute bottom-10 right-10 text-white/10 text-9xl font-black pointer-events-none"
        data-speed="0.6"
      >
        OFF
      </div>
    </section>
  )
}

export default Offer