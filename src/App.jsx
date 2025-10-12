import { useState, useEffect } from 'react';

const menuItems = [
  'Manual',
  'Semi-Auto',
  'FullGoblin',
  'AmberEye',
  'Directory',
  'Records',
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'Enter') {
        console.log('Selected:', menuItems[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex]);

  // Flashing effect
  useEffect(() => {
    const interval = setInterval(() => setFlash((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-[900px] h-[600px] mx-auto mt-10 relative flex flex-col items-center justify-center text-amber-500 font-bold rounded-xl overflow-hidden shadow-inner"
      style={{
        background: 'url(./assets/stone-texture.jpg) center/cover no-repeat',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
      }}
    >
      {/* Title */}
      <h1 className="text-white text-5xl mb-16 drop-shadow-lg font-extrabold">
        GoblinHQ
      </h1>

      {/* Menu */}
      <ul className="flex flex-col gap-4 text-3xl">
        {menuItems.map((item, index) => (
          <li
            key={item}
            className={`cursor-pointer rounded-lg py-3 px-6 transition-all duration-200 text-center shadow-md ${
              index === selectedIndex && flash
                ? 'text-yellow-400 scale-105 shadow-[0_0_20px_#ffff00]'
                : 'bg-[#1e1e1e] text-amber-500 hover:bg-gray-800 hover:scale-105 hover:shadow-lg'
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => console.log('Selected:', item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Version */}
      <span className="absolute bottom-4 text-white text-sm select-none">
        v1.0.0
      </span>
    </div>
  );
}
