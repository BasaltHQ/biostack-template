"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CrmContactForm from "@/components/CrmContactForm";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };



  useEffect(() => {
    // Implementing benefit cards fade-in animation
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    if (benefitCards.length > 0) {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const benefitCardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = index * 200;
            setTimeout(() => {
              entry.target.classList.remove('opacity-0');
              entry.target.classList.add('opacity-100');
              entry.target.style.transform = 'translateY(0)';
              entry.target.style.transition = 'all 0.6s ease-out';
            }, delay);
            benefitCardObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      benefitCards.forEach((card, index) => {
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('opacity-0');
        benefitCardObserver.observe(card);
      });
    }
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0 w-full h-full z-0">
          <video autoPlay muted loop playsInline className="object-cover w-full h-full">
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight text-white drop-shadow-md">
            Discover premium solutions for a <span className="text-sage-300">healthier, happier you</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-slate-100 font-medium opacity-90">
            Your pathway to wellness begins here. Personalized coaching with your designated health & wellness coach.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="bg-sage-600 text-white border-2 border-sage-600 px-8 py-4 rounded hover:bg-sage-700 hover:border-sage-700 transition-all duration-300 shadow-xl text-lg font-bold tracking-wide uppercase">
              GET STARTED
            </Link>
            <Link href="#services" className="bg-transparent text-white border-2 border-white px-8 py-4 rounded hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl text-lg font-bold tracking-wide uppercase">
              Our Services
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-white font-bold text-sm tracking-widest uppercase">GMP Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <span className="text-white font-bold text-sm tracking-widest uppercase">FDA Registered</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span className="text-white font-bold text-sm tracking-widest uppercase">Lab Tested</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / SERVICES SECTION */}
      <section id="services" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sage-50 -skew-x-12 opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 benefit-card">
              <div className="inline-block px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
                Start Your Journey
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
                Unlock Your Best Self with <span className="text-sage-600">Limitless Coaching</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                At BioStack Limitless, we are your guide to living stronger, longer, and healthier. Whether your goal is anti-aging, weight management, or peak performance, our personalized approach will help you look, feel, and live limitless.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-slate-900">Metabolic & Weight Loss</h3>
                    <p className="mt-2 text-slate-600">Scientifically backed strategies to optimize your metabolism and achieve sustainable weight goals.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-slate-900">Anti-Aging & Regenerative</h3>
                    <p className="mt-2 text-slate-600">Advanced protocols to slow cellular aging, boost NAD+ levels, and enhance longevity.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-slate-900">Energy & Performance</h3>
                    <p className="mt-2 text-slate-600">Hack your biology for limitless energy, sharper focus, and peak physical performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 benefit-card">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/hero-bg.png" alt="BioStack Limitless Background" width={800} height={600} className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-bold drop-shadow-md">Our commitment to excellence</h3>
                  <p className="text-white font-bold text-xl mt-2 tracking-wide drop-shadow-sm">Built upon years of expertise</p>
                </div>
              </div>

              <div className="hidden lg:flex absolute -bottom-10 right-4 bg-white p-6 rounded-xl shadow-xl border border-slate-100 items-center gap-4 max-w-xs z-20">
                <div className="h-12 w-12 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold text-xl">
                  10+
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-lg">Years Experience</div>
                  <div className="text-slate-500 text-sm">Transforming Lives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="reviews" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight">Real Results, Real Stories</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sage-500 transition-colors shadow-2xl relative">
              <div className="absolute -top-6 left-8 bg-sage-600 h-12 w-12 flex items-center justify-center rounded-lg shadow-lg text-2xl font-serif">&quot;</div>
              <p className="text-gray-300 mb-6 mt-4 leading-relaxed italic">&quot;Biostack Limitless services have been life-changing. From boosting my immunity to clearing up my skin, their coaching delivered real results. Highly recommend!&quot;</p>
              <div className="border-t border-slate-700 pt-6 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center font-bold text-slate-900">AR</div>
                <div className="ml-3 text-left">
                  <h4 className="font-bold text-white">Amanda Reed</h4>
                  <p className="text-sage-400 text-sm">Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sage-500 transition-colors shadow-2xl relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-8 bg-sage-600 h-12 w-12 flex items-center justify-center rounded-lg shadow-lg text-2xl font-serif">&quot;</div>
              <p className="text-gray-300 mb-6 mt-4 leading-relaxed italic">&quot;Biostack Limitless products have truly transformed my life. Whether it&apos;s enhancing my immunity or rejuvenating my skin, their range consistently delivers tangible results.&quot;</p>
              <div className="border-t border-slate-700 pt-6 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center font-bold text-slate-900">BK</div>
                <div className="ml-3 text-left">
                  <h4 className="font-bold text-white">Bryan Knight</h4>
                  <p className="text-sage-400 text-sm">CEO</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sage-500 transition-colors shadow-2xl relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-8 bg-sage-600 h-12 w-12 flex items-center justify-center rounded-lg shadow-lg text-2xl font-serif">&quot;</div>
              <p className="text-gray-300 mb-6 mt-4 leading-relaxed italic">&quot;Absolutely thrilled with my experience! From bolstering my immune system to achieving clearer, healthier skin, their products have made a significant impact on my well-being.&quot;</p>
              <div className="border-t border-slate-700 pt-6 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center font-bold text-slate-900">JN</div>
                <div className="ml-3 text-left">
                  <h4 className="font-bold text-white">Judy Nguyen</h4>
                  <p className="text-sage-400 text-sm">Team Leader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:items-center items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">Frequently Asked Questions</h2>
              <p className="text-slate-600 text-lg mb-10">Everything you need to know about our coaching methodology and premium supplements.</p>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-sage-50 aspect-square md:aspect-[4/3]">
                <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070" unoptimized alt="Medical Research" width={600} height={450} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <div className="font-bold text-2xl">Expert Support</div>
                    <div className="text-sage-200">24/7 Access to your coach</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How does the coaching program work?",
                  a: "Our coaching starts with a comprehensive biological assessment. We then build a custom protocol including nutrition, supplementation (BioStack products), and training. You'll satisfy weekly check-ins with your dedicated coach to adjust the plan as you progress.",
                },
                {
                  q: "Are BioStack supplements safe?",
                  a: "Absolutely. All our products are manufactured in FDA-registered, GMP-certified facilities in the USA. We use pharmaceutical-grade ingredients and conduct rigorous third-party lab testing for purity and potency.",
                },
                {
                  q: "How long until I see results?",
                  a: "Most clients feel a shift in energy and mental clarity within the first 7-10 days. Physical changes (weight loss, muscle definition) typically become noticeable around weeks 3-4, with profound transformation occurring over 90 days.",
                },
                {
                  q: "Can I use FSA/HSA?",
                  a: "In many cases, yes. Our medical coaching programs can often be covered by HSA/FSA funds if deemed medically necessary. We can provide a Letter of Medical Necessity (LMN) upon request.",
                }
              ].map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden hover:border-sage-300 transition-colors">
                  <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-sage-50 transition-colors text-left focus:outline-none">
                    <span className="font-bold text-lg text-slate-900">{faq.q}</span>
                    <span className={`text-sage-600 text-2xl font-light transform transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-sage-50 ${openFaq === index ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="p-6 pt-0 text-slate-600">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 bg-sage-50 rounded-2xl p-8 border border-sage-100 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
                <p className="text-slate-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                <Link href="#contact" className="inline-block px-6 py-3 bg-sage-600 text-white font-bold rounded-lg hover:bg-sage-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CrmContactForm />
    </main>
  );
}
