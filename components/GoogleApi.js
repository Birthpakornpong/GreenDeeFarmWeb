// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import GoogleMapReact from 'google-map-react';
import { useState } from 'react';
const AnyReactComponent = ({ text }) =>
    <div className='absolute gap-x-4 top-[50%] left-[50%] w-12 h-12 '>
        <div className='gap-x-1 items-center whitespace-nowrap'>
            <LocationMarkerIcon className='h-8 w-6 text-red-default' />
            <span>{text}</span>
        </div>
    </div>;
const InfoWindow = ({ text }) => <div className='flex gap-x-2 border absolute top-[20px] left-[20px] bg-white sm:p-5 p-2 sm:text-sm sm:w-80 w-40 text-xs' >
    <LocationMarkerIcon className='h-12 w-12 text-red-default sm:block hidden' />
    <div dangerouslySetInnerHTML={{ __html: text }}></div>
</div>;

// const MapContainer = ({ google,
//     onMarkerClick = () => { },
//     onInfoWindowClose = () => {

//     } }) => {
//     const [state, setstate] = useState(
//         { name: "ฟิ้วส์ โพส จำกัด (มหาชน)" }
//     );
//     const containerStyle = {
//         position: 'relative',
//         width: '100%',
//         height: '100%'
//     }
//     return <Map initialCenter={{
//         lat: 13.6434396,
//         lng: 100.6873104
//     }}
//         //containerStyle={containerStyle}
//         //style={{ width: '100%', height: 'none', position: 'none' }}
//         className={'!w-full !h-80 !relative'}
//         google={google} zoom={14}>

//         <Marker onClick={onMarkerClick}
//             name={'ฟิ้วส์ โพส จำกัด (มหาชน)'} />
//         <InfoWindow
//             marker={<Marker onClick={onMarkerClick}
//                 name={'ฟิ้วส์ โพส จำกัด (มหาชน)'} />}
//             visible={true}
//             style={{
//                 height: 200,
//                 width: 200
//             }}
//         >
//             <div>
//                 <p>ฟิ้วส์ โพส จำกัด (มหาชน)</p>
//             </div>
//         </InfoWindow>
//     </Map>
// }

// export default GoogleApiWrapper({
//     apiKey: ("AIzaSyAKhKSojvXTT6z4qH6mb3WGZDebiDKxP2U")
// })(MapContainer)

const MapContainer = () => {
    const defaultProps = {
        center: {
            lat: 13.888918901121174,
            lng: 100.57155169480801
        },
        zoom: 19
    };
    return <div className={'!w-full !h-[500px] !relative'}
        style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyAwNgfaZvldEjVXEGQYLMv4SI80LjFzVVw" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
        >
            <AnyReactComponent
                lat={defaultProps.center.lat}
                lng={defaultProps.center.lng}
                text="ศูนย์กระจายสินค้า FUZE Post"
            />

        </GoogleMapReact>
        <InfoWindow
            lat={defaultProps.center.lat}
            lng={defaultProps.center.lng}
            text="<b>Fuze Post (ฟิ้วโพตส์)</b> <br/> 111 ถ. แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210"
        />

    </div>
}

export default MapContainer