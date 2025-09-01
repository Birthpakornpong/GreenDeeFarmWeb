import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Link from "next/link";

const BannerSlide = ({ banners = [] }) => {
    return <Carousel autoPlay infiniteLoop dynamicHeight={false} showThumbs={false}>
        {
            banners.map((item, index) => {
                return (
                    // <a key={"banner-" + item.id} target="_blank" href={item.link_relate} rel="noopener noreferrer">
                    <div key={"banner-" + item.id} >
                        <img className="object-cover"
                            src={process.env.IMAGE_BACKEND_URL + item.image} />
                    </div>
                    // </a>
                    // <Link href={item.link_relate} passHref={true}>

                    // </Link>
                )
            })
        }
    </Carousel>
}

export default BannerSlide;