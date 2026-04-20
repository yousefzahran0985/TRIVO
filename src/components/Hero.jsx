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
    // 1. حساب الـ Scale بحيث الصورة تظهر بالكامل (Contain)
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    
    // 2. توسيط الصورة في نص الشاشة بالظبط
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // 3. رسم الصورة بالمقاس الجديد
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
        end: "+=800%",    // زودت المسافة شوية عشان الفيديو يكون أهدى
        scrub: 0.5,       // خليته 0.5 عشان الاستجابة تكون أسرع للماوس
        pin: true,
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
    <section ref={sectionRef} className="bg-black">
      <canvas ref={canvasRef} className="max-w-full h-screen block" />
    </section>
  );
};

export default Hero;