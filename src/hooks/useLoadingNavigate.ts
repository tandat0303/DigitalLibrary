import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoadingNavigate = (delay = 1000) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string, state?: any) => {
    setLoading(true);

    setTimeout(() => {
      navigate(path, { state: state });
      setLoading(false);
    }, delay);
  };

  return { handleNavigate, loading };
};
