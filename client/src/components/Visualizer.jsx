import React from 'react';
import $ from 'jquery';
import GoogleMapsLoader from 'google-maps';
import apiKeys from '../config/google.js';
import initMapStyle from '../map_styles/style.js';

class Visualizer extends React.Component {
  constructor(props) {
    super(props);

    this.circles = [];
    this.data = [];
  }

  componentDidMount() {
    GoogleMapsLoader.KEY = apiKeys.GOOGLE_API_KEY;
    GoogleMapsLoader.load(google => {
      var map = new google.maps.Map(document.getElementById('visualizer'), {
        zoom: 10,
        center: new google.maps.LatLng(37.76487, -122.11948),
        disableDefaultUI: true,
        styles: initMapStyle()
      });

      google.maps.event.addListener(map, 'idle', () => {
        this.getData(map, this.renderData.bind(this));
      });
    });
  }

  getData(map, cb) {
    var bounds = map.getBounds();
    var NECorner = bounds.getNorthEast();
    var SWCorner = bounds.getSouthWest();

    $.ajax({
      method: 'GET',
      url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${SWCorner.lat()}&maxlatitude=${NECorner.lat()}&minlongitude=${SWCorner.lng()}&maxlongitude=${NECorner.lng()}`,
      contentType: 'application/json',
      success: (data) => {
        this.data = data.features;
        cb(map, data);
      }
    });
  }

  renderData(map, data) {
    this.clearCircles();
    data.features.map(data => {
      var circle = new google.maps.Circle({
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        center: {lat: data.geometry.coordinates[1], lng: data.geometry.coordinates[0]},
        radius: 0,
        map: map
      });
      this.circles.push(circle);
    });

    setInterval(() => {
      this.circles.map((circle, index) => {
        circle.setRadius((circle.radius + 10) % (this.data[index].properties.mag * 1000));
      });
    }, 1);  
  }

  clearCircles() {
    this.circles.map(circle => {
      circle.setMap(null);
      circle = null;
    });
    this.circles = [];
  }

  render() {
    return (
      <div id="visualizer"></div>
    );
  }
}

export default Visualizer;