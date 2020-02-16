const playerUpdateSubscribe = `${window.location.hostname}/api/v1/Game/Subscribe`;

// An arrow function assigns the this context so that you do not have to worry about bind
// Classes also do this for you in the background as they are syntactic sugar
export const GameManger = (playerCount, currentPlayer = 1, multiplayer = false) => {
    this.playerCount = playerCount;
    this.currentPlayer = currentPlayer;
    this.multiplayer = multiplayer;
    this.players = [];
}

GameManger.prototype.setCurrentPlayer = player => {
    this.playerCount = player;
}

GameManger.prototype.init = () => {

}

GameManger.prototype.addPlayer = player => {
    this.players.append(player);
}

// Any parameter not passed here will be set to undefined by default
const User = (name, score, tile) => {
    this.name = name;
    this.score = score;
    this.tile = tile;
}