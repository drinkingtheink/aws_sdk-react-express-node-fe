import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import LogStream from './components/LogStream';

class App extends Component {
  state = {
    logs: null
  };

  componentDidMount() {
    this.getMostRecentLogs()
      .then(res => this.setState({ logs: res.payload }))
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
          { this.state.logs && this.state.logs.length > 0
            ? <LogStream logs={ this.state.logs } />
            : null
          }
        </section>
      </main>
    );
  }
}

export default App;