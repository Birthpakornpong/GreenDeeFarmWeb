import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/solid";

const CarouselSlide = ({ banners = [] }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4, // แสดง 4 รายการเต็ม
      partialVisibilityGutter: 20, // แสดงบางส่วนของรายการถัดไป
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 50,
    },
  };
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  return (
    <div className="container mx-auto mt-7 sm:mt-20 relative px-3 sm:px-12">
      <div className="relative mb-5">
        <div className="absolute top-[15px] sm:top-[-10px] left-0 flex justify-between items-center w-full sm:p-1">
          <h3 className="text-left text-blue-900 font-extrabold text-xl sm:text-3xl">
            ลูกค้าของเรา
          </h3>
          {/* <button className="text-right bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary">
        ดูทั้งหมด
      </button> */}
        </div>
      </div>
      <Carousel
        className="pt-12"
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        showDots={false}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-10-px"
        partialVisible={true} // แสดงบางส่วนของรายการถัดไป
        customLeftArrow={
          <button className="absolute top-[15px] sm:top-[-0px] right-[40px] sm:right-[70px] bg-blue-primary text-white p-2 rounded-full shadow-lg z-10 h-8 sm:h-12 w-8 sm:w-12 flex items-center justify-center">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        }
        customRightArrow={
          <button className="absolute top-[15px] sm:top-[-0px] right-[-0px] bg-blue-primary text-white p-2 rounded-full shadow-lg z-10 h-8 sm:h-12 w-8 sm:w-12  flex items-center justify-center">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        }>
        {items.map((item, index) => (
          <div key={index} className="py-2 sm:py-4 px-1 sm:px-2">
            <img
              className="rounded-lg shadow-lg  h-auto object-cover"
              src={"https://picsum.photos/800/400"}
              alt={`Slide ${index}`}
            />
            {/* <h3 className="text-center mt-2">{item.title}</h3> */}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselSlide;
