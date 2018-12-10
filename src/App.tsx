import * as React from 'react';
import { interval } from 'rxjs';
import './App.css';
import logo from './logo.svg';


class App extends React.Component {
  public state = {  
    num: 0
  }
  public componentDidMount() {
    interval(1000).subscribe((num: number)=>{
      this.setState({num});
    })
  }
  public render() {
    console.log(this.state.num)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React + {this.state.num}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
