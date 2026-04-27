import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// تسجيل الـ Plugin
gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const headerRef = useRef(null);

  useGSAP(() => {
    const showAnim = gsap.from(headerRef.current, { 
      yPercent: -120, // بيطلعه بره الشاشة تماماً
      paused: true,
      duration: 0.4,
      ease: "power2.out"
    }).progress(1); // بيبدأ وهو ظاهر عادي في الأول

    ScrollTrigger.create({
      start: "top top",
      end: "max", // لنهاية الصفحة
      onUpdate: (self) => {
        // self.direction === -1 يعني بيسكرل لفوق (ظهر الهيدر)
        // self.direction === 1 يعني بيسكرل لتحت (اخفي الهيدر)
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      }
    });
  }, { scope: headerRef });

  return (
    <header 
      ref={headerRef} 
      // التعديلات هنا: top-4 (مسافة من السقف) و mx-8 (مسافة من الجوانب) و rounded-full (بوردر ريديوس)
      className="fixed top-4 left-0 right-0 mx-auto w-[92%] z-[100] px-10 py-4 flex justify-between items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-black/50"
    >
      {/* اللوجو */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <img 
          src="/logo2.jpg" 
          alt="TRIVO" 
          className="h-6 w-auto transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* الروابط */}
      <nav className="hidden md:flex items-center gap-10">
        {['Collection', 'About', 'Archive', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-red-500 transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* الأزرار */}
      <div className="flex items-center gap-6">
        <button className="text-white/60 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        
        <button className="bg-red-600 hover:bg-white hover:text-black transition-all duration-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
          Cart (0)
        </button>
      </div>
    </header>
  );
};

export default Header;