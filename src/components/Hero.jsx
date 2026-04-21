import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// سحب كل الصور من فولدر assets/hero (تأكد من المسار)
const moduleFrames = import.meta.glob('../assets/hero/*.jpg', { eager: true });
const imagesArray = Object.keys(moduleFrames).sort().map(key => moduleFrames[key].default);

const Hero = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  
  // أوبجكت وهمي عشان GSAP يغير فيه رقم الفريم
  const airbnb = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // 1. تحميل الصور مسبقاً مع التأكد من رسم أول فريم فوراً
    const images = [];
    let loadedCount = 0;

    imagesArray.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        // أهم سطر: ارسم الفريم الأول فوراً أول ما صورته تجهز
        if (index === 0) {
          renderFrame(0); 
        }
        // لما كل الصور تحمل، اعمل Refresh عشان الحسابات تكون دقيقة
        if (loadedCount === imagesArray.length) {
          ScrollTrigger.refresh();
        }
      };
      images.push(img);
    });

    const renderFrame = (index) => {
  const img = images[Math.round(index)];
  if (img && img.complete) {
    let scale;
    
    // لو الشاشة أصغر من 768px (موبيل)
    if (window.innerWidth < 768) {
      // استخدم Contain عشان الفيديو يظهر كامل وميتقصش
      scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    } else {
      // في الشاشات الكبيرة (md و lg) استخدم Cover عشان يملأ العرض كامل
      scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    }

    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }
};

    // 2. تظبيط حجم الكانفاس
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(airbnb.frame);
    };
    setCanvasSize();

    // 3. الربط بـ GSAP
    const animation = gsap.to(airbnb, {
      frame: imagesArray.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", // هيبدأ من أول الصفحة فوق
        end: "+=700%",    // زودت المسافة شوية عشان الفيديو يكون أهدى
        scrub: 0.5,       // خليته 0.5 عشان الاستجابة تكون أسرع للماوس
        pin: true,
        // markers:true,
        anticipatePin: 1, // بيساعد في منع القفزات المفاجئة عند التثبيت
        onUpdate: () => renderFrame(airbnb.frame),
      }
    });

    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);


  return (
  <section ref={sectionRef} className="bg-black w-full overflow-hidden flex items-center justify-center">
    {/* الكونتينر اللي هيحكم العرض */}
    <div className="w-full lg:w-[86%] max-w-[1700px] mx-auto relative h-screen flex items-center justify-center">
      <div className="absolute -left-7 lg:-left-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px]"></div>
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full" 
        />
      <div className="absolute -right-7 lg:-right-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px]"></div>
    </div>
  </section>
);
};

export default Hero;