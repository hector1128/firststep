"use client";

import React, { useState, useEffect } from "react";

export default function FirstStepOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    frequency: "",
    firstName: "",
    email: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle smooth transitions between steps
  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleRoleSelection = (role: string) => {
    setFormData({ ...formData, role });
    nextStep();
  };

  const handleFrequencySelection = (frequency: string) => {
    setFormData({ ...formData, frequency });
    nextStep();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    // Insert your actual submission logic here (e.g., API call to your backend)
  };

  return (
    // UCF Gold Background with overflow hidden for floating elements
    <div className="min-h-screen bg-[#FFC904] relative overflow-hidden flex items-center justify-center p-4 selection:bg-black selection:text-[#FFC904]">
      
      {/* --- Floating Decorative Elements (The "Lesa" Vibe) --- */}
    
   {/* --- Floating Decorative Elements (The "Lesa" Vibe) --- */}
    
    {/* 1. Top Left - CIRCLE */}
    <div className="absolute top-10 left-10 lg:left-32 w-16 h-16 bg-white border-4 border-black rounded-full shadow-[6px_6px_0px_0px_#000000] animate-bounce" style={{ animationDuration: '4s' }} />

    {/* 2. Top Right - SQUARE (Slightly tilted) */}
    <div className="absolute top-24 right-12 lg:right-40 w-12 h-12 bg-white border-4 border-black rounded-xl rotate-12 shadow-[4px_4px_0px_0px_#000000] animate-pulse" />

    {/* 3. Bottom Left - PILL (Elongated and tilted) */}
    <div className="absolute bottom-20 left-16 lg:left-48 w-24 h-10 bg-white border-4 border-black rounded-full -rotate-12 shadow-[8px_8px_0px_0px_#000000] animate-bounce" style={{ animationDuration: '5s' }} />

    {/* 4. Bottom Right - DIAMOND (Rotated square) */}
    <div className="absolute bottom-32 right-12 lg:right-32 w-12 h-12 bg-white border-4 border-black rounded-lg rotate-45 shadow-[4px_4px_0px_0px_#000000]" />

    {/* --- Characters --- */}

    {/* NEW: Character 5 - Peeping from behind the main form */}
    {/* We place it centrally with a lower z-index so the form hides its bottom half! */}
    

    <img 
        src="/character-1.png" 
        alt="Floating character" 
        className="hidden md:block absolute top-40 left-4 lg:left-42 w-48 h-48 lg:w-64 lg:h-64 object-contain animate-bounce drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-0" 
        style={{ animationDuration: '3s' }} 
      />

      <img 
        src="/character-2.webp" 
        alt="Floating character" 
        className="hidden md:block absolute bottom-20 left-4 lg:left-64 w-40 h-40 lg:w-56 lg:h-56 object-contain -rotate-6 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-0" 
      />

      <img 
        src="/character-3.png" 
        alt="Floating character" 
        className="hidden md:block absolute top-48 right-4 lg:right-24 w-48 h-48 lg:w-64 lg:h-64 object-contain -rotate-12 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-0" 
      />

      {/* Character 4 - Placed near the bottom right/center */}
      <img 
        src="/character-4.webp" 
        alt="Floating character" 
        className="hidden md:block absolute bottom-10 right-[20%] w-40 h-40 lg:w-56 lg:h-56 object-contain rotate-6 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-0"
      />

    <img 
      src="/character-5.png" 
      alt="Peeping character" 
      className="absolute top-29 md:top-30 left-1/2 -translate-x-1/2 w-32 h-32 lg:w-48 lg:h-48 object-contain drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-0 transition-transform hover:-translate-y-4" 
    />
    {/* -------------------------------------------------------- */}
    {/* -------------------------------------------------------- */}
      {/* -------------------------------------------------------- */}

      {/* Main Chunky Card */}
      <div className="w-full max-w-xl bg-white border-8 border-black rounded-[2rem] shadow-[16px_16px_0px_0px_#000000] p-8 md:p-12 relative z-10">
        
        {/* Header - Only shows during the questions */}
        {step < 5 && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
              Welcome to FirstStep
            </h1>
            <p className="text-lg md:text-xl font-semibold text-gray-700">
              Sign-up below to receive updates when new internships & jobs are added!
            </p>
          </div>
        )}

        {/* Step Container with fade/slide effect */}
        <div
          className={`transition-all duration-300 transform ${
            isAnimating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
          }`}
        >
          {/* STEP 1: Role */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
                Are you looking for an internship or a new-grad role?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelection("Internship")}
                  className="w-full py-6 text-2xl font-bold text-black bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#000000] transition-all"
                >
                  Internship
                </button>
                <button
                  onClick={() => handleRoleSelection("New Grad")}
                  className="w-full py-6 text-2xl font-bold text-black bg-[#FFC904] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#000000] transition-all"
                >
                  New Grad
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Frequency */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
                How often do you want updates?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleFrequencySelection("Daily")}
                  className="w-full py-6 text-2xl font-bold text-black bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#000000] transition-all"
                >
                  Daily
                </button>
                <button
                  onClick={() => handleFrequencySelection("Weekly")}
                  className="w-full py-6 text-2xl font-bold text-black bg-[#FFC904] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#000000] transition-all"
                >
                  Weekly
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: First Name */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
                What is your first name?
              </h2>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Knightro"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && formData.firstName && nextStep()}
                className="w-full px-6 py-4 text-2xl font-bold text-black border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] focus:outline-none focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_#FFC904] transition-all placeholder:text-gray-400"
              />
              <button
                onClick={nextStep}
                disabled={!formData.firstName}
                className="mt-4 w-full py-4 text-xl font-bold text-white bg-black border-4 border-black rounded-2xl disabled:opacity-50 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFC904] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#FFC904] transition-all disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                Next
              </button>
            </div>
          )}

          {/* STEP 4: Email */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
                What is your email?
              </h2>
              <input
                type="email"
                autoFocus
                placeholder="knight@ucf.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 text-2xl font-bold text-black border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] focus:outline-none focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_#FFC904] transition-all placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                disabled={!formData.email}
                className="mt-4 w-full py-4 text-2xl font-bold text-black bg-[#FFC904] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                Sign Up!
              </button>
            </form>
          )}

          {/* STEP 5: Success State */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center gap-6 py-8 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 mb-4 bg-[#FFC904] border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_#000000] animate-bounce">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-black">
                Thank you, {formData.firstName}!
              </h2>
              <p className="text-xl font-bold text-gray-700">
                You're officially signed up for {formData.frequency.toLowerCase()} updates for {formData.role.toLowerCase()} roles.
              </p>
              <div className="mt-6 px-6 py-4 bg-gray-100 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
                <p className="text-lg font-bold text-black">
                  We wish you the best of luck and are here to support your journey :)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar (Bottom) */}
        {step < 5 && (
          <div className="mt-12 flex gap-2 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-3 rounded-full border-2 border-black transition-all duration-300 ${
                  i === step ? "w-12 bg-[#FFC904]" : i < step ? "w-6 bg-black" : "w-6 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}