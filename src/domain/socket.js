import { plainToClass } from 'class-transformer';
import _ from 'lodash';

class Socket {
  reservedBox;
  selectedBox;

  getEnemyBox({ userId, roomId }) {
    const enemyBox = [];

    Object.keys(this.reservedBox).forEach(id => {
      // ルームが同じで自分ではない => 相手の選んでいるbox
      if (id.includes(roomId) && !id.includes(userId)) {
        enemyBox.push(...this.reservedBox[id]);
      }
    });

    return _.uniq(enemyBox);
  }

  get selectedAllBox() {
    const selectedAllBox = [];

    Object.keys(this.reservedBox).forEach(userRoomId => {
      selectedAllBox.push(...this.reservedBox[userRoomId]);
    });

    return _.uniq(selectedAllBox);
  }

  getBoxType({ enemyBox, boxId }) {
    const isEnemyBox = enemyBox.includes(boxId);
    const isMyBox = this.selectedBox.includes(boxId);

    return {
      isEnemyBox,
      isMyBox,
    };
  }
}

export default socket => plainToClass(Socket, socket);
