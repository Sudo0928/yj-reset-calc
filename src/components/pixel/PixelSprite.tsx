interface PixelSpriteProps {
  src: string;
  alt?: string;
  scale?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function PixelSprite({
  src,
  alt = '',
  scale = 1,
  width,
  height,
  className = '',
}: PixelSpriteProps) {
  const w = width ? width * scale : undefined;
  const h = height ? height * scale : undefined;

  return (
    <img
      src={src}
      alt={alt}
      className={`pixel ${className}`}
      width={w}
      height={h}
      style={{ width: w, height: h, imageRendering: 'pixelated' }}
      draggable={false}
    />
  );
}
