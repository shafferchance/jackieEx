import { PSEvent, Action, Subscriber } from './pubsubStructs.js';

export const UserManager = new PSEvent(
    "userManager",
    (_, data)  => {
        console.log(data);
        switch(data["message"]) {
            case "addPlayer":
                if (this.users === undefined) this.users = {};
                this.users[data.name] = data; 
                postMessage({'action': 'playersChanged', 'players': this.users});
                break;
            case "playerTurnChange":
                this.playerTurn = data;
                postMessage({'action': 'turnChanged', 'playerTurn': this.playerTurn});
                break;
            case "playerScoreIncrease":
                for (const usr of this.users) {
                    if (usr.name === data.name) usr.score = data.score;
                }
                postMessage({'action': 'playerScoreChanged', 'players': this.users});
                break;
            case "removePlayer":
                this.users.splice(this.users[data.name].indexOf(), 1);
                postMessage({'action': 'playersChanged', 'players': this.users});
                break;
            case "playerSettingChange":
                this.users[data.name] = data;
                postMessage({'action': 'playersChanged', 'players': this.users});
                break;
            default:
                console.log(data);
                break;
        }
    });