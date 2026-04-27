import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Contact = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // أنميشن ظهور العناوين والفورم
    gsap.from(".contact-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen bg-black text-white py-32 px-12 relative overflow-hidden">
      
      {/* عنوان جانبي ضخم للزينة */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 text-[10rem] font-black text-white/5 pointer-events-none select-none uppercase">
        Get In Touch
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        
        {/* الجانب الأيسر: معلومات التواصل */}
        <div className="space-y-12">
          <div className="contact-item">
            <h2 className="text-6xl font-black tracking-tighter mb-6 uppercase">
              Let's build <br /> <span className="text-red-600">Something</span> <br /> disruptive.
            </h2>
            <p className="text-white/50 text-lg max-w-sm">
              Have a project in mind? Or just want to say hi? Drop us a line and let's create the future together.
            </p>
          </div>

          <div className="contact-item space-y-6">
            <div>
              <h4 className="text-red-500 font-mono text-xs uppercase tracking-[0.3em] mb-2">// Email us</h4>
              <p className="text-2xl font-bold">hello@disruptive.com</p>
            </div>
            <div>
              <h4 className="text-red-500 font-mono text-xs uppercase tracking-[0.3em] mb-2">// Call us</h4>
              <p className="text-2xl font-bold">+20 123 456 7890</p>
            </div>
            <div>
              <h4 className="text-red-500 font-mono text-xs uppercase tracking-[0.3em] mb-2">// Visit us</h4>
              <p className="text-2xl font-bold">123 Design St, Maadi <br /> Cairo, Egypt</p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن: فورم التواصل */}
        <div className="contact-item bg-[#0a0a0a] p-10 border border-white/5 rounded-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="YOUSEF ZAHRAN" 
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-red-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="YOUR@EMAIL.COM" 
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-red-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
              <textarea 
                rows="5" 
                placeholder="WHAT'S ON YOUR MIND?" 
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-red-500 outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button className="w-full bg-red-600 text-white font-black py-4 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* Social Links Footer */}
      <div className="contact-item mt-32 flex flex-wrap gap-8 border-t border-white/10 pt-10">
        {['Instagram', 'LinkedIn', 'Twitter', 'Behance'].map((social) => (
          <a key={social} href="#" className="text-xs font-mono uppercase tracking-widest hover:text-red-500 transition-colors">
            {social}
          </a>
        ))}
      </div>

    </section>
  )
}

export default Contact