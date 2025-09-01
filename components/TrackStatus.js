import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";
import InputHomeComponent from "@components/InputHome";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const TrackStatus = ({ banners = [] }) => {
  const router = useRouter();

  const [trackingNo, settrackingNo] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await ApiOrders.findTracking(trackingNo);
      if (result.status == 200) {
        router.push(`/tracking/${trackingNo}`);
      }
    } catch (error) {
      toast.dismiss();
      const { data } = error.response;
      toast.error(data.error.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        className: "text-lg",
      });
    }
  };
  return (
    <div className="container px-5 sm:px-12 mx-auto mt-7 sm:mt-10 pb-7">
      <div className="flex justify-between items-center  p-1 rounded-md mb-5" >
        <h3 className="text-left text-blue-900 font-extrabold text-xl sm:text-3xl">
          ติดตามสถานะพัสดุ
        </h3>
        {/* <button className="text-right  bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary">
        ดูทั้งหมด
      </button> */}
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full flex flex-wrap"
        style={{ marginTop: "-0.75rem" }}>
        <div className="grid grid-cols-1 space-x-0 sm:flex w-full flex-wrap " style={{ display: 'flex'}}>
          <div className="flex-1 relative">
            <InputHomeComponent
              key="trackingNo"
              label="ติดตามสถานะพัสดุ"
              placeholder={"ใส่หมายเลขพัสดุหลักของคุณที่นี่"}
              onChange={(e) => settrackingNo(e.target.value)}
              value={trackingNo}
              required
            />
          </div>
          <button className="px-3 sm:px-16 py-3 bg-sky-500  rounded-r-md text-white"    onClick={() => router.push("/tracking")}>
            <h4>ติดตามสถานะพัสดุ</h4>
          </button>
        </div>
      </form>

      <div className="sm:flex flex-wrap justify-center items-center">
        <div
          onClick={() => router.push("/calculate")}
          className="mt-10 rounded-lg bg-white px-0 py-5 flex-1 mr-0 sm:mr-5 text-black-text shadow-xl border border-gray-300 flex items-center cursor-pointer"
          style={{ justifyContent: "center" }}>
          {/* ส่วนของไอคอน (1 ส่วน) */}
          <div className="flex-[1] sm:flex-[1] flex justify-end">
            <div className="w-14 h-14 bg-sky-200 flex items-center justify-center rounded-md">
              <img
                className="w-8 h-8"
                src="/assets/icons/calculate.png"
                alt="icon"
              />
            </div>
          </div>

          {/* ส่วนของข้อความ (4 ส่วน) */}
          <div className="flex-[3] sm:flex-[4] px-5 sm:px-10">
            <div className="flex rounded-md mb-1">
              <h3 className="text-left text-blue-900 font-extrabold text-2xl">
                คำนวณค่าส่งพัสดุ
              </h3>
            </div>
            <div className="text-left text-lg sm:text-2xl">
              ตรวจสอบค่าจัดส่งล่วงหน้าได้ทันที
            </div>
          </div>
        </div>
        <div
          onClick={() => router.push("/dropoff")}
          className="mt-10 rounded-lg bg-white px-0 py-5 flex-1 mr-0 sm:ml-5 text-black-text shadow-xl border border-gray-300 flex items-center cursor-pointer"
          style={{ justifyContent: "center" }}>
          {/* ส่วนของไอคอน (1 ส่วน) */}
          <div className="flex-[1] flex justify-end">
            <div className="w-14 h-14 bg-sky-200 flex items-center justify-center rounded-md">
              <img
                className="w-6 h-8"
                src="/assets/icons/pin_drop.png"
                alt="icon"
              />
            </div>
          </div>

          {/* ส่วนของข้อความ (4 ส่วน) */}
          <div className="flex-[3] sm:flex-[4] px-5 sm:px-10">
            <div className="flex rounded-md mb-1">
              <h3 className="text-left text-blue-900 font-extrabold text-2xl">
                จุดให้บริการ
              </h3>
            </div>
            <div className="text-left text-lg sm:text-2xl">
              ค้นหาสาขารับ-ส่งพัสดุใกล้คุณ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;
