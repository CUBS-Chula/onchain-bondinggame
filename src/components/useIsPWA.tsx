import { useEffect, useState } from "react";

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsPWA(checkPWA);
  }, []);

  // return isPWA;
  return true;
};

export default useIsPWA;
