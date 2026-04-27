import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP)









const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTextureCurrent;
  uniform sampler2D uTextureNext;
  uniform sampler2D uMapTexture;
  uniform float uProgress;
  uniform float uDirection;
  uniform vec4 uResolution; // (width, height, image_width, image_height)

  void main() {
    vec2 s = uResolution.xy; // أبعاد الشاشة
    vec2 i = uResolution.zw; // أبعاد الصورة (مثلاً 1920x1080)
    
    // معادلة الـ Background Cover
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newUv = vUv;

    if (rs < ri) {
        // الشاشة أرفع من الصورة (حالة الموبايل)
        vec2 v = vec2(s.x * i.y / s.y, i.y);
        // التعديل هنا: شيلنا الـ 0.5 وخلينا الضرب في 1.0 عشان يثبت اليمين
        // أو بنطرح الفرق بالكامل من الـ X عشان نجيب آخر الصورة يمين
        newUv.x = vUv.x * (v.x / i.x) + (1.0 - v.x / i.x);
    } else {
        // الشاشة أعرض من الصورة
        vec2 v = vec2(i.x, s.y * i.x / s.x);
        newUv.y = vUv.y * (v.y / i.y) + 0.5 * (1.0 - v.y / i.y);
    }

    vec4 displacement = texture2D(uMapTexture, newUv);
    float d = displacement.r;

    float df1 = d * 0.4 * uProgress * uDirection;
    vec2 distorted1 = newUv - vec2(df1, 0.0);
    vec4 tex1 = texture2D(uTextureCurrent, distorted1);

    float df2 = (1.0 - d) * 0.4 * (1.0 - uProgress) * uDirection;
    vec2 distorted2 = newUv + vec2(df2, 0.0);
    vec4 tex2 = texture2D(uTextureNext, distorted2);

    gl_FragColor = mix(tex1, tex2, uProgress);
  }
`;

const SLIDES = [
  { 
    img: '/hero4.png', 
    title: 'ENGINEERED', 
    subtitle: 'PERFECTION' 
  },
  { 
    img: '/hero7.png', 
    title: 'BEYOND THE', 
    subtitle: 'LIMITS' 
  },
  { 
    img: '/hero5.png',  
    title: 'DIGITAL', 
    subtitle: 'EVOLUTION' 
  },
];;

const Hero2 = () => {
  const mountRef     = useRef(null);
  const materialRef  = useRef(null);
  const rendererRef  = useRef(null);
  const animFrameRef = useRef(null);
  const texturesRef  = useRef([]);
  const isAnimating  = useRef(false);
  const currentIdx   = useRef(0);
  const gsapProxy    = useRef({ value: 0 });

  const dragStart    = useRef(null);
  const isDragging   = useRef(false);
  const liveProgress = useRef(0);
  // 1. ضيف الـ Ref ده فوق مع الـ Refs التانية
const touchDirection = useRef(null); // 'horizontal', 'vertical', or null



// 3. التعديل الجوهري في الـ onDragMove




  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader   = new THREE.TextureLoader();
    const textures = SLIDES.map(s => loader.load(s.img));
    texturesRef.current = textures;
    const mapTex   = loader.load('/map.jpg');

    const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTextureCurrent: { value: textures[0] },
    uTextureNext:    { value: textures[1] },
    uMapTexture:     { value: mapTex },
    uProgress:       { value: 0 },
    uDirection:      { value: 1.0 },
    // ملحوظة: لو صورك 1080x1920 (طولية) غير الأرقام دي. 
    // لو صورك 1920x1080 (عرضية) سيبها زي ما هي.
    uResolution:     { value: new THREE.Vector4(W, H, 1920, 1080) }, 
  },
});
    materialRef.current = material;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
  const newW = container.clientWidth;
  const newH = container.clientHeight;
  renderer.setSize(newW, newH);
  if (materialRef.current) {
    materialRef.current.uniforms.uResolution.value.x = newW;
    materialRef.current.uniforms.uResolution.value.y = newH;
  }
};

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  const snapTo = useCallback((targetIdx, fromProgress) => {
    const mat = materialRef.current;
    if (!mat) return;
    isAnimating.current = true;
    gsapProxy.current.value = fromProgress;

    gsap.to(gsapProxy.current, {
      value: 1,
      duration: 0.6 * (1 - fromProgress) + 0.2,
      ease: 'power3.out',
      onUpdate: () => {
        mat.uniforms.uProgress.value = gsapProxy.current.value;
      },
      onComplete: () => {
        mat.uniforms.uTextureCurrent.value = texturesRef.current[targetIdx];
        mat.uniforms.uProgress.value       = 0;
        currentIdx.current  = targetIdx;
        liveProgress.current = 0;
        isAnimating.current  = false;
        setActiveIdx(targetIdx);
      },
    });
  }, []);

  const snapBack = useCallback((fromProgress) => {
    const mat = materialRef.current;
    if (!mat) return;
    isAnimating.current = true;
    gsapProxy.current.value = fromProgress;

    gsap.to(gsapProxy.current, {
      value: 0,
      duration: 0.4 * fromProgress + 0.1,
      ease: 'power3.out',
      onUpdate: () => {
        mat.uniforms.uProgress.value = gsapProxy.current.value;
      },
      onComplete: () => {
        liveProgress.current = 0;
        isAnimating.current  = false;
      },
    });
  }, []);

  // const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

  // 2. تعديل الـ onDragStart
const onDragStart = useCallback((e) => {
  if (isAnimating.current) return;
  dragStart.current = {
    x: e.touches ? e.touches[0].clientX : e.clientX,
    y: e.touches ? e.touches[0].clientY : e.clientY
  };
  isDragging.current = true;
  touchDirection.current = null; // ريست للاتجاه مع كل ضغطة جديدة
  gsap.killTweensOf(gsapProxy.current);
}, []);

  const onDragMove = useCallback((e) => {
  if (!isDragging.current || !dragStart.current) return;
  const mat = materialRef.current;
  if (!mat) return;

  const currentX = e.touches ? e.touches[0].clientX : e.clientX;
  const currentY = e.touches ? e.touches[0].clientY : e.clientY;

  const dx = currentX - dragStart.current.x;
  const dy = currentY - dragStart.current.y;

  // تحديد الاتجاه في أول حركة (Threshold)
  if (!touchDirection.current) {
    if (Math.abs(dx) > Math.abs(dy)) {
      touchDirection.current = 'horizontal';
    } else if (Math.abs(dy) > 5) { // لو نزل أكتر من 5 بكسل عمودي
      touchDirection.current = 'vertical';
      isDragging.current = false; // وقف السحب تماماً
      return;
    }
  }

  // لو الاتجاه طلع عمودي، اخرج وما تعملش أي حاجة في الصور
  if (touchDirection.current === 'vertical') return;

  // منع السكرول الطبيعي فقط لو المستخدم بيتحرك أفقي (عشان الـ Slider يشتغل)
  if (touchDirection.current === 'horizontal' && e.cancelable) {
    // e.preventDefault(); // اختيارية حسب رغبتك في منع اهتزاز الصفحة
  }

  const W = mountRef.current.clientWidth;
  const rawProg = Math.abs(dx) / (W * 0.6);
  const progress = Math.min(rawProg, 1);
  
  const dir = dx > 0 ? 1.0 : -1.0;
  const total = SLIDES.length;
  const cur = currentIdx.current;
  const nextIdx = (cur + (dir > 0 ? 1 : -1) + total) % total;

  mat.uniforms.uDirection.value = dir;
  mat.uniforms.uTextureNext.value = texturesRef.current[nextIdx];
  mat.uniforms.uProgress.value = progress;
  liveProgress.current = progress;

  setActiveIdx(progress > 0.5 ? nextIdx : cur);
}, []);

  // 4. تعديل الـ onDragEnd ليتناسب مع الإحداثيات الجديدة
const onDragEnd = useCallback((e) => {
  if (!isDragging.current || !dragStart.current) {
    isDragging.current = false;
    return;
  }
  isDragging.current = false;

  const mat = materialRef.current;
  if (!mat) return;

  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const dx = endX - dragStart.current.x;
  
  // الباقي كما هو...
  const dir = dx > 0 ? 1 : -1;
  const cur = currentIdx.current;
  const total = SLIDES.length;
  const prog = liveProgress.current;
  const targetIdx = (cur + (dir > 0 ? 1 : -1) + total) % total;

  if (prog > 0.25) {
    snapTo(targetIdx, prog);
  } else {
    snapBack(prog);
    setActiveIdx(cur);
  }
  dragStart.current = null;
}, [snapTo, snapBack]);




  // تسجيل الـ Plugin (ضروري جداً)
gsap.registerPlugin(ScrollTrigger);

// داخل الـ Component
const textContainerRef = useRef(null);

useGSAP(() => {
  // هنعمل Timeline مربوط بالسكرول
  // let tl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: textContainerRef.current,
  //     start: "top 60%",    
  //     end: "bottom top",  
  //     scrub: 1,          
  //     // markers: true,   
  //   }
  // });

  // tl.to(textContainerRef.current, {
  //   y: -150,               
  //   opacity: 0,            
  //   scale: 0.9,            
  //   ease: "none"           
  // });
  const tl = gsap.timeline()
  tl.from(".heroTitle", {
    y: 100,
    opacity: 0,
    duration: 0.7,
    ease: "power4.out",
    imageOrientation:false
  })
  .fromTo(".heroP", {
    y:50,
    opacity:0
  },{
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",

  }, "-=0.5")
  
  .fromTo(".heroB", 
    { y: 20, opacity: 0 }, 
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      ease: "power4.out", 
    }, "-=0.5");

  

}, { scope: textContainerRef ,dependencies :[activeIdx] ,revertOnUpdate: true});

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden cursor-grab select-none"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
    >
      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute inset-0 z-2 pointer-events-none bg-linear-to-t from-black/70 via-transparent to-black/20 " />

      <div className="absolute top-8 right-10 z-10 text-white/50 text-[0.75rem] tracking-[0.3em] font-mono pointer-events-none">
        {String(activeIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      <div 
        ref={textContainerRef} 
        className="absolute md:top-[50%] bottom-0 md:left-12 md:-translate-y-1/2 z-10 max-md:w-full p-5 pb-17"
        // منع السحب عند الضغط بالماوس
        onMouseDown={(e) => e.stopPropagation()}
        // منع السحب عند اللمس على الموبايل
        onTouchStart={(e) => e.stopPropagation()}
      >
  <p className="text-white/50 text-[0.7rem] tracking-[0.4em] font-mono mb-2 overflow-hidden">
    <span className="inline-block translate-y-full italic-text">DISRUPTIVE DESIGN STUDIO </span>
  </p>
  
  <h1 
    key={activeIdx} 
    className="heroTitle text-white m-0 font-black leading-[0.9] mb-6 tracking-wide text-2xl"
    style={{ 
      fontSize: 'clamp(5rem, 8vw, 7rem)', 
      fontFamily: "'Bebas Neue', sans-serif" 
    }}
  >
    {SLIDES[activeIdx].title}
    <br />
    <span className="text-red-500">
      {SLIDES[activeIdx].subtitle}
    </span>
  </h1>

  <p className="heroP text-white/70 text-sm md:text-lg mb-8 font-light leading-relaxed max-w-md">
    We create digital experiences that transcend the ordinary, 
    merging art with high-performance technology.
  </p>

  <div className="heroB flex gap-4">
    {/* الزراير طبيعي بتعمل stop propagation في المتصفحات الحديثة، لكن زيادة تأكيد */}
    <button className="md:px-8 md:py-3 p-2 bg-white text-sm text-black font-bold uppercase tracking-wider hover:bg-orange-500 ">
      Explore Work
    </button>
    <button className="md:px-8 md:py-3 p-2 border text-sm border-white/30 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
      Contact Us
    </button>
  </div>
</div>
      {/* Pagination Dots */}
<div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 flex gap-3 items-center">
  {SLIDES.map((_, i) => (
    <button
      key={i}
      // جعل النقطة قابلة للضغط للتنقل السريع
      onClick={() => {
        if (i !== activeIdx && !isAnimating.current) {
          const dir = i > activeIdx ? 1 : -1;
          materialRef.current.uniforms.uDirection.value = dir;
          materialRef.current.uniforms.uTextureNext.value = texturesRef.current[i];
          snapTo(i, 0);
        }
      }}
      className="group relative py-4 focus:outline-none cursor-pointer pointer-events-auto"
    >
      {/* الخط الخارجي الباهت */}
      <div 
        className={`h-[2px] transition-all duration-700 ease-out rounded-full ${
          i === activeIdx ? 'w-10 bg-red-600' : 'w-4 bg-white/20 group-hover:bg-white/50'
        }`} 
      />
      
      {/* رقم صغير يظهر فوق النقطة النشطة (اختياري) */}
      {i === activeIdx && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-500 animate-pulse">
          0{i + 1}
        </span>
      )}
    </button>
  ))}
</div>
      {/* Global Styles for Fonts and Custom Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(25px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Hero2;