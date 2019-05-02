import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuidv1 from 'uuid/v1';
import * as systemActions from '../actions/system';
import * as authActions from '../actions/auth';
import css from './style.css';

class App extends Component {
  createRoom = () => {
    const { router, systemActions } = this.props;

    systemActions.createRoom();

    router.push('/home');
  };

  selectRoom = roomId => () => {
    const { router, systemActions } = this.props;

    systemActions.selectRoom({
      roomId,
    });

    router.push('/home');
  };

  createSession = () => {
    let uuid = window.sessionStorage.getItem('userId');

    if (uuid) {
      return uuid;
    }

    uuid = uuidv1();

    window.sessionStorage.setItem('userId', uuid);

    return uuid;
  };

  componentDidMount = () => {
    this.createSession();
  };

  render() {
    const { auth } = this.props;
    const isExistsRooms = auth.rooms.length;

    return (
      <div>
        <div className={css.center}>
          <img src="/static/title.png" />
        </div>
        <div className={`${css.center}`} onClick={this.createRoom}>
          <a className="button is-success">ルームを作成してゲーム開始</a>
        </div>
        {isExistsRooms ? (
          <div>
            {auth.rooms.map(roomId => (
              <div
                key={roomId}
                className={css.center}
                onClick={this.selectRoom(roomId)}
              >
                <a className="button">{`ルームid: ${roomId} に参加してゲーム開始`}</a>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  systemActions: bindActionCreators(systemActions, dispatch),
  authActions: bindActionCreators(authActions, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
