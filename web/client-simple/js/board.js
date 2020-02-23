const _ROWS = 8;
const _COLS = 8;

window.addEventListener("load", () => {
    const container = document.querySelector(".board-container");
    const frag = document.createDocumentFragment();
    let piece;
    for (let i=1; i < _COLS; i++) {
        if (i === 1) {
            makeFullColumn(i, frag);
        } else if (i === _COLS - 1) {
            makeFullColumn(i, frag);
        } else {
            piece = boardPiece();
            piece.style = `grid-column: ${i} / ${i};grid-row: ${1} / ${1};`;
            piece2 = boardPiece();
            piece2.style = `grid-column: ${i} / ${i};grid-row: ${_ROWS} / ${_ROWS};`;
            frag.append(piece);
            frag.append(piece2);
        }
    }
    container.append(frag);
});

function makeFullColumn (col, f) {
	for (let j=1; j <= _ROWS; j++) {
    	piece = boardPiece();
      piece.style = `grid-column: ${col} / ${col};grid-row: ${j} / ${j};`;
      f.append(piece);
    }
}

function boardPiece () {
	function getGame (max = 5) {
  	return Math.floor(Math.random() * Math.floor(max));
  }
  let text = "";
  
  switch(getGame()) {
  	case 1:
    	text="None";
      break;
    case 2:
    	text="Solitaire";
      break;
    case 3:
    	text="Go Fish";
      break;
    case 4:
    	text="War";
      break;
    case 5:
    	text="Egyptian Rat Slap";
      break;
    default:
    	text = "None";
      break;
  }
  
  const piece = document.createElement('div');
  const header = document.createElement('h3');
  
  piece.classList.toggle("board-piece");
  header.innerText = text;
  
  piece.append(header);
  return piece;
}