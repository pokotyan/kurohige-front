import React, { Component } from 'react';
import { withRouter } from 'next/router';
import style from './style.css';

class EndGame extends Component {
  goToTop = () => {
    const { router } = this.props;

    router.push('/');
  };

  render() {
    const { isEndGame, message } = this.props;

    return (
      <div>
        {isEndGame ? (
          <div className={style.container}>
            <div className={style.boxInner}>
              <div className={style.boxBg}>
                {message}
                <div className={style.goToTop} onClick={this.goToTop}>
                  トップに戻る
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(EndGame);
