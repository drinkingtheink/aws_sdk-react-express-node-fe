import React, { Component } from 'react';
import './App.css';

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.getMostRecentLogs()
      .then(res => this.setState({ data: res.express }))
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
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">D&B Configurable Log System</h2>
        </header>
        <p className="App-intro">{ this.state.data }</p>
      </div>
    );
  }
}

export default App;