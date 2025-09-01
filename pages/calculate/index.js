import Map from "@components/GoogleApi";
import TitleMenu from "@components/TitlePage";
import Link from "next/link";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";

const plans = [
  { name: "พัสดุทั่วไป", ram: "12GB", cpus: "6 CPUs", disk: "256GB SSD disk" },
  { name: "พัสดุแช่เย็น", ram: "16GB", cpus: "8 CPUs", disk: "512GB SSD disk" },
  { name: "พัสดุแช่แข็ง", ram: "32GB", cpus: "12 CPUs", disk: "1TB SSD disk" },
];

const calculatePage = () => {
  const [selected, setSelected] = useState(plans[0]);

  return (
    <div>
      <TitleMenu
        imageSrc="/assets/images/contact.webp"
        title="คำนวณค่าส่งพัสดุ"
        description="ติดต่อเรา"
      />
      {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
      <div className="container mx-auto px-4 mt-7 mb-7 gap-y-10 flex flex-col">
        <div className="rounded-lg shadow-lg border border-gray-300 p-5 bg-white">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            คำนวณค่าส่งพัสดุ
          </h3>
          <hr className="mb-5" />

          <div className="sm:flex">
            <div className="flex-1 py-3 rounded-lg ">
              <h3 className="text-lg font-bold">ประเภทพัสดุ:</h3>
            </div>

            {/* ฝั่งขวา (5 ส่วน) */}
            <div className="flex-[5] bg-white sm:py-3 rounded-lg sm:ml-5">
              <RadioGroup value={selected} onChange={setSelected}>
                <div className="sm:space-x-2 sm:flex ">
                  {plans.map((plan) => (
                    <RadioGroup.Option
                      key={plan.name}
                      value={plan}
                      className={({ active, checked }) =>
                        `relative shadow-md rounded-lg border-2 px-5 py-3 cursor-pointer flex mb-1`
                      }>
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {/* วงกลม Radio */}
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                                  checked
                                    ? "border-blue-primary"
                                    : "border-gray-400"
                                }`}>
                                {checked && (
                                  <div className="w-3 h-3 rounded-full bg-blue-primary"></div>
                                )}
                              </div>
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${
                                    checked
                                      ? "text-blue-primary"
                                      : "text-gray-900"
                                  }`}>
                                  {plan.name}
                                </RadioGroup.Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="sm:flex">
            <div className="flex-1 py-3 rounded-lg ">
              <h3 className="text-lg font-bold">สถานที่จัดส่ง:</h3>
            </div>

            {/* ฝั่งขวา (5 ส่วน) */}
            <div className="flex-[5] bg-white sm:py-3 rounded-lg sm:ml-5">
              <label className="fond-regular">ต้นทาง </label>
              <SelectComponent name="claimtype_id" label={"กรุณาเลือก"} />
              <div style={{ marginTop: "10px" }}>
                <label className="fond-regular">ปลายทาง </label>
                <SelectComponent name="claimtype_id" label={"กรุณาเลือก"} />
              </div>
            </div>
          </div>

          <div className="sm:flex">
            <div className="flex-1 py-3 rounded-lg">
              <h3 className="text-lg font-bold">ขนาดพัสดุ:</h3>
            </div>

            {/* ฝั่งขวา (5 ส่วน) */}
            <div className="flex-[5] bg-white sm:mt-3 mb-3 rounded-lg sm:ml-5 text-sm sm:text-base">
              <div className="flex w-full">
                {/* ส่วนที่ 1 (6 ส่วน) */}
                <div className="flex-[6] ">
                  <p>ความกว้าง (CM)</p>
                  <InputComponent
                    name="mobile"
                    label="เบอร์โทรศัพท์มือถือ"
                    placeholder={""}
                  />
                </div>

                {/* ส่วนที่ 2 (1 ส่วน) */}
                <div className="flex-[1] flex text-center justify-center  items-center pt-6">
                  X
                </div>

                {/* ส่วนที่ 3 (6 ส่วน) */}
                <div className="flex-[6]">
                  <p>ความยาว (CM)</p>
                  <InputComponent
                    name="mobile"
                    label="เบอร์โทรศัพท์มือถือ"
                    placeholder={""}
                  />
                </div>

                {/* ส่วนที่ 4 (1 ส่วน) */}
                <div className="flex-[1] flex text-center justify-center items-center pt-6">
                  X
                </div>

                {/* ส่วนที่ 5 (6 ส่วน) */}
                <div className="flex-[6]">
                  <p>ความสูง (CM)</p>
                  <InputComponent
                    name="mobile"
                    label="เบอร์โทรศัพท์มือถือ"
                    placeholder={""}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center  pt-5 rounded-md ">
            <button className="text-right  bg-blue-primary text-white px-4 py-2  rounded-lg hover:bg-blue-primary">
              คำนวณค่าส่งพัสดุ
            </button>
          </div>
        </div>
        <div className="rounded-lg shadow-lg border border-gray-300 p-5 bg-white">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            ค่าจัดส่งโดยประมาณ
          </h3>
          <hr className="mb-5" />
          <div className="overflow-auto">
            <table className="table-auto overflow-scroll w-full tableC">
              <thead>
                <tr>
                  <th className="text-sm sm:text-lg" width="70%">
                    Product
                  </th>
                  <th className="text-sm sm:text-lg" width="30%">
                    ค่าจัดส่งโดยประมาณ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="!text-sm sm:!text-lg">Parcel Weigh</td>
                  <td className="!text-sm sm:!text-lg">20 KG</td>
                </tr>
                <tr>
                  <td className="!text-sm sm:!text-lg">บริการแช่เย็นแบบมาตราฐาน</td>
                  <td className="!text-sm sm:!text-lg">500 THB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default calculatePage;
