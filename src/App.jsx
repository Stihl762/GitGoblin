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

  // Handle keyboard navigation
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

  // Flashing effect for selected menu item
  useEffect(() => {
    const interval = setInterval(() => setFlash((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-[900px] h-[600px] mx-auto mt-10 relative flex flex-col items-center justify-center text-orange-500 font-bold"
      style={{
        background: 'url(./assets/stone-texture.jpg) center/cover no-repeat',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
      }}
    >
      {/* Title */}
      <h1 className="text-white text-5xl mb-16 drop-shadow-lg">GoblinHQ</h1>

      {/* Menu Options */}
      <ul className="space-y-6 text-3xl">
        {menuItems.map((item, index) => (
          <li
            key={item}
            className={`transition-opacity cursor-pointer drop-shadow-lg ${
              index === selectedIndex && flash ? 'opacity-50' : 'opacity-100'
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => console.log('Selected:', item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Version */}
      <span className="absolute bottom-4 text-white text-sm">v1.0.0</span>
    </div>
  );
}
