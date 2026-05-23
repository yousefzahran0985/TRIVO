import React, { useRef, useState } from 'react';
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
  const lastWidth = useRef(0);

  // حالة للتأكد من تحميل جميع الصور لمنع التعليق أول مرة
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // اختياري: لمتابعة النسبة المئوية

  const renderFrame = (index, canvas, context) => {
    const img = imagesRef.current[Math.round(index)];
    if (img && img.complete) {
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  };

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // تأمين لو الكانفاس لسه مظهرش بسبب الـ Loading
    const context = canvas.getContext('2d');

    // تظبيط حجم الكانفاس
    const setCanvasSize = () => {
      if (window.innerWidth === lastWidth.current && window.innerWidth < 768) return; 
      lastWidth.current = window.innerWidth;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(airbnb.current.frame, canvas, context);
    };

    // لن نبدأ الأنيميشن إلا إذا اكتمل تحميل الصور بالكامل
    if (isLoaded) {
      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);
      ScrollTrigger.normalizeScroll(true);

      gsap.to(airbnb.current, {
        frame: imagesArray.length - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => renderFrame(airbnb.current.frame, canvas, context),
        }
      });
    }

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      ScrollTrigger.normalizeScroll(false);
    };
    
  }, { scope: sectionRef, dependencies: [isLoaded] }); // الـ useGSAP هتشتغل تاني أول ما الـ isLoaded تبقى true

  // كود جافاسكريبت خارجي لتحميل الصور مسبقاً (Preloading)
  React.useEffect(() => {
    let loadedCount = 0;

    imagesArray.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        // تحديث نسبة التحميل (لو عايز تعرضها)
        setLoadingProgress(Math.round((loadedCount / imagesArray.length) * 100));

        // حفظ الصورة في الـ Ref
        imagesRef.current[index] = img;

        // لو كل الصور في الـ Array اتعلم لها Load بنجاح
        if (loadedCount === imagesArray.length) {
          setIsLoaded(true);
          // عمل ريفريش للـ ScrollTrigger عشان يحسب أبعاد الصفحة صح بعد ظهور الكانفاس
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      };
    });
  }, []);

  return (
    <>
      <section ref={sectionRef} className="bg-black w-full overflow-hidden flex items-center justify-center select-none relative" style={{ touchAction: 'pan-y' }}>
        
        {/* شاشة تحميل احترافية تظهر فقط أول مرة لحد ما الصور تجهز */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4">
            <div className="text-red-600 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
              Loading Experience...
            </div>
            {/* بار تحميل رقمي شيك يوريك النسبة */}
            <div className="text-white/40 font-mono text-[10px]">
              {loadingProgress}%
            </div>
          </div>
        )}

        {/* الكانفاس مش هيشتغل غير والصور جاهزة في الـ Memory */}
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