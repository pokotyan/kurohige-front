import React from 'react';
import style from './style.css';

const EndGame = ({ isEndGame, message }) => {
  return (
    <div>
      {isEndGame ? (
        <div className={style.container}>
          <div className={style.boxInner}>
            <div className={style.boxBg}>{message}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EndGame;
