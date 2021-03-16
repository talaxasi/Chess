import React, {useEffect, useRef, useState} from 'react';
import './Chess.scss';
import bishopWhite from '../../icons/bishopWhite.png';
import kingWhite from '../../icons/kingWhite.png';
import knightWhite from '../../icons/knightWhite.png';
import pawnWhite from '../../icons/pawnWhite.png';
import queenWhite from '../../icons/queenWhite.png';
import rookWhite from '../../icons/rookWhite.png';
import bishopBlack from '../../icons/bishopBlack.png';
import kingBlack from '../../icons/kingBlack.png';
import knightBlack from '../../icons/knightBlack.png';
import pawnBlack from '../../icons/pawnBlack.png';
import queenBlack from '../../icons/queenBlack.png';
import rookBlack from '../../icons/rookBlack.png';

const figuresList = {
  rookWhite: {
    path: rookWhite,
    name: 'rookWhite',
    position: [{x: 0, y: 0}, {x: 7, y: 0}]
  },
  knightWhite: {
    path: knightWhite,
    name: 'knightWhite',
    position: [{x: 1, y: 0}, {x: 6, y: 0}]
  },
  bishopWhite: {
    path: bishopWhite,
    name: 'bishopWhite',
    position: [{x: 2, y: 0}, {x: 5, y: 0}]
  },
  queenWhite: {
    path: queenWhite,
    name: 'queenWhite',
    position: [{x: 3, y: 0}]
  },
  kingWhite: {
    path: kingWhite,
    name: 'kingWhite',
    position: [{x: 4, y: 0}]
  },
  pawnWhite: {
    path: pawnWhite,
    name: 'pawnWhite',
    position: new Array(8).fill({}).map((el, i) => ({x: i, y: 1})),
    move: pawn
  },
  rookBlack: {
    path: rookBlack,
    name: 'rookBlack',
    position: [{x: 0, y: 0}, {x: 7, y: 0}]
  },
  knightBlack: {
    path: knightBlack,
    name: 'knightBlack',
    position: [{x: 1, y: 0}, {x: 6, y: 0}]
  },
  bishopBlack: {
    path: bishopBlack,
    name: 'bishopBlack',
    position: [{x: 2, y: 0}, {x: 5, y: 0}]
  },
  queenBlack: {
    path: queenBlack,
    name: 'queenBlack',
    position: [{x: 3, y: 0}]
  },
  kingBlack: {
    path: kingBlack,
    name: 'kingBlack',
    position: [{x: 4, y: 0}]
  },
  pawnBlack: {
    path: pawnBlack,
    name: 'pawnBlack',
    position: new Array(8).fill({}).map((el, i) => ({x: i, y: 1})),
    move: pawn
  }
}

function pawn(name, x, y, figureWhite, nodeList) {
  let canMove = {};
  if (y === 1) {
    let node = nodeList[y + 2][x];
    let move = checkCell(node, figureWhite, x, y + 2);
    let cellPosition = nodeList[y + 2][x].dataset.position;
    if (move.move === 'move' && move.position !== cellPosition) move = {};
    if (Object.keys(move).length > 0) canMove[move.position] = move;
  }
    for (let i = x - 1; i < x + 2; i++) {
      if (i < 0) i = 0;
      if (i > 7) break;
      let node = nodeList[y + 1][i];
      let move = checkCell(node, figureWhite, i, y + 1);
      let cellPosition = nodeList[y + 1][x].dataset.position;
      if (move.move === 'move' && move.position !== cellPosition) move = {};
      if (move.move === 'attack' && move.position === cellPosition) move = {};
      if (Object.keys(move).length > 0) canMove[move.position] = move;
    }
    if (Object.keys(canMove) < 1) return {move: null, position: null};
  return canMove;
}

// function rook(name, x, y, figureWhite, nodeList) {
//   let canMove = {};
//   for (let i = 0; i < 8; i ++) {
//
//   }
// }

const checkCell = (node, comparableFigureColor, x, y) => {
  const {position} = node.dataset;
  const isFigure = node.innerHTML !== '';
  const currentFigureColor = node.childNodes.length > 0 ? node.childNodes[0].children[0].dataset.name.includes('White') : null;
  if (!isFigure) return {move: 'move', position, x, y};
  if (isFigure && comparableFigureColor !== currentFigureColor) return {move: 'attack', position, x: x, y: y};
  if (isFigure && comparableFigureColor === currentFigureColor) return {move: null}
  return {};
}


const Chess = () => {
  const [figures, setFigures] = useState(figuresList);
  const [nodeCells, setNodeCells] = useState([]);
  const [nodeCellsReverse, setNodeCellsReverse] = useState([]);
  const [currentFigure, setCurrentFigure] = useState({});
  const [whiteMove, setWhiteMove] = useState(true);
  const deskRef = useRef();

  const initDesk = new Array(8).fill(0).map(() => new Array(8).fill(0));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const figure = (obj, i, position) => {
    return `<div class="figure">
            <img class="figure__img" src="${obj.path}" alt="x" 
            data-name="${obj.name}" data-id="${i}" 
            data-x="${obj.position[i].x}" data-y="${obj.position[i].y}" data-position="${position}"/>
            </div>`
  }

  const check = e => {
    const {name, x, y, id, position} = e.target.dataset;
    const isCurrentFigure = Object.keys(currentFigure).length > 0;
    const nodeList = whiteMove ? nodeCells : nodeCellsReverse;
    const reverseNodeList = !whiteMove ? nodeCells : nodeCellsReverse;
      const whiteFigure = name.includes('White') || false;
      if (name !== 'cell' && !isCurrentFigure && whiteFigure === whiteMove) {
        const figureWhite = name.includes('White');
        const canMove = figures[name].move(name, parseInt(x), parseInt(y), figureWhite, nodeList);
        if (canMove.move === null) {
          setCurrentFigure({});
          return null
        }
        setCurrentFigure({name, id, canMove, position: {x: x, y: y, position}});
      }
      if (isCurrentFigure && (position in currentFigure.canMove)) {
        const action = currentFigure.canMove[position].move;
        const {name: figureName, id: figureId, position: {x: figureX, y: figureY}, canMove} = currentFigure;
        const move = canMove[position];
        let newPosition = {...figures[figureName]};
        newPosition.position[+figureId] = {x: move.x, y: move.y};
        if (action === 'move') {
          setFigures({...figures, newPosition});
          nodeList[+figureY][+figureX].innerHTML = '';
          setWhiteMove(!whiteMove);
          setCurrentFigure({});
        }
        if (action === 'attack') {
          const {name, id} = reverseNodeList[y][x].children[0].children[0].dataset;
          let attackedPosition = {...figures[name]};
          attackedPosition.position[id] = {x: null, y: null};
          setFigures({...figures, newPosition, attackedPosition});
          nodeList[+figureY][+figureX].innerHTML = '';
          setWhiteMove(!whiteMove);
          setCurrentFigure({});
        }
    }
  }

  useEffect(() => {
    const cells = deskRef.current.childNodes;
    const arr = [...initDesk].map(el => [...el]);
    let column = 0;
    let row = 0;
    for (let i = 0; i < cells.length; i++) {
      arr[column][row] = cells[i];
      row++;
      if (row === 8) {
        column++;
        row = 0;
      }
    }
    setNodeCellsReverse([...arr]);
    arr.reverse();
    setNodeCells([...arr]);
  }, [])

  useEffect(() => {
    if (nodeCells.length > 0) {
      for (let key in figures) {
        figures[key].position.forEach((el, i) => {
          if (el.y !== null && el.x !== null) {
            if (figures[key].name.includes('White')) {
              const pos = nodeCells[el.y][el.x].dataset.position;
              nodeCells[el.y][el.x].innerHTML = figure(figures[key], i, pos);
            } else {
              const pos = nodeCellsReverse[el.y][el.x].dataset.position;
              nodeCellsReverse[el.y][el.x].innerHTML = figure(figures[key], i, pos);
            }
          }
        })
      }
    }
  }, [nodeCellsReverse, nodeCells, figures])

  return (
      <div className={'Chess'}>
        {console.log(currentFigure.canMove)}
        <div className={'desk-border'}>
          <div className={'border-numbers'}>
            {numbers.map(num => <div className={'border-numbers__item'} key={num + '0'}>
              <p>{num}</p>
            </div>)}
          </div>
          <div className={'border-letters'}>
            {letters.map(letter => <div className={'border-letters__item'} key={letter}>
              <p>{letter}</p>
            </div>)}
          </div>
          <div className={'desk'} ref={deskRef} onClick={check}>
            {initDesk.map((arr, i) => {
              if (i % 2 === 0) {
                return arr.map((cell, j) => {
                  const position = `${j}${7 - i}`;
                  if (j % 2 === 0) return <div className={'desk__cell'} data-y={7 - i} data-x={j}
                                               data-letter={letters[j]} data-name={'cell'} key={j}
                                               data-position={position}/>
                  return <div className={'desk__cell desk__cell_brown'} data-y={7 - i} data-x={j}
                              data-letter={letters[j]} data-name={'cell'} key={j} data-position={position}/>
                })
              }
              return arr.map((cell, j) => {
                const position = `${j}${7 - i}`;
                if (j % 2 === 0) return <div className={'desk__cell desk__cell_brown'} data-y={7 - i} data-x={j}
                                             data-letter={letters[j]} data-name={'cell'} key={j}
                                             data-position={position}/>
                return <div className={'desk__cell'} data-y={7 - i} data-x={j}
                            data-letter={letters[j]} data-name={'cell'} key={j} data-position={position}/>
              })
            })}
          </div>
        </div>
      </div>
  )
}

export default Chess;