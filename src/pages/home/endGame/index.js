import React, { Component } from 'react';
import style from './style.css';

class EndGame extends Component {
  goToTop = () => {
    // SPAの遷移だと、消したはずのsessionStrageがなぜか蘇るため、通常の画面遷移
    window.location.replace('/');
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

export default EndGame;
