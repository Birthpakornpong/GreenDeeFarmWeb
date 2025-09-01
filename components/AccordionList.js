import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const ServiceStep = [
  {
    head: "การเตรียมจัดสินค้า",
    detail:
      "การเตรียมจัดสินค้าให้พร้อมก่อนการจัดส่ง โดยควรตรวจสอบความสะอาดและความปลอดภัยของสินค้า",
  },
  {
    head: "ขั้นตอนการนำส่งสินค้า",
    detail:
      "การเตรียมจัดสินค้าให้พร้อมก่อนการจัดส่ง โดยควรตรวจสอบความสะอาดและความปลอดภัยของสินค้า",
  },
  {
    head: "ขั้นตอนการแพ็คสินค้าด้วยอุปกรณ์ที่ได้มาตรฐานของ FUZE POST",
    detail:
      "การเตรียมจัดสินค้าให้พร้อมก่อนการจัดส่ง โดยควรตรวจสอบความสะอาดและความปลอดภัยของสินค้า",
  },
  {
    head: "ส่งสินค้าถึงมือลูกค้า",
    detail:
      "การเตรียมจัดสินค้าให้พร้อมก่อนการจัดส่ง โดยควรตรวจสอบความสะอาดและความปลอดภัยของสินค้า",
  },
];

const AccordionList = ({ banners = [] }) => {
  return (
    <>
      <div className="container mx-auto px-3 sm:px-12 mt-7 sm:mt-10 sm:mb-10">
        <div className="flex justify-between items-center  p-1 rounded-md mb-5">
          <h3 className="text-left text-blue-900 font-extrabold text-xl sm:text-3xl">
            ขั้นตอนการใช้บริการ
          </h3>{" "}
          {/* <button className="text-right  bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary">
            ดูทั้งหมด
          </button> */}
        </div>
        <div className="sm:flex w-full">
          {/* คอลัมน์ซ้าย (2 ส่วน) */}
          <div className="flex-2 basis-2/5 bg-white p-4">
            <img src="/assets/images/home/service-img.png" />
          </div>

          {/* คอลัมน์ขวา (3 ส่วน) */}
          <div className="flex-3 basis-3/5 bg-white-200 p-4 pt-0">
            {ServiceStep.map((item, index) => {
              return (
                <>
                  <div className=" border-b border-gray-300">
                    {" "}
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <div
                            className={`flex flex-col w-full justify-between ${
                              open ? "rounded-bl-none rounded-br-none" : ""
                            }`}>
                            <Disclosure.Button
                              className={
                                "group flex w-full items-center justify-between py-3"
                              }>
                              <h3 className="text-left text-blue-900 font-extrabold text-xl ">
                                {index + 1}. {item.head}
                              </h3>
                              <ChevronDownIcon
                                className={
                                  open
                                    ? "rotate-180 transform h-6 w-8"
                                    : "h-6 w-8"
                                }
                              />
                            </Disclosure.Button>
                          </div>
                          <Disclosure.Panel
                            className={"w-full py-2 text-lg"}>
                            <p>{item.detail}</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccordionList;
