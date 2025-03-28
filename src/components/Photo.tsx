import { useScreenSize } from 'hooks/useScreenSize';
import React from 'react';
import { PhotoData } from 'types';

export function Photo({ photo }: { photo: PhotoData }) {
  const { height: screenHeight, width: screenWidth } = useScreenSize();
  const { url, width, height } = photo;

  const dims = { width: width || screenWidth, height: height || screenHeight };

  // Get information about the dimensions / ratio of the image
  const tall = dims.height > dims.width;
  const aspect = dims.width / dims.height;
  const inverseAspect = dims.height / dims.width;

  const scaledDims = {
    width: tall ? screenHeight * aspect : screenWidth,
    height: tall ? screenHeight : screenWidth * inverseAspect,
  };

  const verticalSides = (screenWidth - scaledDims.width) / screenWidth / 2;
  const horizontalSides = (screenHeight - scaledDims.height) / screenHeight / 2;

  const start = (tall ? verticalSides : horizontalSides) * 100 + 1;
  const end = start + 4;

  const fadeImage = start > 1;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'black',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',

          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${url})`,
          backgroundSize: '100% 100%',

          WebkitTransform: 'scale(1.1)',
          WebkitTransformOrigin: 'center',

          transform: 'scale(1.1)',
          transformOrigin: 'center',

          filter: 'blur(10px)',
          WebkitFilter: 'blur(10px)',
        }}
      />

      <div
        style={{
          backgroundSize: 'contain',
          width: '100%',
          height: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          inset: 0,
          position: 'absolute',

          backgroundImage: `url(${url})`,
          maskImage: fadeImage
            ? `linear-gradient(${tall ? '0' : '90'}deg, rgba(0,0,0,0) ${start}%, rgba(255,255,255,1) ${end}%, rgba(255,255,255,1) ${
                100 - end
              }%, rgba(0,0,0,0) ${100 - start}%)`
            : undefined,
          WebkitMaskImage: fadeImage
            ? `-webkit-linear-gradient(${
                tall ? '0' : '90'
              }deg, rgba(0,0,0,0) ${start}%, rgba(255,255,255,1) ${end}%, rgba(255,255,255,1) ${100 - end}%, rgba(0,0,0,0) ${
                100 - start
              }%)`
            : undefined,
        }}
      />
    </div>
  );
}
