import React, {Component} from "react";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import _ from 'lodash';
import * as socketActions from "../../actions/socket";
import * as authActions from "../../actions/auth";
import * as systemActions from "../../actions/system";
import Box from './box';
import css from "./style.css";

class Home extends Component {
  componentDidMount() {
    const { router, auth, socketActions, authActions, systemActions } = this.props;

    const userId = window.sessionStorage.getItem('userId');
    const roomId = window.sessionStorage.getItem('roomId');
    const p1UserId = window.sessionStorage.getItem('p1');
    const p2UserId = window.sessionStorage.getItem('p2');
    const nextTurn = window.sessionStorage.getItem('nextTurn');

    socketActions.watchOnGame({
      userId,
      roomId
    });

    // リロード対策
    authActions.update({
      userId,
      roomId
    });

    systemActions.setPlayer({
      p1: !!p1UserId,
      p2: !!p2UserId,
    });

    systemActions.setNextTurn(nextTurn);
  }

  render() {
    const {
      socket,
      auth: {
        userId,
        roomId
      },
      system: {
        p1,
        p2,
        nextTurn
      },
      socketActions
    } = this.props;

    return (
      <div>
        roomId: {roomId}
        <div className={css.container}>
          {_.range(14 * 14).map(id => (
            <Box
              id={id}
              key={id}
              userId={userId}
              roomId={roomId}
              p1={p1}
              p2={p2}
              nextTurn={nextTurn}
              reservedBox={socket.reservedBox}
              selectedBox={socket.selectedBox}
              socketActions={socketActions}
            />
          ))}
        </div>
      </div>
    )
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
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));