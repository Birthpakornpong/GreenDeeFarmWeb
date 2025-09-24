import TitleMenu from "@components/TitlePage";
import ApiNews from "api/ApiNews";
import "quill/dist/quill.snow.css";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

const ParcelPage = ({ result = [] }) => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  const [faqSelect, setFaqSelect] = useState(result[0].id || 0);

  const scrollTo = (ref) => {
    const violation = document.getElementById(ref);
    let rect = violation.getBoundingClientRect();
    window.scrollTo({
      top:
        rect.top < 0
          ? rect.top + window.scrollY
          : rect.top + window.scrollY - 100,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <TitleMenu
     
          title="ส่งสินค้าควบคุมอุณหภูมิ  (Parcel)"
          
      />
      <div className="flex flex-col sm:flex-row sm:px-20 sm:gap-10">
        <div
          className="flex flex-col px-5 py-7 sm:py-10 gap-3"
          style={{ width: "25rem" }}>
          {/* {result.map((item) => {
            return (
              <button
                key={`button_` + item.id}
                className="flex justify-between gap-5 px-4 py-5 border-2 rounded-[20px]"
                onClick={() => {
                  scrollTo(`content_` + item.id);
                }}
              >
                <div className="text-left text-blue-primary font-bold">
                  {item.question}
                </div>
                <div className="shrink-0">
                  <img
                    src="/assets/icons/arrow-right-long-duotone.svg"
                    alt="arrow-right"
                    className="text-blue-secondary w-5 sm:w-7"
                  />
                </div>
              </button>
            );
          })} */}
          {[1,2,3,4].map((item, index) => {
            return (
              <>
                <div className="gap-5 border-b border-gray-300">
                  <Disclosure defaultOpen={index === 0}>
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
                            <span className="text-left  font-extrabold text-2xl flex-1">
                              สินค้าควบคุมอุณหภูมิ
                            </span>
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
                          className={"w-full px-3 pb-3 text-md"}>
                          {result.map((item) => {
                            return (
                              <div
                                key={`parcel_item_${item.id}`}
                                className={`text-left  font-bold py-3 ${
                                  item.id == faqSelect
                                    ? "text-blue-primary text-xl"
                                    : ""
                                }
                      }`}
                                onClick={async () => {
                                  await setFaqSelect(item.id);
                                  scrollTo(`content_` + item.id);
                                }}>
                                <span
                                  className={`text-2xl mr-1 ${
                                    item.id == faqSelect ? "" : "hidden"
                                  }`}>
                                  •
                                </span>{" "}
                                {item.question}
                              </div>
                            );
                          })}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </>
            );
          })}
        </div>
        <div className="flex flex-col  sm:mt-3">
          {result.map((item, index) => {
            return (
              <div
                id={`content_` + item.id}
                key={`content_` + item.id}
                className={`${item.id == faqSelect ? "flex" : "hidden"}`}>
                <div className="py-10">
                  <div className="px-5">
                    <div className="text-xl font-bold">{item.question}</div>
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                  </div>
                </div>
                {index < result.length - 1 && (
                  <hr className="ml-5 border-[1px] border-blue-secondary border-dashed" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const result = await ApiNews.getFAQ();
  return {
    props: {
      result: result.data,
    },
  };
}

export default ParcelPage;
