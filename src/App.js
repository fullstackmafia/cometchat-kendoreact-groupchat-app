import React from 'react';

class App extends React.Component {
  constructor(){
    super();

    this.state = {
      info: [],
    }
  };

  componentDidMount() {
    const API = "5327f1d2dd284b90914d421702c5ca9c";
    fetch(`http://api1.5sim.net/stubs/handler_api.php?api_key=${API}&action=getBalance`)
    .then(response => {
      console.log(response);
      return response.json;
    }).then(data => {
      console.log(data)
    }) 

  }

  render() {
    return (
      <div>
        <h4>Good</h4>
      </div>
    )
  }
}

export default App;