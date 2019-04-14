import React, { Component } from "react";
import cx from "classnames";
import style from "./style.css";

export default class Box extends Component {
  syncReserve = () => {
    this.props.socketActions.syncReserve({
      boxId: this.props.id,
      userId: this.props.userId,
      roomId: this.props.roomId
    });
  }

  render() {
    const {
      reservedBox,
      selectedBox,
      userId,
      roomId,
    } = this.props;
    // todo reservedAllBoxもstoreに持つようにしないと別roomのブロードキャストでリセットされる。
    const reservedAllBox = [];

    Object.keys(reservedBox).forEach(id => {
      if (id.includes(roomId) && !id.includes(userId)) {
        reservedAllBox.push(...reservedBox[id])
      }
    });

    const isReserved = reservedAllBox.includes(this.props.id);
    const isSelected = selectedBox.includes(this.props.id);

    let parentClassName = cx({
      [style.wrap]: !isReserved && !isSelected,
      [style.isReserved]: isReserved,
      [style.isSelected]: isSelected,
    });

    return (
      <div
        className={parentClassName}
        onClick={this.syncReserve}
      />
    )
  }
}
