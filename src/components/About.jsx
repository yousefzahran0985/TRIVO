import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null); // ريف خاص بالصورة

  useGSAP(() => {
    // 1. أنميشن النصوص (كما هو مع تحسين بسيط)
    gsap.from(".about-text", {
      scrollTrigger: {
        trigger: textRef.current,
        start: "center 85%",
        end: "top 50%",
        scrub: 1,
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    // 2. السحر هنا: تحويل الصورة من أبيض وأسود لألوان مع السكرول
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 40%", // يبدأ التلوين لما السكشن يقرب من نص الشاشة
        end: "center center", // ينتهي التلوين لما السكشن يتوسط الشاشة
        scrub: true,
      },
      filter: "grayscale(0%) brightness(100%)", // يرجع الألوان طبيعية
      scale: 1.1, // زووم خفيف مع الحركة
      ease: "none"
    });

    // 3. تحريك المربع الأحمر خلف الصورة (Parallax)
    gsap.to(".bg-square", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: 100,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen bg-black text-white py-32 px-6 relative overflow-hidden">
      
      {/* نص خلفي عملاق */}
      <div className="absolute top-20 left-0 text-[15rem] font-black text-white/[0.03] whitespace-nowrap pointer-events-none select-none uppercase italic">
        Disruptive
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* الجانب الأيسر: الصورة مع تأثير السكرول */}
        <div className="relative">
          <div className="w-full h-[500px] md:h-[650px] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
            <img 
              ref={imageRef}
              src="/hero4.png" 
              alt="About Us"
              className="w-full h-full object-cover transition-all"
              // القيمة الابتدائية تكون أبيض وأسود ومعتمة قليلاً
              style={{ filter: "grayscale(100%) brightness(70%)" }}
            />
          </div>
          
          {/* المربع الأحمر الجمالي */}
          <div
            className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-600 z-[-1]"
            data-speed="1.2"
          />

        </div>

        {/* الجانب الأيمن: المحتوى */}
        <div ref={textRef} className="space-y-8">
          <div className="about-text flex items-center gap-4">
            <div className="w-12 h-[1px] bg-red-600" />
            <h2 className="text-red-600 font-mono tracking-[0.4em] text-sm uppercase">
              Who we are
            </h2>
          </div>
          
          <h3 className="about-text text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
            We blur the line <br /> 
            between <span className="italic text-red-600">Art</span> & <br />
            Technology.
          </h3>

          <p className="about-text text-white/50 text-lg max-w-lg leading-relaxed font-light">
            Founded in 2026, TRIVO focuses on creating digital experiences 
            that challenge the status quo. We don't just build products; 
            we build high-performance visual ecosystems for those who dare to lead.
          </p>

          <div className="about-text pt-6">
            <button className="group relative px-10 py-4 overflow-hidden border border-white/10 transition-all">
              <span className="relative z-10 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors duration-500">
                Our Philosophy
              </span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About;