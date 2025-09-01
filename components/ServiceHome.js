import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useRouter } from "next/router";

const ServiceHome = ({ banners = [] }) => {
  const router = useRouter();
  return (
    <>
      <div className="container mx-auto mt-7 sm:mt-10 px-5 sm:px-12">
        <div className="flex justify-between items-center  pt-4 rounded-md mb-3">
          <h3 className="text-left text-blue-900 font-extrabold text-xl sm:text-3xl">
            บริการ Fuze Post
          </h3>
          {/* <button className="text-right  bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary">
            ดูทั้งหมด
          </button> */}
        </div>
        <div className="sm:flex flex-wrap pb-10">
          {/* คอลัมน์ซ้าย (3 ส่วน) */}
          <div className="flex-[2] rounded-lg mr-5 pr-0 sm:pr-10">
            
            <p className="text-xl sm:text-2xl">
              บริการได้ครอบคลุมทุกที่ทั่วไทย
              ขนส่งครบวงจรโดยผสานเครือข่ายไปรษณีย์ไทย{" "}
              <b className="font-extrabold text-2xl sm:text-3xl">กว่า 10,000 สาขา</b>
              กับความเชี่ยวชาญ ด้านโลจิสติกส์และเทคโนโลยีทันสมัยจาก SCGJWD และ
              Flash Express รองรับการจัดส่งแบบควบคุมอุณหภูมิทั่ว
              ประเทศด้วยมาตรฐานระดับมืออาชีพ
            </p>
            <div className=" sm:flex flex-wrap">
              <div className="mt-10 rounded-lg bg-white px-5 py-7 flex-1 mr-0 sm:mr-2 text-black-text shadow-lg">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-sky-200 flex items-center justify-center rounded-md">
                    <img
                      className="w-4 h-6"
                      src="/assets/icons/device_thermostat.png"
                    />
                  </div>
                </div>
                <h5 className="text-black">
                  ส่งสินค้าควบคุมอุณหภูมิ (บริการรับสินค้าหน้าบ้าน)
                </h5>
                <h5 className="flex mt-5 font-bold text-sky-600 items-center cursor-pointer"  onClick={() => router.push("/parcel")}> 
                  ดูรายละเอียด
                  <img
                    className="ml-3 w-4 h-4 text-sky-600"
                    src="/assets/icons/arrow-right-long-duotone.svg"
                    alt="arrow-right"
                  />
                </h5>
              </div>
              <div className="mt-10 rounded-lg bg-white px-5 py-7 flex-1 ml-0 sm:ml-2 sm:mr-2 shadow-lg">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-sky-200 flex items-center justify-center rounded-md">
                    <img className="w-6 h-6" src="/assets/icons/package.png" />
                  </div>
                </div>
                <h4 className="">
                  ส่งสินค้าแบบเหมาคัน (บริการรับสินค้าหน้าบ้าน)
                </h4>
                <h5 className="flex mt-5 font-bold text-sky-600 items-center cursor-pointer"  onClick={() => router.push("/parcel")}>
                  ดูรายละเอียด
                  <img
                    className="ml-3 w-4 h-4 text-sky-600"
                    src="/assets/icons/arrow-right-long-duotone.svg"
                    alt="arrow-right"
                  />
                </h5>
              </div>
              <div className="mt-10 rounded-lg bg-white px-5 py-7 flex-1 ml-0 sm:ml-2 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 bg-sky-200 flex items-center justify-center rounded-md">
                      <img
                        className="w-8 h-6"
                        src="/assets/icons/delivery_truck_speed.png"
                      />
                    </div>
                  </div>
                  <h4 className="">Cold Chain Delivery Solution </h4>
                </div>
                <h5 className="flex mt-5 font-bold text-sky-600 items-center cursor-pointer"  onClick={() => router.push("/parcel")}>
                  ดูรายละเอียด
                  <img
                    className="ml-3 w-4 h-4 text-sky-600"
                    src="/assets/icons/arrow-right-long-duotone.svg"
                    alt="arrow-right"
                  />
                </h5>
              </div>
            </div>
          </div>

          {/* คอลัมน์ขวา (1 ส่วน) */}
          <div className="flex-[1] bg-gray-200 p-5 rounded-lg">
            <img src="/assets/images/home/fuze-product.png" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceHome;
