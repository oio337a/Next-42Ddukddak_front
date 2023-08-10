import { useState } from 'react';

const useHandleMouseIndex = () => {
  const [mouseOnIndex, setMouseOnIndex] = useState<number | undefined>();
  const handleMouseOver = (i: number) => {
    setMouseOnIndex(i);
  };

  const handleMouseOut = (i: number) => {
    setMouseOnIndex(i);
  };

  return { mouseOnIndex, handleMouseOut, handleMouseOver };
};

export default useHandleMouseIndex;
