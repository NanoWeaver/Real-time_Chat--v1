import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React

const RoomOptions = ({ onLeaveChat, onToggleSound, onSearchMessages, visible}) => { // Определение компонента Massages с одним промтом 
  if (!visible) return null;

  return ( // Возвращаем JSX
    <div className='room-options__box'>
        <on className='room-options__list'>
            <li className='room-options__item'><button className='room-options__button'>Выключить уведомления</button></li>
            <li className='room-options__item'><button className='room-options__button'>Поиск сообщений</button></li>
            <li className='room-options__item'><button className='room-options__button' onClick={onLeaveChat}>Выйти из чата</button></li>
        </on>
    </div>
  );
};

export default RoomOptions;