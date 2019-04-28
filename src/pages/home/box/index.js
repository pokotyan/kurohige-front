import React, { Component } from 'react';
import _ from 'lodash';
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
      selectedBox,
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

  getEnemyBox = () => {
    const { reservedBox, userId, roomId } = this.props;
    const enemyBox = [];

    Object.keys(reservedBox).forEach(id => {
      // ルームが同じで自分ではない => 相手の選んでいるbox
      if (id.includes(roomId) && !id.includes(userId)) {
        enemyBox.push(...reservedBox[id]);
      }
    });

    return _.uniq(enemyBox);
  };

  getSelectedAllBox = () => {
    const { reservedBox } = this.props;
    const selectedAllBox = [];

    Object.keys(reservedBox).forEach(userRoomId => {
      selectedAllBox.push(...reservedBox[userRoomId]);
    });

    return _.uniq(selectedAllBox);
  };

  getCss = enemyBox => {
    const { selectedBox } = this.props;

    const isReserved = enemyBox.includes(this.props.id);
    const isSelected = selectedBox.includes(this.props.id);

    return cx({
      [style.wrap]: !isReserved && !isSelected,
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
    const { id } = this.props;
    const enemyBox = this.getEnemyBox();
    const parentClassName = this.getCss(enemyBox);
    const isMyTurn = this.isMyTurn();
    const selectedAllBox = this.getSelectedAllBox();
    const isAlreadySelected = selectedAllBox.includes(id);

    return isMyTurn && !isAlreadySelected ? (
      <div className={parentClassName} onClick={this.syncSelectStatus} />
    ) : (
      <div className={parentClassName} />
    );
  }
}
