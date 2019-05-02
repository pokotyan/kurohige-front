import React, { Component } from 'react';
import cx from 'classnames';
import style from './style.css';

export default class Box extends Component {
  syncSelectStatus = async () => {
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

    await socketActions.syncSelectStatus({
      boxId: id,
      userId,
      roomId,
    });

    await gameActions.judgeGame({
      currentSelectBox: [...selectedBox, id],
    });

    await socketActions.syncTurn({
      nextTurn,
      roomId,
    });
  };

  isMyTurn = () => {
    const { p1, nextTurn } = this.props;

    const me = p1 ? 'p1' : 'p2';
    return nextTurn === me;
  };

  render() {
    const { id, socket, userId, roomId, p1, p2 } = this.props;
    const enemyBox = socket.getEnemyBox({ userId, roomId });
    const { isEnemyBox, isMyBox } = socket.getBoxType({ enemyBox, boxId: id });
    const boxCss = cx({
      [style.base]: !isEnemyBox && !isMyBox,
      [style.isEnemyBoxBlack]: isEnemyBox && p2,
      [style.isEnemyBoxWhite]: isEnemyBox && p1,
      [style.isMyBoxBlack]: isMyBox && p1,
      [style.isMyBoxWhite]: isMyBox && p2,
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
