import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции
import {getUserRooms, roomSearchDatabase} from './script.js' // Импорт функции получения списка комнат пользователя

const UserSetting = ({ userName, setUserName, userLogin, setUserLogin, userPassword, setUserPassword, userAvatar, setUserAvatar}) => { // Определение компонента Massages с одним промтом 


  return ( // Возвращаем JSX
    <div className='user-setting__box'>
        <img className='user-setting__user-avatar' src={userAvatar} alt='Фото профиля пользователя' width={200}/>
        <input className='user-setting__input' type='text' value={userName}/>
        <input className='user-setting__input' type='text' value={userLogin}/>
        <textarea className='user-setting__input' rows={5}></textarea>
        <input className='user-setting__input' type='text'/>
        <div className='user-setting__button-wrapper'>
            <button>Сохранить</button>
            <button>Отмена</button>
        </div>
    </div>
  );
};

export default UserSetting;