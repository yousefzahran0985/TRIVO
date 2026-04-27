import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PRODUCTS = [
  { id: 1, name: 'Cyber Edition Box', price: '$120', img: '/products/product1.jpg' },
  { id: 2, name: 'Neon Glitch Hoodie', price: '$85', img: '/products/product2.jpg' },
  { id: 3, name: 'Vortex Sneakers', price: '$210', img: '/products/product3.jpg' },
  { id: 4, name: 'Matrix Glasses', price: '$55', img: '/products/product4.jpg' },
];

const FeaturedProducts = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // أنميشن ظهور الكروت لما نوصل لها
    gsap.from(".product-card", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%", // يبدأ لما قمة السكشن تلمس 70% من الشاشة
      },
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2, // يخلي المنتجات تظهر واحد ورا التاني
      ease: "power4.out"
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="min-h-screen bg-black py-32 px-12 relative">
      {/* عنوان السكشن مع تأثير Parallax من الـ Smoother */}
      <div className="mb-20">
        <h2 
          className="text-white text-7xl font-black tracking-tighter italic uppercase"
          data-speed="0.8" // هيتحرك أبطأ سنة من السكرول فيعمل شكل جمالي
        >
          Featured <span className="text-red-500">Products</span>
        </h2>
        <p className="text-white/40 font-mono tracking-[0.5em] mt-4">LATEST DROPS / 2026</p>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="product-card group relative bg-[#111] p-6 rounded-lg overflow-hidden border border-white/5 hover:border-red-500/50 transition-colors duration-500"
          >
            {/* الصورة */}
            <div className="relative h-64 w-full mb-6 overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-100 h-full transition-transform duration-700"
              />
            </div>

            {/* بيانات المنتج */}
            <h3 className="text-white text-xl font-bold mb-2 uppercase tracking-tight">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-red-500 font-black text-lg">{product.price}</span>
              <button className="text-white text-xs font-mono border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all">
                ADD TO CART
              </button>
            </div>

            {/* تأثير ضوئي خلفي يظهر عند الـ Hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts