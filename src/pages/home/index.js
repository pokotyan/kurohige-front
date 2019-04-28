import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import Box from './box';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import * as systemActions from '../../actions/system';
import css from './style.css';

class Home extends Component {
  componentDidMount() {
    const { socketActions, authActions, systemActions } = this.props;
    const userId = window.sessionStorage.getItem('userId');
    const roomId = window.sessionStorage.getItem('roomId');
    const userIds = window.sessionStorage.getItem('userIds');
    const p1UserId = window.sessionStorage.getItem('p1');
    const p2UserId = window.sessionStorage.getItem('p2');
    const nextTurn = window.sessionStorage.getItem('nextTurn');

    socketActions.watchOnSelect({
      userId,
      roomId,
    });

    // リロード対策
    authActions.update({
      userId,
      roomId,
      userIds: JSON.parse(userIds),
    });

    systemActions.setPlayer({
      p1: !!p1UserId,
      p2: !!p2UserId,
    });

    systemActions.setNextTurn(nextTurn);
  }

  Boxlist = () => {
    const {
      socket: { reservedBox, selectedBox },
      auth: { userId, roomId },
      system: { p1, p2, nextTurn },
      socketActions,
    } = this.props;
    const boxList = [];

    for (let y = 1; y < 6; y++) {
      for (let x = 1; x < 6; x++) {
        boxList.push(
          <Box
            id={`${y}:${x}`}
            key={`${y}:${x}`}
            userId={userId}
            roomId={roomId}
            p1={p1}
            p2={p2}
            nextTurn={nextTurn}
            reservedBox={reservedBox}
            selectedBox={selectedBox}
            socketActions={socketActions}
          />
        );
      }
    }

    return boxList;
  };

  render() {
    const {
      auth: { roomId, userIds },
      system: { p1, nextTurn },
    } = this.props;

    const me = p1 ? 'p1' : 'p2';
    const isMyTurn = nextTurn === me;
    const waitingPlayer = userIds.length < 2;

    return (
      <div>
        roomId: {roomId}
        {waitingPlayer
          ? ' ユーザーを待っています'
          : isMyTurn
          ? ' あなたのターン'
          : ' 相手のターン'}
        <div className={css.container}>{this.Boxlist()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket,
  system: state.system,
});

const mapDispatchToProps = dispatch => ({
  socketActions: bindActionCreators(socketActions, dispatch),
  authActions: bindActionCreators(authActions, dispatch),
  systemActions: bindActionCreators(systemActions, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
