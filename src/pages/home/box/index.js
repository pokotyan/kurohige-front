import React, { Component } from 'react';
import cx from 'classnames';
import style from './style.css';

export default class Box extends Component {
  syncSelectStatus = () => {
    const {
      socketActions,
      gameActions,
      id,
      userId,
      roomId,
      p1,
      socket: { selectedBox },
    } = this.props;
    const nextTurn = p1 ? 'p2' : 'p1';

    socketActions.syncSelectStatus({
      boxId: id,
      userId,
      roomId,
    });

    socketActions.syncTurn({
      nextTurn,
      roomId,
    });

    gameActions.judgeGame({
      currentSelectBox: [...selectedBox, id],
    });
  };

  isMyTurn = () => {
    const { p1, nextTurn } = this.props;

    const me = p1 ? 'p1' : 'p2';
    return nextTurn === me;
  };

  render() {
    const { id, socket, userId, roomId } = this.props;
    const enemyBox = socket.getEnemyBox({ userId, roomId });
    const { isEnemyBox, isMyBox } = socket.getBoxType({ enemyBox, boxId: id });
    const boxCss = cx({
      [style.base]: !isEnemyBox && !isMyBox,
      [style.isEnemyBox]: isEnemyBox,
      [style.isMyBox]: isMyBox,
    });

    const isMyTurn = this.isMyTurn();
    const isAlreadySelected = socket.selectedAllBox.includes(id);

    return isMyTurn && !isAlreadySelected ? (
      <div className={boxCss} onClick={this.syncSelectStatus} />
    ) : (
      <div className={boxCss} />
    );
  }
}
