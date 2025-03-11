import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React


const CreatingRoom = ({ userName, setUserName, userLogin, setUserLogin, userPassword, setUserPassword, userAvatar, setUserAvatar, SetUserSettingOn, userID, userAbout, setUserAbout}) => { // Определение компонента Massages с одним промтом 
  
  return ( // Возвращаем JSX
    <div className='creating-room__box'>
        <h1>Создание Чата</h1>
        <input type='text' placeholder=''/>
        <input type='text' placeholder=''/>
    </div>
  );
};

export default CreatingRoom;