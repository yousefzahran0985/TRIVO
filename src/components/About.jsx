import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // 1. أنميشن للنص الأساسي (ظهور تدريجي)
    gsap.from(".about-text", {
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        end: "top 40%",
        scrub: 1,
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    // 2. أنميشن للصورة الجانبية (تكبير بسيط مع السكرول)
    gsap.to(".about-image", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      scale: 1.2,
      y: -50
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen bg-black text-white py-32 px-6 relative overflow-hidden">
      
      {/* نص خلفي كبير جداً يتحرك بالـ data-speed (Parallax) */}
      <div 
        className="absolute top-20 left-0 text-[15rem] font-black text-white/5 whitespace-nowrap pointer-events-none select-none"
        data-speed="0.5"
      >
        WE ARE DISRUPTIVE
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* الجانب الأيسر: الصور */}
        <div className="relative">
          <div className="w-full h-[600px] overflow-hidden rounded-sm border border-white/10">
            <img 
              src="/hero4.png" // تقدر تستخدم صورة من الهيرو لضمان التناسق
              alt="About Us"
              className="about-image w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          {/* مربع صغير جمالي */}
          <div 
            className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-600 z-[-1]" 
            data-speed="1.2"
          />
        </div>

        {/* الجانب الأيمن: المحتوى */}
        <div ref={textRef} className="space-y-8">
          <h2 className="about-text text-red-500 font-mono tracking-[0.4em] text-sm uppercase">
            // Who we are
          </h2>
          
          <h3 className="about-text md:text-6xl text-5xl font-black leading-[0.9] tracking-tighter">
            WE BLUR THE LINE <br /> 
            BETWEEN <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">ART</span> & <br />
            TECHNOLOGY.
          </h3>

          <p className="about-text text-white/60 text-lg max-w-lg leading-relaxed font-light">
            Founded in 2026, our studio focuses on creating digital experiences 
            that challenge the status quo. We don't just build websites; 
            we build high-performance visual ecosystems.
          </p>

          <div className="about-text pt-6">
            <button className="group relative px-10 py-4 overflow-hidden border border-white/20 transition-all hover:border-red-500">
              <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Our Philosophy</span>
              <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>

      </div>

    </section>
  )
}

export default About