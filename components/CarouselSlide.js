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
  const farmImages = [
    {
      id: 1,
      src: "/assets/images/farm/banner1.jpg",
      title: "ฟาร์มผักสลัดออร์แกนิก Green Dee Farm"
    },
    {
      id: 2,
      src: "/assets/images/farm/banner2.jpg",
      title: "ระบบปลูกไฮโดรโปนิกส์ทันสมัย"
    },
    {
      id: 3,
      src: "/assets/images/farm/green-oak.jpg",
      title: "Green Oak - กรีนโอ๊ค ใบเขียวกรอบหวาน"
    },
    {
      id: 4,
      src: "/assets/images/farm/red-oak.jpg",
      title: "Red Oak - เรดโอ๊ค ใบแดงสวยหวานมัน"
    },
    {
      id: 5,
      src: "/assets/images/farm/green-cos.jpg",
      title: "Green Cos - กรีนคอส ใบยาวกรอบสด"
    },
    {
      id: 6,
      src: "/assets/images/farm/S__25468934_0.jpg",
      title: "บรรยากาศการเก็บเกี่ยวผักสลัด"
    },
    {
      id: 7,
      src: "/assets/images/farm/S__25468936_0.jpg",
      title: "ผักสลัดสดใหม่พร้อมจัดส่ง"
    },
    {
      id: 8,
      src: "/assets/images/farm/S__25468938_0.jpg",
      title: "คุณภาพผักสลัดออร์แกนิก"
    }
  ];
  return (
    <div className="container mx-auto mt-7 sm:mt-20 relative px-3 sm:px-12">
      <div className="relative mb-5">
        <div className="absolute top-[15px] sm:top-[-10px] left-0 flex justify-between items-center w-full sm:p-1">
          <h3 className="text-left text-green-700 font-extrabold text-xl sm:text-3xl">
            บรรยากาศฟาร์มผักสลัด
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
          <button className="absolute top-[15px] sm:top-[-0px] right-[40px] sm:right-[70px] bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl z-10 h-8 sm:h-12 w-8 sm:w-12 flex items-center justify-center transition-all duration-300">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        }
        customRightArrow={
          <button className="absolute top-[15px] sm:top-[-0px] right-[-0px] bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl z-10 h-8 sm:h-12 w-8 sm:w-12 flex items-center justify-center transition-all duration-300">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        }>
        {farmImages.map((item, index) => (
          <div key={item.id} className="py-2 sm:py-4 px-1 sm:px-2">
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 hover:border-green-200">
              <img
                className="w-full h-48 sm:h-64 object-cover"
                src={item.src}
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-sm font-medium drop-shadow-lg">{item.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselSlide;
