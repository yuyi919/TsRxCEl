import { inject, observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { RootStore } from "../../shared/stores";

import * as styles from "./styles.scss";

@inject("appState")
@observer
class CounterPage extends React.Component<{appState:RootStore}, {}> {

  public render() {
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x"/>
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {this.props.appState.counter.value}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={this.increment}>
            <i className="fa fa-plus" />
          </button>
          <br/>
          <button className={styles.btn} onClick={this.decrement}>
            <i className="fa fa-minus" />
          </button>
        </div>
      </div>
    );
  }

  private increment = () => {
    this.props.appState.counter.increment();
  }

  private decrement = () => {
    this.props.appState.counter.decrement();
  }

}

export { CounterPage };
