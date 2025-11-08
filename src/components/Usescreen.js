// src/hooks/useScreenSize.js

import { useState, useEffect } from 'react';

const useScreenSize = () => {
  // ตั้งค่าเริ่มต้นตาม window size ปัจจุบัน
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth < 600,
    isTablet: window.innerWidth >= 600 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width: width,
        isMobile: width < 600,
        isTablet: width >= 600 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    // Cleanup function: ลบ Event Listener เมื่อ Component ถูกถอดออก
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] หมายถึงรันครั้งเดียวเมื่อ Component Mount

  return screenSize;
};

export default useScreenSize;