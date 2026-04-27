import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'; // أيقونات منيو شيك

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const headerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); // حالة القائمة في الموبايل

  // جوه Header.jsx
useGSAP(() => {
  const showAnim = gsap.from(headerRef.current, { 
    yPercent: -150,
    paused: true,
    duration: 0.3, // سرعة أكبر عشان الاستجابة
    ease: "none" // "none" أفضل في السكرول لسرعة الاستجابة
  }).progress(1);

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
      if (!isOpen) {
        // إضافة check بسيط للتأكد إن الحركة مش محبوسة
        if (self.direction === -1) showAnim.play();
        else showAnim.reverse();
      }
    }
  });
}, { scope: headerRef, dependencies: [isOpen] });

  const navLinks = ['Collection', 'About', 'Archive', 'Contact'];

  return (
    <>
      <header 
        ref={headerRef} 
        className="fixed top-4 left-0 right-0 mx-auto w-[92%] z-[100] px-6 md:px-10 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
      >
        {/* اللوجو */}
        <div className="flex items-center gap-2 group cursor-pointer relative z-[101]">
          <img 
            src="/logo2.jpg" 
            alt="TRIVO" 
            className="h-5 md:h-6 w-auto transition-transform duration-500 group-hover:scale-110" 
          />
        </div>

        {/* الروابط للشاشات الكبيرة */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-red-500 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* الأزرار + أيقونة الموبايل */}
        <div className="flex items-center gap-4 md:gap-6 relative z-[101]">
          <button className="bg-red-600 hover:bg-white hover:text-black transition-all duration-500 px-5 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">
            Cart (0)
          </button>

          {/* أيقونة المنيو (تظهر في الموبايل فقط) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
          >
            {isOpen ? <HiX size={26} /> : <HiOutlineMenuAlt3 size={26} />}
          </button>
        </div>

        {/* الـ Overlay المنيو للموبايل */}
        <div className={`
          absolute top-0 left-0 w-full h-[100vh] bg-black/95 backdrop-blur-xl 
          rounded-[2rem] flex flex-col items-center justify-center gap-8
          transition-all duration-500 ease-in-out border border-white/10
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          md:hidden
        `}>
          {navLinks.map((item, i) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={`
                text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-red-500 
                transition-all transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {item}
            </a>
          ))}
          
          {/* لمسة إضافية: معلومات تحت في المنيو */}
          <div className="absolute bottom-12 text-white/20 font-mono text-[10px] tracking-widest">
            TRIVO © 2026 / CUSTOM APPAREL
          </div>
        </div>
      </header>

      {/* خلفية غامقة لما المنيو تفتح */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[99] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Header;