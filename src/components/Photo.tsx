import React from 'react';
import { PhotoData } from 'types';
import { SERVER } from 'util';

export function Photo({
  photo,
  screen,
  active,
}: {
  photo: PhotoData;
  screen: { width: number; height: number };
  active: boolean;
}) {
  const { url: rawUrl, width, height, date } = photo;
  const { width: screenWidth, height: screenHeight } = screen;
  const url = `${SERVER}${rawUrl}`;

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
        position: 'absolute',
        background: 'black',
        overflow: 'hidden',
        visibility: active ? 'visible' : 'hidden',
        top: active ? 0 : '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',

          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url("${url}")`,
          backgroundSize: '100% 100%',

          transform: 'scale(1.1)',
          WebkitTransform: 'scale(1.1)',

          transformOrigin: 'center',
          WebkitTransformOrigin: 'center',

          filter: 'blur(40px)',
          WebkitFilter: 'blur(40px)',
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

          backgroundImage: `url("${url}")`,
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

      {date && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            color: 'white',
            fontSize: '0.85rem',
            textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          {new Date(date).toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}
