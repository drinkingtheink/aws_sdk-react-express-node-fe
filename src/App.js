import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.getMostRecentLogs()
      .then(res => this.setState({ data: res.payload }))
      .catch(err => console.log(err));
  }
  
  getMostRecentLogs = async () => {
    const response = await fetch('/get-logs');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <main className="App">
        <EnvironmentDisplay />

        <section className="log-display">
          { this.state.data }
        </section>
      </main>
    );
  }
}

export default App;