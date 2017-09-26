import React from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider'; 
import 'rc-slider/assets/index.css';

var Controls = function(props) {
  const SliderWithTooltip = createSliderWithTooltip(Slider);
  return (
    <div id="controls" style={{ width: '90%' }}>
      <SliderWithTooltip tipFormatter={props.dateFormatter} min={props.dateTimeBounds[0]} max={props.dateTimeBounds[1]} />
    </div>
  );
};

export default Controls;