import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    // Target: Jan 1, 2026 00:00:00 Turkey Time (UTC+3)
    // Turkey is strictly UTC+3 all year round.
    // We can target specific ISO string with offset
    const targetDate = new Date('2026-01-01T00:00:00+03:00');
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-gray-300 text-[10px] font-medium uppercase tracking-widest mb-1">
        2026'ya Kalan Süre
      </div>
      <div className="flex gap-2 text-center">
        <div className="flex flex-col items-center p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 w-12">
          <span className="text-lg font-bold text-white font-mono">{timeLeft.days}</span>
          <span className="text-[8px] text-gray-400">GÜN</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 w-12">
          <span className="text-lg font-bold text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[8px] text-gray-400">SAAT</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 w-12">
          <span className="text-lg font-bold text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[8px] text-gray-400">DK</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 w-12">
          <span className="text-lg font-bold text-green-400 font-mono animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[8px] text-gray-400">SN</span>
        </div>
      </div>
    </div>
  );
}
