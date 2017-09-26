import React from 'react';

var InfoWindow = function(props) {
  return (
    <div id="info-window">
      <p>place: {props.data.circle.data.properties.place.toLowerCase()}</p>
      <p>location: (lat: {props.data.circle.data.geometry.coordinates[1]}, lng: {props.data.circle.data.geometry.coordinates[0]})</p>
      <p>magnitude: {props.data.circle.data.properties.mag}</p> 
      <p>depth: {props.data.circle.data.geometry.coordinates[2]}km</p>
      <p>date-time: {Date(props.data.circle.data.properties.time).toLowerCase()}</p> 
      <p>status: {props.data.circle.data.properties.status}</p> 
      <a href="#" onClick={props.data.context.saveData.bind(props.data)}>save</a>
    </div>
  );
};

export default InfoWindow;