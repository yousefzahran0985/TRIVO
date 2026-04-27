import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import Hero2 from "./components/Hero2";
import FeaturedProducts from "./components/FeaturedProducts";
import About from "./components/About";
import Offer from "./components/Offer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";

// تسجيل الملحقات
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function App() {
  const mainRef = useRef(null);
  const wrapperRef = useRef(null);

  useGSAP(() => {
    // تشغيل الـ ScrollSmoother
    ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: mainRef.current,
      smooth: 1.5,
      effects: true, // عشان تقدر تستخدم data-speed
    });
  }, []);

  return (
    <div className="bg-black" ref={wrapperRef} id="smooth-wrapper">
      <div ref={mainRef} id="smooth-content">
        <Header />
        <Hero2 />
        {/* السكشن الجديد */}
        <FeaturedProducts />
        <About />
        <Offer />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
