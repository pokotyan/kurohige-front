import React, { Component } from "react";
import cx from "classnames";
import style from "./style.css";

export default class Box extends Component {
  syncGameStatus = () => {
    const {
      socketActions,
      id,
      userId,
      roomId,
      p1,
    } = this.props;
    const nextTurn = p1 ? 'p2' : 'p1';

    socketActions.syncGameStatus({ // @todo syncSelectStatus
      boxId: id,
      userId,
      roomId,
    });

    socketActions.syncTurn({
      nextTurn,
      roomId,
    });
  }

  render() {
    const {
      reservedBox,
      selectedBox,
      userId,
      roomId,
      p1,
      p2,
      nextTurn
    } = this.props;
    const enemyBox = [];

    Object.keys(reservedBox).forEach(id => {
      if (id.includes(roomId) && !id.includes(userId)) {
        enemyBox.push(...reservedBox[id])
      }
    });

    const isReserved = enemyBox.includes(this.props.id);
    const isSelected = selectedBox.includes(this.props.id);

    let parentClassName = cx({
      [style.wrap]: !isReserved && !isSelected,
      [style.isReserved]: isReserved,
      [style.isSelected]: isSelected,
    });

    const me = p1 ? 'p1' : 'p2';
    const isMyTurn = (!enemyBox.length && !selectedBox.length) || nextTurn === me;

    return (
      isMyTurn ? (
        <div
          className={parentClassName}
          onClick={this.syncGameStatus}
        />
      ) : (
        <div
          className={parentClassName}
        />        
      )
    )
  }
}
