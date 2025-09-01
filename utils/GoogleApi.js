import { GoogleApiWrapper } from 'google-maps-react';

// ...

export class MapContainer extends React.Component { }

export default GoogleApiWrapper({
    apiKey: "AIzaSyCSEmlBmLYhIzl7Vm"
})(MapContainer)