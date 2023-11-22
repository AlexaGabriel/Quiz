/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import "./Game.css"
import { Link } from 'react-router-dom';

function Game() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [points, setPoints] = useState(0);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('../Questions.json')
      .then((res) => res.json())
      .then((data) => {
        const shuffledQuestions = shuffleArray(data.perguntas);
        setQuestions(shuffledQuestions);
      })
      .catch((error) => {
        console.error('Erro ao carregar as questões:', error);
      });
  }, []);

  const shuffleArray = (array) => {
    
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleAnswerClick = (answer) => {
    setUserAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = currentQuestion.resposta;

    if (currentAnswer === userAnswer) {
      setPoints((prevPoints) => prevPoints + 1);
    } else {
      setRedirect(true); // Se a resposta estiver errada, ativa o redirecionamento
      return;
    }

    setUserAnswer(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setRedirect(true); // Redireciona para o fim do jogo quando todas as perguntas forem respondidas
      return;
    }
  };

  if (redirect) {
    <p style="color = red;">você perdeu</p>
    return <Link to="/">Voltar ao inicio</Link>;
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return <p>Fim de jogo</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <form action="">
        <div className='container'>
          <p>Questão {currentQuestionIndex + 1}: {currentQuestion.pergunta}</p>
          <ul>
            {currentQuestion.alternativas.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <button onClick={() => handleAnswerClick(answer)} disabled={userAnswer !== null}>{answer}</button>
              </li>
            ))}
          </ul>
          <div className='ocult'>
            {userAnswer !== null && (
              <p>Resposta correta: {currentQuestion.resposta}</p>
            )}
                    {userAnswer !== null && (
            <button onClick={handleNextQuestion}>
              Próxima Questão
            </button>
            )}
        </div>
        <p>Pontuação: {points}</p>
        </div>
      </form>
      
    </>
  );
}

export default Game;
