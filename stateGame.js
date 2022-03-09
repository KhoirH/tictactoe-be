/** expectation
 * room - {
 *    `roomId` : {
 *      user : {
 *        `userId` : `symbol`,
 *        `userId` : `symbol`
 *        },
 *      activeUser : `userId`
 *      dataTictactoe : {
 *        `boxId` : `symbol`
 *      }
 *      status: `pending` / `start`
 *      win: `userId`
 *    }
 * }
**/

let room = {}
const winPath = ['123', '456', '789', '147', '258' , '369', '159', '357'];
module.exports = { room, winPath };