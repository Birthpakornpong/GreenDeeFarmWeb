import { useState } from "react";

export default function ImageModal({ onClose, onConfirm, children }) {
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
                    <div className="relative w-full sm:w-2/4 p-4 mx-auto rounded-md">
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        </>
    );
}