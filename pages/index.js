import React, { Component } from "react";
import { withRouter } from 'next/router';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import uuidv1 from 'uuid/v1';
import * as systemActions from "../actions/system";
import * as authActions from "../actions/auth";
import * as socketActions from "../actions/socket";

class App extends Component {
  start = () => {
    const { router, systemActions } = this.props;

    systemActions.gameStart();

    router.push('/home');
  }

  createSession = () => {
    let uuid = window.sessionStorage.getItem('session');

    if (uuid) {
      return uuid;
    }

    uuid = uuidv1();

    window.sessionStorage.setItem('session', uuid);

    return uuid;
  }

  componentDidMount = () => {
    const { router, authActions, socketActions } = this.props;
    const uuid = this.createSession();

    authActions.saveSession({
      userId: uuid
    });

    socketActions.watchOnRooms();
  }

  render() {
    const { auth } = this.props;

    return (
      <div>
        <div
          onClick={this.start}
        >
          ルームを作成してゲーム開始
        </div>
        <div
          onClick={this.start}
        >
          ルームに参加してゲーム開始
        </div>
        {auth.rooms.map(room => (
          <div key={room}>{room}</div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  systemActions: bindActionCreators(systemActions, dispatch),
  authActions: bindActionCreators(authActions, dispatch),
  socketActions: bindActionCreators(socketActions, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
