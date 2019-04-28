import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import Box from './box';
import EndGame from './endGame';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import * as systemActions from '../../actions/system';
import * as gameActions from '../../actions/game';
import css from './style.css';

class Home extends Component {
  componentDidMount() {
    const { systemActions } = this.props;

    // リロード対策
    systemActions.reloadData();
  }

  Boxlist = () => {
    const {
      socket,
      auth: { userId, roomId },
      system: { p1, p2, nextTurn },
      socketActions,
      gameActions,
    } = this.props;
    const boxList = [];

    for (let y = 1; y < 14; y++) {
      for (let x = 1; x < 14; x++) {
        boxList.push(
          <Box
            key={`${y}:${x}`}
            id={`${y}:${x}`}
            userId={userId}
            roomId={roomId}
            p1={p1}
            p2={p2}
            nextTurn={nextTurn}
            socket={socket}
            socketActions={socketActions}
            gameActions={gameActions}
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
      ui,
    } = this.props;

    const me = p1 ? 'p1' : 'p2';
    const isMyTurn = nextTurn === me;
    const isWaitingPlayer = userIds.length < 2;
    const myColor = isMyTurn && p1 ? '黒' : '白';

    return (
      <div className={css.container}>
        <EndGame isEndGame={ui.isEndGame} message={ui.message} />
        <div className={css.header}>
          roomId: {roomId}
          {isWaitingPlayer
            ? ' ユーザーを待っています'
            : isMyTurn
            ? ` あなた(${myColor})のターン`
            : ' 相手のターン'}
        </div>
        <div className={css.boxContainer}>{this.Boxlist()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket,
  system: state.system,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  socketActions: bindActionCreators(socketActions, dispatch),
  authActions: bindActionCreators(authActions, dispatch),
  systemActions: bindActionCreators(systemActions, dispatch),
  gameActions: bindActionCreators(gameActions, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
