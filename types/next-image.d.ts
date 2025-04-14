// Declaration file for next/image
declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
  
  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string | StaticImageData;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    loader?: ImageLoader;
    quality?: number | string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    lazyBoundary?: string;
    blurDataURL?: string;
    placeholder?: 'blur' | 'empty';
  }
  
  export interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  }
  
  export interface ImageLoader {
    (resolverProps: ImageLoaderProps): string;
  }
  
  export interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number | string;
  }
  
  declare const Image: React.FC<ImageProps>;
  export default Image;
}
