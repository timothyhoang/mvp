import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import GoogleMapsLoader from 'google-maps';
import apiKeys from '../config/google.js';
import initMapStyle from '../map_styles/style.js';
import InfoWindow from './InfoWindow.jsx';

class Visualizer extends React.Component {
  constructor(props) {
    super(props);

    this.circles = [];
    this.markers = [];
    this.map = null;
  }

  componentDidMount() {
    GoogleMapsLoader.KEY = apiKeys.GOOGLE_API_KEY;
    GoogleMapsLoader.LIBRARIES = ['places', 'geometry'];
    GoogleMapsLoader.load(google => {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(37.76487, -122.11948),
        disableDefaultUI: true,
        styles: initMapStyle()
      });

      google.maps.event.addListener(map, 'idle', () => {
        this.getData(map, [this.renderData.bind(this), this.props.updateDateTimeBounds]);
      });

      this.map = map;

      var input = document.getElementById('search');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener('places_changed', (function() {
        var places = this.searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
          if (!place.geometry) {
            return;
          }

          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.context.map.fitBounds(bounds);
      }).bind({context: this, searchBox: searchBox}));
    });
  }

  getData(map, cbs) {
    var bounds = map.getBounds();
    var NECorner = bounds.getNorthEast();
    var SWCorner = bounds.getSouthWest();

    $.ajax({
      method: 'GET',
      url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${SWCorner.lat()}&maxlatitude=${NECorner.lat()}&minlongitude=${SWCorner.lng()}&maxlongitude=${NECorner.lng()}`,
      contentType: 'application/json',
      success: (data) => {
        this.data = data.features;
        cbs.forEach(cb => cb(map, data));
      }
    });
  }

  renderData(map, data) {
    this.clearCircles();
    data.features.map(data => {
      var circle = new google.maps.Circle({
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.35 - data.geometry.coordinates[2] / 100,
        center: {lat: data.geometry.coordinates[1], lng: data.geometry.coordinates[0]},
        radius: 0,
        map: map,
        data: data
      });
      circle.addListener('click', this.displayData.bind({context: this, map: map, circle: circle}));
      this.circles.push(circle);
    });
    this.animateCircles();
  }

  displayData() {
    var infoWindow = new google.maps.InfoWindow;
    var div = document.createElement('div');
    ReactDOM.render(<InfoWindow data={this} />, div);
    infoWindow.setContent(div);
    infoWindow.setPosition({lat: this.circle.data.geometry.coordinates[1], lng: this.circle.data.geometry.coordinates[0]});
    infoWindow.open(this.map);
  }

  saveData() {
    $.ajax({
      method: 'POST',
      url: '/data',
      data: JSON.stringify({username: 'tim', data: this.circle.data}),
      contentType: 'application/json',
      success: (data) => {

      }
    });
  }

  animateCircles() {
    setInterval(() => {
      this.circles.map(circle => {
        circle.setRadius((circle.radius + 10) % (circle.data.properties.mag * 1000));
      });
    }, 10);    
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
      <div id="visualizer">
        <input id="search" type="text" />
        <div id="map"></div>
      </div>
    );
  }
}

export default Visualizer;