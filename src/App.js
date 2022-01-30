import React, { useState ,useEffect } from 'react';
import BlueCandy from '../src/images/blue-candy.png'
import GreenCandy from '../src/images/green-candy.png'
import OrangeCandy from '../src/images/orange-candy.png'
import PurpleCandy from '../src/images/purple-candy.png'
import RedCandy from '../src/images/red-candy.png'
import YellowCandy from '../src/images/yellow-candy.png'
import BlankCandy from '../src/images/blank.png'

import Refresh from '../src/images/Refresh.png'
const width = 8 ; 
const candyColors = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy
]

const App = ()=>{
  const [currentColorArrangement , setCurrentColorArrangement ] = useState([]);
  const [squareBeingDragged , setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced , setSquareBeingReplaced] = useState(null);
  const [score , setScore ] = useState(0);

  const refresh = () => {
    setScore(0); 
    createBoard(); 
  }

  const createBoard = () => {
    let randomCurrentArrangement = []; 
    for(let i=0 ; i< width * width ; i++){
      let randomColor   =  candyColors[ Math.floor(Math.random()*candyColors.length)] 
      randomCurrentArrangement.push(randomColor); 
    }
    setCurrentColorArrangement(randomCurrentArrangement); 
  }

  const checkForColumnOfThree = () => {
    for(let i=0 ; i<64 ; i++){
      let RowOfThree = [i , i+1 , i+2]; 
      let decidedColor = currentColorArrangement[i]; 

      let notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]; 
      if(notValid.includes(i)){continue}

      if(RowOfThree.every((square) => currentColorArrangement[square] === decidedColor)){
        RowOfThree.forEach((square) => currentColorArrangement[square] = ''); 
        setScore(score+3);
        return true 
      } 
    }
  }
  const checkForColumnOfFour = () => {
    for(let i=0 ; i<64 ; i++){
      let RowOfThree = [i , i+1 , i+2 , i+3]; 
      let decidedColor = currentColorArrangement[i]; 
      
      let notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]; 
      if(notValid.includes(i)){continue}
      
      if(RowOfThree.every((square) => currentColorArrangement[square] === decidedColor)){
        RowOfThree.forEach((square) => currentColorArrangement[square] = ''); 
        setScore(score+4);
        return true 
      } 
    }
  }
  const checkForRowOfThree = () => {
    for(let i=0 ; i<=47 ; i++){
      let RowOfThree = [i , i+width , i+width+width]; 
      let decidedColor = currentColorArrangement[i]; 

      if(RowOfThree.every((square) => currentColorArrangement[square] === decidedColor)){
        RowOfThree.forEach((square) => currentColorArrangement[square] = ''); 
        setScore(score+3);
        return true 
      } 
    }
  }
  const checkForRowOfFour = () => {
    for(let i=0 ; i<39 ; i++){
      let RowOfThree = [i , i+width , i+width+width , i+width+width+width]; 
      let decidedColor = currentColorArrangement[i]; 
      
      if(RowOfThree.every((square) => currentColorArrangement[square] === decidedColor)){
        RowOfThree.forEach((square) => currentColorArrangement[square] = ''); 
        setScore(score+4);
        return true 
      } 
    }
  }
  const moveDown = () => {
    for(let i=0 ; i<64 ; i++){
      let firstRow = [0,1,2,3,4,5,6,7]; 
      let isFirstRow = firstRow.includes(i);

      if(isFirstRow && currentColorArrangement[i]===''){
        // create new candy 
        currentColorArrangement[i]  =  candyColors[ Math.floor(Math.random()*candyColors.length)]
      }

      if(currentColorArrangement[i+width] === ''){
        currentColorArrangement[i+width] = currentColorArrangement[i];
        currentColorArrangement[i] = ''
      }

    }
  }
  
  useEffect(() => {
    createBoard()
  },[]);
  useEffect(()=>{
    const timer = setInterval(() => {
      moveDown();
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForRowOfThree(); 
      checkForColumnOfThree(); 
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return (()=>{
      clearInterval(timer);
    })
  },[checkForColumnOfThree , checkForRowOfThree , checkForColumnOfFour , checkForRowOfFour , currentColorArrangement])
  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  }
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)  
  }
  const dragEnd  = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('id'));
    
    const validMoves = [
      squareBeingDraggedId + 1,
      squareBeingDraggedId - 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width,
    ]
    let isValidMove = validMoves.includes(squareBeingReplacedId)
    
    if(!isValidMove){return}

    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');       
    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');  
    
    const ischeckForColumnOfFour = checkForColumnOfFour()
    const ischeckForColumnOfThree = checkForColumnOfThree()
    const ischeckForRowOfFour = checkForRowOfFour()
    const ischeckForRowOfThree = checkForRowOfThree()

    if(ischeckForColumnOfFour || ischeckForColumnOfThree || ischeckForRowOfFour || ischeckForRowOfThree){
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)     
    }
    else{
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');       
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');  
    }
  }
  return (
  <div className='app container'>
      <h2 className="title">Candy Crush</h2>
      <small className='small'>Play in your PC</small>
      <div className="scoreBoard">
        <h4 className="score">Score : {score}</h4>
        <img src={Refresh} onClick={refresh} className='refresh' alt="" />
      </div>
      <div className="game">
        {
          currentColorArrangement.map((candyColor,index)=>{
            return <img 
            key={index} 
            alt={index} 
            src={candyColor}
            id = {index}
            draggable={true}
            onDragStart = {dragStart}
            onDragOver={(e)=> e.preventDefault()}
            onDragEnter={(e)=> e.preventDefault()}
            onDragLeave={(e)=> e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
             />
          })

        }
      </div>
  </div>
  )
}

export default App;

