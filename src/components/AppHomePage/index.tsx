import Button from "@material-ui/core/Button";
import * as React from "react";
import { LiteButton } from 'src/shared/components/Lite';
import * as styles from "./styles.scss";
const { PlayButton, ...other} = require('react-soundplayer/components');

class AppHomePage extends React.Component {
  
  public state = {
    num: 0
  }
  public onClick = (e: any) => {
    this.setState({num: this.state.num+1});
  }
  public render() {
    console.log(this.state.num, other);
    return (
      <>
        <Button variant='contained' component={PlayButton}>Player</Button>
        <div className={styles.container} onClick={this.onClick}>
          <ol>
            <li><LiteButton type='contained' color='primary' routerLink="/counter">Counter</LiteButton></li>
            <li><LiteButton type='contained' color='secondary' routerLink="/echartsTest/test">Echarts</LiteButton></li>
          </ol>
        </div>
      </>
    );
  }
}

export { AppHomePage };

