import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import style from './style.css';

export default class Box extends Component {
  static getInitialProps() {
    return {
      socket: {
        reservedBox: {},
        selectedBox: [],
      },
    };
  }

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

  getEnemyBox({ userId, roomId, reservedBox }) {
    const enemyBox = [];

    Object.keys(reservedBox).forEach(id => {
      // ルームが同じで自分ではない => 相手の選んでいるbox
      if (id.includes(roomId) && !id.includes(userId)) {
        enemyBox.push(...reservedBox[id]);
      }
    });

    return _.uniq(enemyBox);
  }

  getBoxType({ enemyBox, boxId, selectedBox }) {
    const isEnemyBox = enemyBox.includes(boxId);
    const isMyBox = selectedBox.includes(boxId);

    return {
      isEnemyBox,
      isMyBox,
    };
  }

  getSelectedAllBox(reservedBox) {
    const selectedAllBox = [];

    Object.keys(reservedBox).forEach(userRoomId => {
      selectedAllBox.push(...reservedBox[userRoomId]);
    });

    return _.uniq(selectedAllBox);
  }

  render() {
    const {
      id,
      socket: { reservedBox, selectedBox },
      userId,
      roomId,
      p1,
      p2,
    } = this.props;
    const enemyBox = this.getEnemyBox({ userId, roomId, reservedBox });
    const { isEnemyBox, isMyBox } = this.getBoxType({
      enemyBox,
      boxId: id,
      selectedBox,
    });
    const boxCss = cx({
      [style.base]: !isEnemyBox && !isMyBox,
      [style.isEnemyBoxBlack]: isEnemyBox && p2,
      [style.isEnemyBoxWhite]: isEnemyBox && p1,
      [style.isMyBoxBlack]: isMyBox && p1,
      [style.isMyBoxWhite]: isMyBox && p2,
    });

    const isMyTurn = this.isMyTurn();
    const selectedAllBox = this.getSelectedAllBox(reservedBox);
    const isAlreadySelected = selectedAllBox.includes(id);

    return isMyTurn && !isAlreadySelected ? (
      <div className={boxCss} onClick={this.syncSelectStatus} />
    ) : (
      <div className={boxCss} />
    );
  }
}
