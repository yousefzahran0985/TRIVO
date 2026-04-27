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
  const airbnb = useRef({ frame: 0 }); // استخدمنا useRef هنا عشان GSAP يغير فيه من غير Re-render
  const imagesRef = useRef([]);

  // وظيفة الرسم (موجودة بره الـ useGSAP عشان نستخدمها في الـ resize برضه)
  const renderFrame = (index, canvas, context) => {
    const img = imagesRef.current[Math.round(index)];
    if (img && img.complete) {
      let scale;
      if (window.innerWidth < 768) {
        scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      } else {
        scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      }

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

    // 2. تظبيط حجم الكانفاس
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(airbnb.current.frame, canvas, context);
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 3. الأنيميشن الأساسي
    gsap.to(airbnb.current, {
      frame: imagesArray.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: () => renderFrame(airbnb.current.frame, canvas, context),
      }
    });

    // الـ useGSAP بتعمل cleanup للـ GSAP لوحدها، بس الـ EventListener لسه محتاجنا
    return () => window.removeEventListener('resize', setCanvasSize);
    
  }, { scope: sectionRef }); // الـ scope بيحدد إن الشغل كله جوه السكشن ده

  return (
    <>
      <section ref={sectionRef} className="bg-black w-full overflow-hidden flex items-center justify-center">
        <div className="w-full lg:w-[86%] max-w-425 mx-auto relative h-screen flex items-center justify-center">
          <div className="absolute -left-7 lg:-left-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px]"></div>
          <canvas ref={canvasRef} className="block w-full h-full" />
          <div className="absolute -right-7 lg:-right-14 top-0 w-10 lg:w-20 h-full z-20 md:bg-black from-black to-transparent blur-[30px]"></div>
        </div>
      </section>

      <section className="relative z-30 h-275 bg-white -mt-[50vh] flex items-center justify-center rounded-t-[70%_30px] md:rounded-t-[70%_100px] shadow-[0_-30px_50px_rgba(0,0,0,0.3)]">
        <h1 className="md:text-[130px] text-5xl font-bold text-center">
          New Section
        </h1>
      </section>
    </>
  );
};

export default Hero;