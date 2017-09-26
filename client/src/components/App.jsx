import React from 'react';
import Navigation from './Navigation.jsx';
import Visualizer from './Visualizer.jsx';
import Controls from './Controls.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navigation />
        <Visualizer />
        <Controls />
      </div>
    );
  }
}

export default App;