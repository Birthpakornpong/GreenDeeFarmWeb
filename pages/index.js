import BannerSlide from "@components/BannerSlide";
import BannerData from "../json/bannerData";
import newsData from "../json/newsData";
import CarouselSlide from "@components/CarouselSlide";
import CardMenu from "@components/CardMenu";
import ImageModal from "@components/CustomModal/ImageModal";
import ApiMasters from "api/ApiMasters";
import ApiNews from "api/ApiNews";
import moment from "moment";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import AccordionList from "@components/AccordionList";
import NewsHome from "@components/NewsHome";
import ServiceHome from "@components/ServiceHome";
import TrackStatus from "@components/TrackStatus";

const data = [
  {
    name: "ขนส่งแช่เย็น",
    description:
      "บริการขนส่งสินค้าในรูปแบบสินค้าแช่เย็นที่อุณหภูมิ 0 - 8 องศาเซลเซียส และสินค้าแช่แข็งที่ อุณหภูมิต่ำกว่า -15",
    icon: "/assets/icons/service1.png",
    except: [
      {
        province: "แม่ฮ่องสอน",
      },
    ],
  },
  {
    name: "ขนส่งแช่แข็ง",
    description:
      "บริการขนส่งสินค้าในรูปสินค้าแช่แข็งที่ อุณหภูมิต่ำกว่า -15 องศาเซลเซียส ",
    icon: "/assets/icons/service2.png",
  },
  {
    name: "รถเหมาคัน",
    description:
      "บริการจัดส่งสินค้าบริการจองรถบรรทุกจัดส่งสินค้าแบบเต็มเที่ยวหรือเหมาเที่ยว",
    icon: "/assets/icons/service3.png",
  },
];

const imageService = [
  "1-เข้ารับสินค้า-ถึงที่ร้านz-z239793113048.png",
  "การันตีถึงมือผู้รับ-ภายใน-1-2-วันz-z1116046541639.png",
  "3-ไม่เสียเครดิต-หน้าร้านz-z1698966112159.png",
  "4-เก็บความเย็น-ได้ยาวนาน-36-ชมz-z496278189846.png",
  "5-คงคุณค่ารักษา-ความสดz-z1640214707518.png",
  "6-ชะลอ-การเน่าเสียz-z1347825866656.png",
  "7-ส่งได้ทั้งสินค้าแช่เย็น-และแช่แข็งz-z861879256938.png",
  "10-รับรีวิวดีๆ-จากลูกค้าz-z1137984378981.png",
];

export default function Home() {
  const [modal, setmodal] = useState(false);
  const [seasonImage, setseasonImage] = useState("");
  const [result, setResult] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [resultNews, setResultNews] = useState([]);

  useEffect(() => {
    // Fetch data for banners, promotions, and news
    async function fetchData() {
      try {
        // const [bannerRes, promoRes, newsRes] = await Promise.all([
        //   ApiNews.getBanner(),
        //   ApiMasters.getPromotionsSeasoning(),
        //   ApiNews.get(),
        // ]);
        setResult(BannerData);
        // setPromotions(promoRes.data || []);
        setResultNews(newsData);
      } catch (e) {
        // handle error if needed
      }
    }
    fetchData();
    setseasonImage("/assets/images/annountment.jpg");
  }, []);

  return (
    <div>
      {modal && (
        <ImageModal
          onClose={() => {
            setmodal(false);
          }}>
          <div className="relative">
            <img
              className="object-contain w-full max-h-[900px]"
              onClick={() => {
                setmodal(false);
              }}
              src={"/assets/images/annountment.jpg"}
            />
            <button
              onClick={() => {
                setmodal(false);
              }}
              className="bg-[#222222] fixed top-[10px] sm:top-[10px] right-[10px] rounded-[100%] p-1 sm:p-2">
              <XIcon className="block h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </ImageModal>
      )}
      <div className="w-full">
        <div className="w-full">
          <BannerSlide banners={result} />
        </div>
        {/* <div className='container px-4 mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          <Accordion href="rate" className="mt-2 sm:mt-5 cursor-pointer" title='อัตราค่าบริการ' description='คำนวณจากระยะทางต้นทาง' icon="/assets/icons/menu1.png" />
          <CardMenu className="mt-2 sm:mt-5 cursor-pointer" title='Drop Off' description='ค้นหาจุด Drop Off ใกล้คุณ' icon="/assets/icons/menu2.png" />
          <CardMenu href="boxSize" className="mt-2 sm:mt-5 cursor-pointer" title='ขนาดกล่อง' description='คำนวณขนาดของกล่อง' icon="/assets/icons/menu3.png" />
        </div> */}
      </div>

      {/* <TrackStatus /> */}
      <div className="bg-stone-50">
        <ServiceHome />
      </div>
      <AccordionList className="mt-2" />
      <div className="bg-gray-100 p-5 sm:p-10 ">
        <NewsHome resultNews={resultNews.slice(0, 3)} />
        <CarouselSlide banners={result} />
      </div>

      {/* <div className="w-full mt-20 bg-new">
        <div className="container mx-auto px-10">
          <div className="flex flex-col text-center mt-10 items-center">
            <img
              src="/assets/logo/logoz-z882117401020.png"
              className="h-40 w-80"
            />
            <h1 className="text-xl sm:text-3xl text-blue-primary mt-5">
              เกิดจากการร่วมพันธมิตรของผู้นำด้านการขนส่งโลจิสติกส์ไทย
            </h1>
            <label className="text-xl">
              นำศักยภาพของแต่ละหน่วยงานมาร่วมพัฒนา
              การให้บริการขนส่งควบคุมอุณหภูมิที่ดีที่สุด
              <br />
              กลายเป็นผู้ให้บริการขนส่งระบบควบคุมอุณหภูมิที่โดดเด่น
            </label>
          </div>
          <div className="flex mt-20 justify-between flex-wrap">
            <div className="sm:flex-1">
              <img
                style={{
                  zoone: "60%",
                }}
                src="/assets/logo/aboutz-z306659836677.png"
              />
            </div>
            <div className="flex-1">
              <label>โดยสามารถให้</label>
              <h1 className="text-xl sm:text-3xl">
                บริการได้ครอบคลุมทุกที่ทั่วไทย
              </h1>
              <label className="text-xl mt-5">
                จากศักยภาพของไปรษณีย์ไทย ซึ่งเป็นผู้เชี่ยวชาญด้านการขนส่งแบบ
                Door to Door ที่มีเครือข่ายที่ครอบคลุมทุกพื้นที่ทั่วประเทศกว่า
                10,000 สาขา ความเชี่ยวชาญในการให้บริการขนส่งระบบควบคุมอุณหภูมิ
                จากประสบการณ์กว่า 25 ปี ของเอสซีจี เจดับเบิ้ลยูดี โลจิสติกส์
                และเทคโนโลยีที่ทันสมัยตลอดกระบวนการขนส่งสินค้า
                จากศักยภาพของทีมงาน แฟลช เอ็กซ์เพรส
              </label>
              <img
                className="mt-10"
                src="/assets/logo/Vector-Smart-Objectz-z445924411910.png"
              />
            </div>
            
          </div>
          <div className="flex flex-col text-center items-center">
      
            <h1 className="text-xl sm:text-5xl text-blue-primary mt-5">
              ทำไมต้อง FUZE POST
            </h1>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-4 mt-5 place-items-center">
            {imageService.map((item, index) => {
              return (
                <img
                  key={item}
                  className="sm:h-52"
                  src={`/assets/logo/${item}`}
                />
              );
            })}
          </div>
        
        </div>
      </div>
      <div className="w-full sm:hidden relative">
        <img
          className="z-[-10px] absolute h-[300px] top-[150px] right-[-0px] bottom-[0px]"
          src="/assets/bg/bg-7.webp"
        />
        <div className="container px-5 mx-auto py-10 gap-x-20">
          <div className="flex grid grid-cols-2 flex-wrap gap-x-4 gap-y-10">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-xd">บริการของเรา</h1>
              <span className="text-xs">
                บริการขนส่งสินค้าในรูปแบบสินค้าแช่เย็นที่อุณหภูมิ 0 - 8
                องศาเซลเซียส และสินค้าแช่แข็งที่ อุณหภูมิต่ำกว่า -15
                องศาเซลเซียส โดยใช้การขนส่งรถตู้ทึบและกล่อง Cool Box
                เพื่อควบคุมอุณหภูมิ
                จึงสามารถกักเก็บความสดใหม่ของสินค้าได้อย่างดี ตลอดระยะการเดินทาง
              </span>
            </div>
            {data.map((item, index) => {
              return (
                <div
                  key={item.name}
                  className={`bg-white h-fit min-h-[150px] pt-5 relative rounded-lg flex-col border-2 flex`}>
                  <div className="w-full flex items-center justify-center">
                    <img
                      className="w-16 h-16 justify-self-center object-contain absolute top-[-30px]"
                      src={`${item.icon}`}
                    />
                  </div>
                  <div className="flex flex-col px-4 py-4 items-center">
                    <label className="font-bold text-sm text-blue-primary">
                      {item.name}
                    </label>
                    <label className="text-xs italic text-gray">
                      {item.description}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
      {/* <div className="">
        <div className="bg-bg1 h-80 sm:h-96 relative">
          <div className="container mx-auto max-w-4xl text-right flex relative">
            <div className="bg-order-place hidden sm:block sm:h-96 bg-contain bg-no-repeat w-full">

            </div>
            <div className="z-10 flex flex-col text-left absolute top-8 right-0 w-full sm:w-2/3 px-5">
              <img className="h-20 object-contain mt-2 self-start"
                src="/assets/logo/appicon.png" />
              <div className="mt-2">
                <label className="text-white text-sm sm:text-base">สะดวกสบายกับการใช้งาน Fuze Post  ได้ง่ายๆ โดยผ่าน Mobile Application ซึ่งรองรับทั้ง iOS และ Android โดย iOS เข้าไปที่ App Store หรือ Android เข้าไปที่ Google play จากนั้นค้นหาคำว่า Fuze Postหรือ Click ที่ปุ่มด้านล่าง</label>
                <div className="flex mt-5 flex-wrap gap-x-4">
                  <img className="h-8 sm:h-12 object-cover mt-2"
                    src="/assets/logo/appstore.webp" />
                  <img className="h-8 sm:h-12 object-cover mt-2"
                    src="/assets/logo/googleplay.webp" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className='relative mt-2 sm:mt-10'>
        <img className="w-full sm:w-full h-60  sm:h-auto object-cover"
          src="/assets/images/home.png" />
        <div className='absolute right-[5%] sm:right-[10%] top-[40%] sm:top-[40%] flex flex-col items-end sm:gap-y-2'>
          <h1 className='text-white text-sm sm:text-3xl'>ค้นหาพื้นที่บริการจัดส่งสินค้า</h1>
          <div className='flex flex-col items-end'>
            <h4 className='text-white text-xs sm:text-lg'>ค้นหาสถานที่ที่เปิดให้บริการแล้ว เพื่อความ
            </h4>
            <h4 className='text-white text-xs sm:text-lg'>สะดวกในการจัดส่งสินค้า
            </h4>
          </div>
        </div>
      </div> */}
    </div>
  );
}
