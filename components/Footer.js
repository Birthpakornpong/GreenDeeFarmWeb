import Link from "next/link";
import { useSelector } from "react-redux";
import { PhoneIcon } from "@heroicons/react/solid";
import { ClockIcon, MapPinIcon } from "@heroicons/react/outline";

const navigation = [
  {
    name: "ติดตามสถานะพัสดุ",
    href: "tracking",
    current: false,
    extarnal: false,
    link: "https://track.fuzepost.co.th/",
  },
  { name: "บริการ", href: "service" },
  //   { name: "หน้าแรก", href: "#" },
  //   {
  //     name: "นัดหมายรับสินค้า",
  //     href: "appoint",
  //     current: false,
  //     extarnal: false,
  //     link: "https://order.fuzepost.co.th/",
  //   },
  //{ name: 'นัดหมายรับสินค้า (ใหม่)', href: 'appoint', current: false, extarnal: false, link: "https://order.fuzepost.co.th/" },

  // { name: 'เช็คสถานะพัสดุ (ใหม่)', href: 'tracking', current: false, extarnal: false, link: "https://track.fuzepost.co.th/" },
  //   { name: `พื้นที่จัดส่ง`, href: "area", current: false },
  { name: `ข่าวสาร`, href: "news", current: false },
  { name: "เกี่ยวกับเรา", href: "about", current: false },
];

const navigation2 = [
  { name: "ติดต่อเรา", href: "contact" },
  { name: "คำถามที่พบบ่อย", href: "faq" },
  { name: "ประกาศนโยบายความเป็นส่วนตัว", href: "privacy-notice" },
  //   { name: "บริการของเรา", href: "service" },
  //   { name: "เกี่ยวกับเรา", href: "about", current: false },
  // { name: 'บริการรับส่งสินค้า แช่เย็น/แช่แข็ง', href: '#', sub: true },
  // { name: 'บริการรับส่งดอกไม้', href: '#', sub: true },
  // { name: 'ส่งสินค้าพัสดุทั่วไป', href: '#', sub: true },
  //   { name: "ความช่วยเหลือ" },

  //   {
  //     name: "ข้อตกลงการใช้งานเว็บไซต์",
  //     href: "terms-condition-website",
  //     sub: true,
  //   },

  //   { name: "เงื่อนไขการให้บริการ", href: "terms-condition", sub: true },
  // { name: `ติชม/แนะนำ`, href: 'complain' },
];

const SocialButtons = () => {
  return (
    <div className="flex gap-2">
      <Link
        href="https://www.facebook.com/fuzepost/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-800">
          <img
            className="h-4 w-3"
            src="/assets/icons/Tiktok.png"
            alt="Facebook"
          />
        </div>
      </Link>

      {/* LINE */}
      <Link
        href="https://line.me/ti/p/~@Fuzepost"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer"
        style={{ backgroundColor: "#00C300" }}>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-800">
          <img className="h-4 w-4" src="/assets/icons/line.png" />
        </div>
      </Link>

      <Link
        href="https://www.facebook.com/fuzepost/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer"
        style={{ backgroundColor: "#1877F2" }}>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-800">
          <img
            className="h-4 w-4"
            src="/assets/icons/facebook.png"
            alt="Facebook"
          />
        </div>
      </Link>
    </div>
  );
};
const Footer = () => {
  const userState = useSelector((state) => state.user);
  return (
    <div>
      <div className="h-2 w-full bg-gradient-to-r from-blue-primary to-blue-secondary"></div>
      {/* <div className="w-full flex px-4 py-10 justify-between flex-wrap container mx-auto">
        <div className="flex flex-col items-start whitespace-pre-line max-w-xs mr-10 flex-wrap">
          <img
            className="block h-10 w-auto"
            src={"/assets/images/logo-01.svg"}
            alt="Logo"
          />
          <span className="text-blue-primary mt-5 text-xl">{`FUZE (ฟิ้วซ์) บริการขนส่งสินค้า 
                ควบคุมอุณหภูมิแบรนด์ใหม่`}</span>
          <span className="mt-2">{`ผนึกความร่วมมือระหว่าง บริษัท ไปรษณีย์ไทย จำกัด บริษัท เจดับเบิ้ลยูดี เอ็กซ์เพรส จำกัด และ บริษัท แฟลช เอ็กซ์เพรส จำกัด
เครือข่ายจุดให้บริการทั่วไทย และขับเคลื่อนด้วยเทคโนโลยีดิจิทัลที่ทันสมัย ครอบคลุมพื้นที่ทั่วไทยและอาเซียน`}</span>
        </div>
        <div className="flex flex-1 mt-10 mr-10">
          <div className="flex flex-1 flex-col whitespace-nowrap">
            {navigation
              .filter(
                (x) =>
                  x.href != "appoint" || (x.href == "appoint" && userState.id)
              )
              .map((item) => {
                if (item.extarnal == true) {
                  return (
                    <a
                      target={"_blank"}
                      rel="noreferrer"
                      key={item.name}
                      href={item.link}
                      className={`text-gray-text mb-5 cursor-pointer`}
                     >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-text mb-5 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
          </div>
          <div className="flex flex-1 flex-col whitespace-nowrap">
            {navigation2.map((item) => {
              if (item.sub) {
                return (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-500 mb-5 ml-2 lg:ml-5 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                );
              } else {
                return item.href ? (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-text mb-5 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-gray-text mb-5 cursor-pointer">
                    {item.name}
                  </span>
                );
              }
            })}
          </div>
        </div>
        <div className="flex sm:flex-1">
          <div className="flex flex-1 mt-2 sm:mt-10 flex-col">
            <label className="text-blue-primary text-xl">Call Center</label>
            <a
              href="tel:020556787"
              className="text-blue-primary italic text-2xl whitespace-nowrap"
              style={{ textDecoration: "none", color: "inherit" }}>
              <h5 className="text-blue-primary italic text-2xl whitespace-nowrap">
                02-0556787
              </h5>
            </a>
            <span className="text-blue-primary whitespace-pre-line">{`9:00-18:00 น. จันทร์-อาทิตย์`}</span>
            <span className="mt-1 text-sm">
              Version : {process.env.VERSION}
            </span>
          </div>
        </div>
      </div> */}
      <div className="sm:flex w-full pb-2">
        {/* ส่วนที่ 1 (2 ส่วน) */}
        <div className="flex-[2] flex  p-4 sm:justify-center sm:pt-10">
          <div className="flex flex-col items-start whitespace-pre-line max-w-xs mr-10 flex-wrap">
            <img
              className="block h-20 w-auto"
              src={"/assets/images/logo-01.svg"}
              alt="Logo"
            />
            {/* <span className="text-blue-primary mt-5 text-xl">{`FUZE (ฟิ้วซ์) บริการขนส่งสินค้า 
                ควบคุมอุณหภูมิแบรนด์ใหม่`}</span>
            <span className="mt-2">{`ผนึกความร่วมมือระหว่าง บริษัท ไปรษณีย์ไทย จำกัด บริษัท เจดับเบิ้ลยูดี เอ็กซ์เพรส จำกัด และ บริษัท แฟลช เอ็กซ์เพรส จำกัด
เครือข่ายจุดให้บริการทั่วไทย และขับเคลื่อนด้วยเทคโนโลยีดิจิทัลที่ทันสมัย ครอบคลุมพื้นที่ทั่วไทยและอาเซียน`}</span> */}

            <span className="text-blue-primary mt-5 text-2xl font-bold">{`บริษัท ฟิ้วซ์ โพสต์ จำกัด`}</span>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span className="text-gray-600 whitespace-pre-line">{`9:00-18:00 น. จันทร์-อาทิตย์`}</span>
            </div>
            {/* <MapPinIcon className="w-4 h-4 mr-2" /> */}
            <div className="flex items-center">
              <img
                src={"/assets/icons/pin.svg"}
                alt="Pin"
                className="w-4 h-4 mr-1"
              />
              <span className="text-gray-600 whitespace-pre-line">{`111 ถ. แจ้งวัฒนะ แขวงทุ่งสองห้อง `}</span>
            </div>

            <span className="text-gray-600 whitespace-pre-line ml-5">{`เขตหลักสี่  กรุงเทพมหานคร 10210`}</span>
          </div>
        </div>

        {/* ส่วนที่ 2 (1 ส่วน) */}
        <div className="flex-[1]  p-4 pt-0 sm:pt-10">
          <span className="text-blue-primary mt-5 text-xl font-bold">{`ข้อมูลเกี่ยวกับบริษัท`}</span>
          <div className="flex  flex-col whitespace-nowrap mt-5">
            {navigation
              .filter(
                (x) =>
                  x.href != "appoint" || (x.href == "appoint" && userState.id)
              )
              .map((item) => {
                if (item.extarnal == true) {
                  return (
                    <a
                      target={"_blank"}
                      rel="noreferrer"
                      key={item.name}
                      href={item.link}
                      className={`text-gray-text mb-2 cursor-pointer`}
                      //aria-current={(asPath == "/" ? item.current : (asPath.includes(item.href) && item.href != "")) ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-text mb-2 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* ส่วนที่ 3 (1 ส่วน) */}
        <div className="flex-[1] p-4 pt-0 sm:pt-10">
          <span className="text-blue-primary mt-5 text-xl font-bold">{`ช่วยเหลือ`}</span>
          <div className="flex flex-col whitespace-nowrap mt-5">
            {navigation2.map((item) => {
              if (item.sub) {
                return (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-500 mb-5 ml-2 lg:ml-5 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                );
              } else {
                return item.href ? (
                  <Link key={item.name} href={`/${item.href}`}>
                    <span className="text-gray-text mb-2 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-gray-text mb-2 cursor-pointer">
                    {item.name}
                  </span>
                );
              }
            })}
          </div>
        </div>

        {/* ส่วนที่ 4 (2 ส่วน) */}
        <div className="flex-[2] flex px-4 pb-10 sm:pb-0  sm:mt-10 flex-col sm:pl-20">
          <label className="text-blue-primary text-xl font-bold">
            Call Center
          </label>
          {/* <a
              href="tel:020556787"
              className="text-blue-primary italic text-2xl whitespace-nowrap"
              style={{ textDecoration: "none", color: "inherit" }}>
              <h5 className="text-blue-primary italic text-2xl whitespace-nowrap">
                02-0556787
              </h5>
            </a> */}
          <div className="mt-3">
            <button className="inline-flex  items-center text-right rounded-l-full rounded-r-full bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary">
              <PhoneIcon className="w-4 h-4 mr-2" />
              Call 02-0556787
            </button>
          </div>

          <span className="text-blue-primary mt-5 mb-2 text-xl font-bold">{`Social Contract`}</span>
          <SocialButtons />
          {/* <span className="text-blue-primary whitespace-pre-line">{`9:00-18:00 น. จันทร์-อาทิตย์`}</span>
            <span className="mt-1 text-sm">
              Version : {process.env.VERSION}
            </span> */}
        </div>
      </div>
      <div className="w-full bg-blue-secondary_light flex items-center justify-center py-2 px-4 lg:px-20">
        <span className="text-blue-primary text-xs sm:text-base whitespace-nowrap">
          Copyright © 2024 FuzePost Company Limited. All Rights Reserved
        </span>
      </div>
    </div>
  );
};

export default Footer;
