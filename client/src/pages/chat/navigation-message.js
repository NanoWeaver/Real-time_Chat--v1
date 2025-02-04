import './styles.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React

const NavigationMessage = ({ socket }) => { // Определение компонента Massages с одним промтом 
  

  return ( // Возвращаем JSX
    <div className='navigation-message'>
      <div className='navigation-message__button-wrapper'>
        <button className='navigation-message__button --create-chat'>Создать чат</button>
        <button className='navigation-message__button --add-chat'>Добавить чат</button>
      </div>
    </div>
  );
};

export default NavigationMessage;