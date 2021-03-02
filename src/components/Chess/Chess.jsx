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
    position: [{x: 0, y: 7}, {x: 7, y: 7}]
  },
  knightBlack: {
    path: knightBlack,
    name: 'knightBlack',
    position: [{x: 1, y: 7}, {x: 6, y: 7}]
  },
  bishopBlack: {
    path: bishopBlack,
    name: 'bishopBlack',
    position: [{x: 2, y: 7}, {x: 5, y: 7}]
  },
  queenBlack: {
    path: queenBlack,
    name: 'queenBlack',
    position: [{x: 3, y: 7}]
  },
  kingBlack: {
    path: kingBlack,
    name: 'kingBlack',
    position: [{x: 4, y: 7}]
  },
  pawnBlack: {
    path: pawnBlack,
    name: 'pawnBlack',
    position: new Array(8).fill({}).map((el, i) => ({x: i, y: 6})),
    move: pawn
  }
}

const checkCell = (node, comparableFigureColor) => {
  const {name, x, y} = node.dataset;
  const currentFigureColor = name.includes('White');
  if (name === 'cell') return {move: 'move', position: x + y};
  if (name !== 'cell' && comparableFigureColor !== currentFigureColor) return {move: 'attack', position: x + y};
  return null;
}

function pawn(targetDataset, nodeList) {
  let {name, x, y, id, firstmove} = targetDataset;
  x = +x;
  y = +y;
  const figureWhite = name.includes('White');
  let canMove = {};
  if (firstmove) {
    for (let i = 1; i < 3; i++) {
      let node = nodeList[y + i][x];
      let move = checkCell(node, figureWhite);
      if (move !== null) canMove[move.position] = move;
    }
  }
  return canMove;
}

const Chess = () => {
  const [figures, setFigures] = useState(figuresList);
  const [nodeCells, setNodeCells] = useState([]);
  const [nodeCellsReverse, setNodeCellsReverse] = useState([]);
  const [currentFigure, setCurrentFigure] = useState({});
  const [whiteMove, setWhiteMove] = useState(false);
  const deskRef = useRef();

  const initDesk = new Array(8).fill(0).map(() => new Array(8).fill(0));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const figure = (obj, i) => {
    return `<div class="figure">
            <img class="figure__img" src="${obj.path}" alt="x" 
            data-name="${obj.name}" data-id="${i}" data-firstmove="${true}" 
            data-x="${obj.position[i].x}" data-y="${obj.position[i].y}"/>
            </div>`
  }

  const check = e => {
    const {name, x, y, id} = e.target.dataset;
    console.log(x + y)
    const isCurrentFigure = Object.keys(currentFigure).length > 0;
    if (name !== 'cell' && !isCurrentFigure) {
      const nodeList = whiteMove ? nodeCells : nodeCellsReverse;
      const canMove = figures[name].move(e.target.dataset, nodeList);
      setCurrentFigure({name, id, canMove, position: {x: x, y: y, position: x + y}});
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
          nodeCells[el.y][el.x].innerHTML = figure(figures[key], i)
        })
      }
    }
  }, [nodeCells, figures])

  return (
      <div className={'Chess'}>
        {console.log(currentFigure)}
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
                  if (j % 2 === 0) return <div className={'desk__cell'} data-y={7 - i} data-x={j}
                                               data-letter={letters[j]} data-name={'cell'} key={j}/>
                  return <div className={'desk__cell desk__cell_brown'} data-y={7 - i} data-x={j}
                              data-letter={letters[j]} data-name={'cell'} key={j}/>
                })
              }
              return arr.map((cell, j) => {
                if (j % 2 === 0) return <div className={'desk__cell desk__cell_brown'} data-y={7 - i} data-x={j}
                                             data-letter={letters[j]} data-name={'cell'} key={j}/>
                return <div className={'desk__cell'} data-y={7 - i} data-x={j}
                            data-letter={letters[j]} data-name={'cell'} key={j}/>
              })
            })}
          </div>
        </div>
      </div>
  )
}

export default Chess;