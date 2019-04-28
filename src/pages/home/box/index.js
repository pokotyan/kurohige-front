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

  getCss = enemyBox => {
    const {
      socket: { selectedBox },
    } = this.props;

    const isReserved = enemyBox.includes(this.props.id);
    const isSelected = selectedBox.includes(this.props.id);

    return cx({
      [style.base]: !isReserved && !isSelected,
      [style.isReserved]: isReserved,
      [style.isSelected]: isSelected,
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
    const parentClassName = this.getCss(enemyBox);
    const isMyTurn = this.isMyTurn();
    const isAlreadySelected = socket.selectedAllBox.includes(id);

    return isMyTurn && !isAlreadySelected ? (
      <div className={parentClassName} onClick={this.syncSelectStatus} />
    ) : (
      <div className={parentClassName} />
    );
  }
}
