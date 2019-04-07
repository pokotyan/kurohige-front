import React, {Component} from "react";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import _ from 'lodash';
import * as socketActions from "../../actions/socket";
import Box from './box';
import css from "./style.css";

class Home extends Component {
  componentDidMount() {
    const { router, auth, socketActions } = this.props;

    socketActions.watchOnGame({
      userId: auth.userId
    });
  }

  render() {
    const {
      socket,
      auth: {
        userId,
        roomId
      },
      socketActions
    } = this.props;

    return (
      <div>
        roomId: {roomId}
        <div className={css.container}>
          {_.range(15).map(id => (
            <Box
              id={id}
              key={id}
              userId={userId}
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
});

const mapDispatchToProps = dispatch => ({
  socketActions: bindActionCreators(socketActions, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));