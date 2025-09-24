import Image from "next/image";

const TitleMenu = ({ title = "", imageSrc = "", description = "", imageClass = "" }) => {
    return <div className="w-full bg-gradient-to-r from-green-600 to-green-400 h-24 sm:h-36 rounded-tl-full flex items-center shadow-lg">
        {/* {imageSrc && <img src={imageSrc} className={imageClass ? imageClass : `h-16 sm:h-20 ml-8 rounded-lg object-cover`} />} */}
        <div className="flex flex-col ml-16 sm:ml-24">
            <h1 className="text-xl sm:text-3xl text-white font-bold">{title}</h1>
            {description && <label className="text-green-100 text-sm sm:text-base mt-1">{description}</label>}
        </div>
    </div>
}

export default TitleMenu;