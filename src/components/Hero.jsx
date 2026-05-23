import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const moduleFrames = import.meta.glob('../assets/hero/*.jpg', { eager: true });
const imagesArray = Object.keys(moduleFrames).sort().map(key => moduleFrames[key].default);

const Hero = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const airbnb = useRef({ frame: 0 });
  const imagesRef = useRef([]);
  
  // حفظ الأبعاد القديمة لمنع الـ Resize الوهمي في الموبايل
  const lastWidth = useRef(0);

  // وظيفة الرسم المطورة لتكون دايماً "Cover" وبدون لاج
  const renderFrame = (index, canvas, context) => {
    const img = imagesRef.current[Math.round(index)];
    if (img && img.complete) {
      // تعديل: نستخدم Math.max دايماً للموبايل والديسكوب لضمان تجربة الـ Cover المقصوصة الشيك اللي تحبها
      // لو حاببها تصغر بالكامل سيب الـ min، لكن الـ max بيمنع الرعشة الناتجة عن تغيير النسب
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);

      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  };

  useGSAP(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // 1. تحميل الصور
    imagesArray.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (index === 0) renderFrame(0, canvas, context);
        if (imagesRef.current.length === imagesArray.length) {
          ScrollTrigger.refresh();
        }
      };
      imagesRef.current[index] = img;
    });

    // 2. تظبيط حجم الكانفاس الذكي (الحل السحري للرعشة)
    const setCanvasSize = () => {
      // لو العرض ماتغيرش (يعني اللي اتغير هو الارتفاع بسبب شريط الموبايل)، متعملش Resize للكانفاس
      if (window.innerWidth === lastWidth.current && window.innerWidth < 768) {
        return; 
      }
      
      lastWidth.current = window.innerWidth;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(airbnb.current.frame, canvas, context);
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 3. الأنيميشن الأساسي مع تظبيط الـ Scrub والـ Normalize للـ Touch
    // تحسين تجربة التاتش في الموبايل
    ScrollTrigger.normalizeScroll(true); 

    gsap.to(airbnb.current, {
      frame: imagesArray.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.5, // النص ثانية ده بيخلي الحركة ناعمة ومفيهاش تقطيع
        pin: true,
        anticipatePin: 1, // بيخلي الـ Pin يبدأ بسلاسة قبل ما السكرول يوصل بالظبط للـ Trigger
        invalidateOnRefresh: true, // بيعيد حساب الأبعاد لو حصل ريفريش حقيقي
        onUpdate: () => {
          // منع تشغيل الـ Render لو الإطار هو هو
          renderFrame(airbnb.current.frame, canvas, context);
        },
      }
    });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      // تنظيف الـ normalizeScroll عند الخروج
      ScrollTrigger.normalizeScroll(false);
    };
    
  }, { scope: sectionRef });

  return (
    <>
      {/* تم إضافة touch-action: pan-y هنا لمنع المتصفح من إحباط سكرول التاتش */}
      <section ref={sectionRef} className="bg-black w-full overflow-hidden flex items-center justify-center select-none" style={{ touchAction: 'pan-y' }}>
        <div className="w-full lg:w-[86%] max-w-425 mx-auto relative h-screen flex items-center justify-center">
          <div className="absolute -left-7 lg:-left-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px] pointer-events-none"></div>
          <canvas ref={canvasRef} className="block w-full h-full" />
          <div className="absolute -right-7 lg:-right-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px] pointer-events-none"></div>
        </div>
      </section>
    </>
  );
};

export default Hero;