import React from 'react';
import Navigation from './Navigation.jsx';
import Visualizer from './Visualizer.jsx';
import Controls from './Controls.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateTimeBounds: [0, 0]
    }
  }

  dateFormatter(datetime) {
    return Date(datetime) + `${datetime}`;
  }

  updateDateTimeBounds(map, data) {
    if (data.features.length === 0) {
      return;
    }

    var min = data.features[0].properties.time;
    var max = data.features[0].properties.time;
    data.features.forEach(datum => {
      if (min > datum.properties.time) {
        min = datum.properties.time;
      }
      if (max < datum.properties.time) {
        max = datum.properties.time;
      }
    });

    this.setState({dateTimeBounds: [min, max]});
  }

  render() {
    return (
      <div>
        <Navigation />
        <Visualizer updateDateTimeBounds={this.updateDateTimeBounds.bind(this)} />
        <Controls dateTimeBounds={this.state.dateTimeBounds} dateFormatter={this.dateFormatter} />
      </div>
    );
  }
}

export default App;