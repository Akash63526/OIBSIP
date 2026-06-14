import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const loaderClass = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600";
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className={loaderClass}></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className={loaderClass}></div>
    </div>
  );
};

export default Loader;
