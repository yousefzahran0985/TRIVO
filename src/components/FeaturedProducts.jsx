import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaArrowRight } from 'react-icons/fa'; // هنستخدم سهم من المكتبة اللي لسه منزلينها

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  { id: 1, name: 'Cyber Edition Box', price: '$120', img: '/products/product1.jpg' },
  { id: 2, name: 'Neon Glitch Hoodie', price: '$85', img: '/products/product2.jpg' },
  { id: 3, name: 'Vortex Sneakers', price: '$210', img: '/products/product3.jpg' },
  { id: 4, name: 'Matrix Glasses', price: '$55', img: '/products/product4.jpg' },
];

const FeaturedProducts = () => {
  const sectionRef = useRef(null);
  const subtextRef = useRef(null);

  useGSAP(() => {
    // 1. أنميشن الـ Opacity للـ Subtext أثناء السكرول
    gsap.to(subtextRef.current, {
      scrollTrigger: {
        trigger: subtextRef.current,
        start: "top 40%", // يبدأ يختفي لما يوصل لنص الشاشة تقريباً
        end: "bottom 10%", 
        scrub: true, // يخليه مرتبط بحركة السكرول (يروح وييجي مع إيدك)
      },
      opacity: 0,
      y: -20, // حركة خفيفة لفوق وهو بيختفي
    });

    // 2. أنميشن ظهور الكروت
    gsap.from(".product-card", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out"
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="min-h-screen bg-black py-32 px-6 md:px-12 relative overflow-hidden">
      
      {/* الرأس: العنوان + الزرار */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <h2 
            className="text-white text-5xl md:text-7xl font-black tracking-tighter italic uppercase"
            data-speed="0.8"
          >
            Full <span className="text-red-500">Collection</span>
          </h2>
          <p 
            ref={subtextRef}
            className="text-white/40 font-mono tracking-[0.5em] mt-4"
          >
            LATEST DROPS / 2026
          </p>
        </div>

        {/* زرار View All Shop */}
        <button className="group flex items-center gap-3 text-white font-black tracking-widest text-xs border-b border-white/20 pb-2 hover:border-red-500 transition-all duration-500 uppercase">
          Explore All Shop
          <div className="bg-red-600 p-2 rounded-full group-hover:translate-x-2 transition-transform duration-500">
            <FaArrowRight size={12} />
          </div>
        </button>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-2">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="product-card group relative bg-[#0a0a0a] p-6 rounded-sm overflow-hidden border border-white/5 hover:border-red-500/30 transition-all duration-700"
          >
            {/* الصورة مع تأثير Zoom عند الهوفر */}
            <div className="relative h-72 w-full mb-6 overflow-hidden bg-[#111]">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay خفيف */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* بيانات المنتج */}
            <h3 className="text-white text-lg font-normal text-sm mb-2 uppercase tracking-tight group-hover:text-red-500 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-white font-mono text-xl">{product.price}</span>
              <button className="relative overflow-hidden group/btn text-white text-[10px] font-black tracking-tighter border border-white/10 px-4 py-2">
                <span className="relative z-10">ADD TO CART</span>
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* الجلو الخلفي (Back Glow) */}
            <div className="absolute -inset-1 bg-red-600 opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-700 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* لمسة ديكورية في الخلفية */}
      <div className="absolute top-0 right-0 text-[15rem] font-black text-white/[0.02] pointer-events-none select-none translate-x-1/3 -translate-y-1/4">
        TRV
      </div>
    </section>
  )
}

export default FeaturedProducts