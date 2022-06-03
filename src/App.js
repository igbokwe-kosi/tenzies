import Die from './Die';
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  const allNewDice = () => new Array(10).fill(0).map(() => generateNewDie());

  /* const [highScore, setHighScore] = useState(() =>
    JSON.parse(localStorage.getItem('highScore') || '')
  ); */

  const [highScore, setHighScore] = useState(() => {
    return JSON.parse(localStorage.getItem('highScore')) || null;
  });
  const [rolls, setRolls] = useState(0);

  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    if (dice.every(die => die.value && die.isHeld)) {
      const allHeld = dice.every(die => die.isHeld);
      const firstValue = dice[0].value;
      const allSameValue = dice.every(die => die.value === firstValue);

      if (allHeld && allSameValue) {
        setTenzies(true);
      }
    }
  }, [dice]);

  useEffect(() => {
    if (!tenzies) return;

    if (!highScore || rolls < highScore) {
      localStorage.setItem('highScore', rolls);
      setHighScore(localStorage.getItem('highScore'));
    }
  }, [highScore, rolls, tenzies]);

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice =>
        oldDice.map(die => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRolls(prevRoll => prevRoll + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
    }
  }

  function holdDice(id) {
    setDice(prevDice =>
      prevDice.map(dice =>
        dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
      )
    );
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>

      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <div className="stats">
        <div className="rolls">
          <p className="roll">Number of Rolls: {rolls}</p>
          <p className="roll">High Score: {highScore ? highScore : '-'}</p>
        </div>
      </div>
    </main>
  );
}
