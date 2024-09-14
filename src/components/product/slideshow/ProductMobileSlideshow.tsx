"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { ProductImage } from "@/components/product/product-image/ProductImage";

import "swiper/css";

import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./slideshow.css";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={`${className}`}>
      <Swiper
        pagination
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              src={image}
              alt={title}
              width={1024}
              height={800}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
