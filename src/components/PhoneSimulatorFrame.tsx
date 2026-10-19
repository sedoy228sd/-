import React from 'react';

interface PhoneSimulatorFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
}

export const PhoneSimulatorFrame: React.FC<PhoneSimulatorFrameProps> = ({
  children,
  isPhoneFrame,
}) => {
  if (!isPhoneFrame) {
    return <div className="min-h-screen w-full flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6 bg-neutral-950/90">
      {/* Smartphone Bezel */}
      <div className="w-full max-w-[430px] h-[92vh] max-h-[890px] bg-[#080a10] rounded-[48px] p-3 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-4 border-slate-700/60 flex flex-col relative overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-center gap-2 border border-slate-800 shadow-sm pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/50" />
          <div className="w-2 h-2 rounded-full bg-blue-950/80 border border-blue-900/60" />
        </div>

        {/* Screen inner wrapper */}
        <div className="w-full h-full rounded-[38px] overflow-hidden flex flex-col relative bg-[#080a10] pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};
