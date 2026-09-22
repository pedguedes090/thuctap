import React from 'react';

// Duck 1: Vịt đeo kính mát cực ngầu
function CoolSunglassesDuck({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      {/* Body */}
      <ellipse cx="32" cy="42" rx="20" ry="14" fill="#FACC15" />
      <path d="M46 38C52 35 56 32 54 44C50 48 40 50 32 50C22 50 16 46 16 40C16 34 26 32 32 32C36 32 42 34 46 38Z" fill="#EAB308" />
      {/* Tail */}
      <path d="M50 40C56 36 60 30 58 26C54 28 50 34 46 38Z" fill="#FACC15" />
      {/* Head */}
      <circle cx="24" cy="24" r="14" fill="#FDE047" />
      {/* Beak */}
      <path d="M12 26C7 26 4 28 5 31C7 33 13 33 16 30C16 28 14 26 12 26Z" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
      {/* Sunglasses */}
      <path d="M13 21H34V25C34 27.5 32 29 29.5 29H26C24 29 22.5 28 22 26C21.5 28 20 29 18 29H14.5C12 29 10 27.5 10 25V21H13Z" fill="#0F172A" />
      <rect x="13" y="22" width="6" height="2" rx="1" fill="#94A3B8" opacity="0.6" />
      <rect x="25" y="22" width="6" height="2" rx="1" fill="#94A3B8" opacity="0.6" />
      {/* Wing */}
      <path d="M28 38C28 38 34 32 42 34C46 35 48 40 43 44C38 48 32 44 28 38Z" fill="#CA8A04" />
    </svg>
  );
}

// Duck 2: Vịt cao su má hồng mắt long lanh
function KawaiiBlushDuck({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      {/* Body */}
      <ellipse cx="33" cy="43" rx="19" ry="13" fill="#FDE047" />
      {/* Tail */}
      <path d="M48 40C54 36 58 31 56 27C52 29 48 35 44 39Z" fill="#FACC15" />
      {/* Head */}
      <circle cx="25" cy="24" r="14" fill="#FDE047" />
      {/* Cute Anime Eye */}
      <circle cx="22" cy="21" r="3.5" fill="#1E293B" />
      <circle cx="21" cy="20" r="1.3" fill="#FFFFFF" />
      <circle cx="23.5" cy="22.5" r="0.8" fill="#FFFFFF" />
      {/* Rosy Blush */}
      <ellipse cx="27" cy="27" rx="3.5" ry="2" fill="#F87171" opacity="0.7" />
      {/* Cute Beak */}
      <path d="M14 25C9 25 6 27 7 30C9 32 15 32 17 29C17 27 16 25 14 25Z" fill="#FB923C" />
      {/* Wing */}
      <path d="M30 40C30 40 36 34 43 36C47 37 47 42 43 45C38 48 33 45 30 40Z" fill="#EAB308" />
    </svg>
  );
}

// Duck 3: Vịt cài hoa cúc nhỏ trên đầu
function FlowerDuck({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      {/* Body */}
      <ellipse cx="32" cy="42" rx="19" ry="13" fill="#FACC15" />
      {/* Tail */}
      <path d="M48 39C54 35 58 30 56 26C52 28 48 34 44 38Z" fill="#EAB308" />
      {/* Head */}
      <circle cx="24" cy="23" r="13.5" fill="#FDE047" />
      {/* Flower on head */}
      <circle cx="24" cy="9" r="3" fill="#FFFFFF" />
      <circle cx="20" cy="11" r="3" fill="#FFFFFF" />
      <circle cx="28" cy="11" r="3" fill="#FFFFFF" />
      <circle cx="21" cy="15" r="3" fill="#FFFFFF" />
      <circle cx="27" cy="15" r="3" fill="#FFFFFF" />
      <circle cx="24" cy="13" r="2.5" fill="#F59E0B" />
      {/* Eye with eyelashes */}
      <circle cx="21" cy="21" r="3" fill="#1E293B" />
      <circle cx="20" cy="20" r="1.1" fill="#FFFFFF" />
      <path d="M23 18L25 16M24 19L27 18" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="26" cy="26" rx="3" ry="1.8" fill="#FB7185" opacity="0.75" />
      {/* Beak */}
      <path d="M13 25C9 25 6 27 7 29C9 31 14 31 16 28C16 26 15 25 13 25Z" fill="#F97316" />
      {/* Wing */}
      <path d="M30 39C30 39 36 34 42 36C45 37 46 41 42 44C38 47 33 44 30 39Z" fill="#CA8A04" />
    </svg>
  );
}

// Duck 4: Vịt ngố đeo kính cận
function NerdNerdDuck({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      {/* Body */}
      <ellipse cx="32" cy="42" rx="19" ry="13" fill="#FACC15" />
      {/* Tail */}
      <path d="M48 39C54 35 58 30 56 26C52 28 48 34 44 38Z" fill="#EAB308" />
      {/* Head */}
      <circle cx="24" cy="23" r="13.5" fill="#FDE047" />
      {/* Round Glasses */}
      <circle cx="18" cy="21" r="5" stroke="#1E293B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
      <circle cx="28" cy="21" r="5" stroke="#1E293B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
      <line x1="23" y1="21" x2="23" y2="21" stroke="#1E293B" strokeWidth="2" />
      {/* Eyes inside glasses */}
      <circle cx="18" cy="21" r="2" fill="#1E293B" />
      <circle cx="28" cy="21" r="2" fill="#1E293B" />
      {/* Beak */}
      <path d="M12 26C8 26 5 28 6 30C8 32 14 32 16 29C16 27 14 26 12 26Z" fill="#EA580C" />
      {/* Wing */}
      <path d="M29 39C29 39 35 34 41 36C45 37 45 42 41 45C37 47 32 44 29 39Z" fill="#CA8A04" />
    </svg>
  );
}

// Duck 5: Vịt đội mũ beanie đỏ cute
function BeanieDuck({ size = 45 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      {/* Body */}
      <ellipse cx="32" cy="42" rx="19" ry="13" fill="#FACC15" />
      {/* Tail */}
      <path d="M48 39C54 35 58 30 56 26C52 28 48 34 44 38Z" fill="#EAB308" />
      {/* Head */}
      <circle cx="24" cy="24" r="13.5" fill="#FDE047" />
      {/* Cute Beanie Hat */}
      <path d="M15 17C16 11 22 8 28 10C33 11 35 15 35 17H15Z" fill="#EF4444" />
      <rect x="13" y="16" width="23" height="4" rx="2" fill="#DC2626" />
      <circle cx="22" cy="7" r="3" fill="#FFFFFF" />
      {/* Eye */}
      <circle cx="21" cy="24" r="2.8" fill="#1E293B" />
      <circle cx="20" cy="23" r="1" fill="#FFFFFF" />
      {/* Beak */}
      <path d="M13 27C9 27 6 29 7 31C9 33 14 33 16 30C16 28 15 27 13 27Z" fill="#FB923C" />
      {/* Wing */}
      <path d="M30 39C30 39 36 34 42 36C46 37 46 41 42 44C38 47 33 44 30 39Z" fill="#CA8A04" />
    </svg>
  );
}

const DUCK_TYPES = [
  CoolSunglassesDuck,
  KawaiiBlushDuck,
  FlowerDuck,
  NerdNerdDuck,
  BeanieDuck
];

const STATIC_DUCKS = [
  { id: 1, left: '6%', delay: '0s', duration: '9s', swayDuration: '2.8s', duckIdx: 0, size: 46 },
  { id: 2, left: '20%', delay: '2.8s', duration: '12s', swayDuration: '3.4s', duckIdx: 1, size: 42 },
  { id: 3, left: '36%', delay: '5.5s', duration: '10s', swayDuration: '2.5s', duckIdx: 2, size: 48 },
  { id: 4, left: '50%', delay: '1.2s', duration: '13s', swayDuration: '4s', duckIdx: 3, size: 40 },
  { id: 5, left: '66%', delay: '4.2s', duration: '8.8s', swayDuration: '3s', duckIdx: 4, size: 45 },
  { id: 6, left: '82%', delay: '0.8s', duration: '11s', swayDuration: '3.6s', duckIdx: 0, size: 44 },
  { id: 7, left: '14%', delay: '7s', duration: '10.5s', swayDuration: '2.9s', duckIdx: 2, size: 46 },
  { id: 8, left: '30%', delay: '4.5s', duration: '13.5s', swayDuration: '4.2s', duckIdx: 1, size: 38 },
  { id: 9, left: '58%', delay: '8s', duration: '9.5s', swayDuration: '2.7s', duckIdx: 3, size: 44 },
  { id: 10, left: '74%', delay: '5.2s', duration: '12s', swayDuration: '3.8s', duckIdx: 4, size: 42 },
  { id: 11, left: '44%', delay: '9.2s', duration: '11s', swayDuration: '3.1s', duckIdx: 0, size: 48 },
  { id: 12, left: '90%', delay: '3.6s', duration: '9.8s', swayDuration: '2.6s', duckIdx: 1, size: 40 },
];

export default function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-[1.15] bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 rounded-l-[48px] relative overflow-hidden pointer-events-none select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating SVG Ducks Falling Like Petals (Không dùng emoji icon, dùng SVG xịn) */}
      {STATIC_DUCKS.map((item) => {
        const DuckComponent = DUCK_TYPES[item.duckIdx];
        return (
          <div
            key={item.id}
            className="floating-duck-item"
            style={{
              left: item.left,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
          >
            <div
              className="duck-inner-sway"
              style={{
                animationDuration: item.swayDuration,
              }}
            >
              <DuckComponent size={item.size} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
