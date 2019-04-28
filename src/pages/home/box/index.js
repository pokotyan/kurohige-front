import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import style from './style.css';

const judgeGame = currentSelectBox => {
  // boxIdは `${y}:${x}`

  currentSelectBox.forEach(boxId => {
    let [y, x] = boxId.split(':');
    let curY = parseInt(y, 10);
    let curX = parseInt(x, 10);

    const countY = currentSelectBox.filter(boxId => {
      return (
        boxId === `${curY}:${curX}` ||
        boxId === `${curY + 1}:${curX}` ||
        boxId === `${curY + 2}:${curX}` ||
        boxId === `${curY + 3}:${curX}` ||
        boxId === `${curY + 4}:${curX}`
      );
    }).length;

    const countX = currentSelectBox.filter(boxId => {
      return (
        boxId === `${curY}:${curX}` ||
        boxId === `${curY}:${curX + 1}` ||
        boxId === `${curY}:${curX + 2}` ||
        boxId === `${curY}:${curX + 3}` ||
        boxId === `${curY}:${curX + 4}`
      );
    }).length;

    const countHidariNaname = currentSelectBox.filter(boxId => {
      return (
        boxId === `${curY}:${curX}` ||
        boxId === `${curY + 1}:${curX + 1}` ||
        boxId === `${curY + 2}:${curX + 2}` ||
        boxId === `${curY + 3}:${curX + 3}` ||
        boxId === `${curY + 4}:${curX + 4}`
      );
    }).length;

    const countMigiNaname = currentSelectBox.filter(boxId => {
      return (
        boxId === `${curY}:${curX}` ||
        boxId === `${curY + 1}:${curX - 1}` ||
        boxId === `${curY + 2}:${curX - 2}` ||
        boxId === `${curY + 3}:${curX - 3}` ||
        boxId === `${curY + 4}:${curX - 4}`
      );
    }).length;

    if (countY === 5) {
      window.alert('縦に並んだ');
    }

    if (countX === 5) {
      window.alert('横に並んだ');
    }

    if (countHidariNaname === 5) {
      window.alert('左斜めに並んだ');
    }

    if (countMigiNaname === 5) {
      window.alert('右斜めに並んだ');
    }
  });
};

export default class Box extends Component {
  syncSelectStatus = () => {
    const { socketActions, id, userId, roomId, p1, selectedBox } = this.props;
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

    judgeGame([...selectedBox, id]);
  };

  getEnemyBox = () => {
    const { reservedBox, userId, roomId } = this.props;
    const enemyBox = [];

    Object.keys(reservedBox).forEach(id => {
      if (id.includes(roomId) && !id.includes(userId)) {
        enemyBox.push(...reservedBox[id]);
      }
    });

    return _.uniq(enemyBox);
  };

  getSelectedAllBox = () => {
    const { reservedBox } = this.props;
    const selectedAllBox = [];

    Object.keys(reservedBox).forEach(id => {
      selectedAllBox.push(...reservedBox[id]);
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
