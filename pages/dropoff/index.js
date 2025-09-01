import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import { Tab } from "@headlessui/react";
import ApiMasters from "api/ApiMasters";
import { promises as fs } from "fs";
import Head from "next/head";
import path from "path";
import { useEffect, useState } from "react";
import validator from "validator";
import useIsMobile from "../useIsMobile";
const DropoffPage = ({ dropoff = [], addresses = [] }) => {
  const [thAddress, setThAddress] = useState([]);
  const [state, setstate] = useState({
    sender_code: "",
  });
  //console.log('area_zone', area_zone);
  useEffect(() => {
    let thAddressList = [];
    addresses.map((item, index) => {
      item.subDistrictList.map((subitem, subIndex) => {
        let district = item.districtList.find(
          (x) => x.districtId == subitem.districtId
        );
        let province = item.provinceList.find(
          (x) => x.provinceId == subitem.provinceId
        );
        thAddressList.push({
          value: `${item.zipCode}_${subitem.subDistrictName}_${district.districtName}_${province.provinceName}`,
          label: `${item.zipCode}, ${subitem.subDistrictName}, ${district.districtName}, ${province.provinceName}`,
        });
      });
    });
    setThAddress(thAddressList);
  }, []);

  return (
    <div>
      <Head>
        <title>พื้นที่บริการจัดส่งสินค้า</title>
        <meta
          name="description"
          content="พื้นที่บริการจัดส่งสินค้า - Fuze Application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TitleMenu
        title={"จุดให้บริการ"}
        imageClass={"h-20 sm:h-28"}
        imageSrc="/assets/images/addressTitle.webp"
        description=""
      />

      <div className="container mx-auto px-0 sm:px-4 mt-7 sm:mt-7 flex flex-col gap-y-10">
        <div className="w-full relative">
          <SelectComponent
            label={"รหัสไปรษณีย์"}
            onChange={(e) => {
              let codeSplit = e?.value?.split("_");
              if (codeSplit?.length > 0) {
                setstate({
                  ...state,
                  sender_code: e?.value,
                  // sender_zipcode: codeSplit[0],
                  // sender_subdistrict: codeSplit[1],
                  // sender_district: codeSplit[2],
                  // sender_province: codeSplit[3]
                });
              } else {
                setstate({
                  ...state,
                  sender_code: e?.value,
                  // sender_zipcode: "",
                  // sender_subdistrict: "",
                  // sender_district: "",
                  // sender_province: ""
                });
              }
            }}
            value={state.sender_code ?? ""}
            options={thAddress}
          />
        </div>
        <DropoffPoint state={state} dropoff={dropoff} />
      </div>
    </div>
  );
};

const DropoffPoint = ({
  dropoff = [],
  state = {
    sender_code: "",
  },
}) => {
  let [categories] = useState({
    "ไปรษณีย์ไทย (Thailand Post)": [],
    "แฟลช (Flash)": [],
    "ฟิ้วซ์ โพสต์ (Fuze Post)": [],
  });

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {}, [state]);

  const isMobile = useIsMobile();

  return (
    <div className="w-full px-0 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex flex-col sm:flex-row justify-start rounded-xl bg-white p-1 flex-wrap">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2.5 text-sm  font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400",
                  selected
                    ? "bg-white text-blue-900 border-b-2 border-blue-900 sm:text-xl"
                    : "text-gray-500 hover:bg-white/[0.12] hover:text-blue sm:text-lg"
                )
              }>
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white/60 ring-offset-2 ring-offset-blue-400",
                "p-0"
              )}>
              <div className="overflow-auto">
                <table className="table-auto overflow-scroll w-full tableAUp">
                  <thead>
                    <tr>
                      <th className="text-sm sm:text-lg" width="15%">
                        Drop Off
                      </th>
                      <th className="text-sm sm:text-lg" width="20%">
                        เบอร์ติดต่อ
                      </th>
                      <th className="text-sm sm:text-lg" width="50%">
                        ที่อยู่
                      </th>
                      {!isMobile && (
                        <th className="text-sm sm:text-lg" width="15%">
                          แผนที่
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {idx == 0 &&
                      dropoff
                        .filter(
                          (x) =>
                            x.drotype == "C01" &&
                            (!state.sender_code ||
                              state.sender_code.split("_")[0] == x.zipcode)
                        )
                        .map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="!text-sm sm:!text-lg">
                                {isMobile ? (
                                  <a
                                    rel="noreferrer"
                                    className="text-link text-blue-500"
                                    target="_blank"
                                    href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}>
                                    {item.droname}
                                  </a>
                                ) : (
                                  item.droname
                                )}
                              </td>
                              <td className="!text-sm sm:!text-lg">
                                {item.drotel ? item.drotel : "-"}
                              </td>
                              <td className="!text-sm sm:!text-lg">{`${item.droaddress} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</td>
                              {!isMobile && (
                              <td className="!text-sm sm:!text-lg">
                                <a
                                  rel="noreferrer"
                                  target="_blank"
                                  href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}
                                  className="block border border-gray-300 px-5 py-2 rounded-md hover:shadow-lg mr-2">
                                  <div className="flex justify-center items-center">
                                    <img
                                      className="w-5 mr-2"
                                      src="/assets/contact/map.png"
                                      alt="Map"
                                    />
                                    <h5>ดูแผนที่</h5>
                                  </div>
                                </a>
                              </td>
                              )}
                            </tr>
                          );
                        })}
                    {idx == 1 &&
                      dropoff
                        .filter(
                          (x) =>
                            x.drotype == "C02" &&
                            (!state.sender_code ||
                              state.sender_code.split("_")[0] == x.zipcode)
                        )
                        .map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {isMobile ? (
                                  <a
                                    rel="noreferrer"
                                    target="_blank"
                                    className="text-link text-blue-500"
                                    href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}>
                                    {item.droname}
                                  </a>
                                ) : (
                                  item.droname
                                )}
                              </td>
                              <td>{item.drotel ? item.drotel : "-"}</td>
                              <td>{`${item.droaddress} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</td>
                              {!isMobile && (
                                <td>
                                  <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}
                                    className="block border border-gray-300 px-5 py-2 rounded-md hover:shadow-lg mr-2">
                                    <div className="flex justify-center items-center">
                                      <img
                                        className="w-5 mr-2"
                                        src="/assets/contact/map.png"
                                        alt="Map"
                                      />
                                      <h5>ดูแผนที่</h5>
                                    </div>
                                  </a>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                    {idx == 2 &&
                      dropoff
                        .filter(
                          (x) =>
                            x.drotype == "C03" &&
                            (!state.sender_code ||
                              state.sender_code.split("_")[0] == x.zipcode)
                        )
                        .map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {isMobile ? (
                                  <a
                                    rel="noreferrer"
                                    target="_blank"
                                    className="text-link text-blue-500"
                                    href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}>
                                    {item.droname}
                                  </a>
                                ) : (
                                  item.droname
                                )}
                              </td>
                              <td>{item.drotel ? item.drotel : "-"}</td>
                              <td>{`${item.droaddress} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</td>
                              {!isMobile && (
                                  <td>
                                    <a
                                      rel="noreferrer"
                                      target="_blank"
                                      href={`https://maps.google.com/?q=${item.drolatitude},${item.drolongtitude}`}
                                      className="block border border-gray-300 px-5 py-2 rounded-md hover:shadow-lg mr-2">
                                      <div className="flex justify-center items-center">
                                        <img
                                          className="w-5 mr-2"
                                          src="/assets/contact/map.png"
                                          alt="Map"
                                        />
                                        <h5>ดูแผนที่</h5>
                                      </div>
                                    </a>
                                  </td>
                                )}
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const jsonDirectory = path.join(process.cwd(), "json");
  const result = await ApiMasters.getDropOff();
  const addressJson = await fs.readFile(
    jsonDirectory + "/th-address.json",
    "utf8"
  );
  return {
    props: {
      dropoff: result.data,
      addresses: JSON.parse(addressJson),
    },
  };
}

export default DropoffPage;
