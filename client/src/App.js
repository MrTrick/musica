import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    metadata: []
  };

  getIndex = async() => {
    const response = await fetch('/musica');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    this.getIndex()
      .then(res => this.setState({ metadata: res }))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <h1>MUSICA</h1>
        <ul>
          {this.state.metadata.map((item)=>
            <li key={item.id}><a href={item.src.mp3}>{item.title} {item.author}</a></li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
