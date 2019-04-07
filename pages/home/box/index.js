import React, { Component } from "react";
import cx from "classnames";
import style from "./style.css";

export default class Box extends Component {
  syncReserve = () => {
    this.props.socketActions.syncReserve({
      boxId: this.props.id,
      userId: this.props.userId
    });
  }

  render() {
    const {
      reservedBox,
      selectedBox,
    } = this.props;
    const reservedAllBox = [];

    Object.keys(reservedBox).forEach(userId => {
      if (userId !== this.props.userId) {
        reservedAllBox.push(...reservedBox[userId])
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
