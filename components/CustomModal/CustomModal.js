import { useState } from "react";

export default function CustomModal({ onClose, onConfirm, children }) {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className="fixed inset-0 z-[1000] overflow-y-auto">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                // onClick={() => onClose(false)}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                    <div className="relative w-full sm:w-2/4 p-4 mx-auto bg-white rounded-md shadow-lg">
                        {
                            children
                        }
                        <div className="items-center gap-2 mt-3 sm:flex">
                            <button
                                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                onClick={() =>
                                    onClose()
                                }
                            >
                                ยกเลิก
                            </button>
                            {onConfirm && <button
                                className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-secondary rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
                                onClick={() =>
                                    onConfirm()
                                }
                            >
                                ตกลง
                            </button>}

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}