import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {userLoginChanging, userNameChanging} from '../registration/script.js'
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции
import {getUserRooms, roomSearchDatabase} from './script.js' // Импорт функции получения списка комнат пользователя

const UserSetting = ({ userName, setUserName, userLogin, setUserLogin, userPassword, setUserPassword, userAvatar, setUserAvatar, SetUserSettingOn, userID}) => { // Определение компонента Massages с одним промтом 
  const [userNameNew, setUserNameNew] = useState(userName);
  const [userLoginNew, setUserLoginNew] = useState(userLogin);

  // Скрипт срабатывает при клике на кнопку Сохранить
  const saveData = async () => {
    if (userName !== userNameNew.trim()) {
      if (validationUserName(userNameNew)) {
        await userNameChanging(userID, userNameNew.trim());
        console.log('Имя пользователя было изменено на ' + userNameNew.trim())
      }
    }  else console.log('Ошибка смены имени пользователя')
    if (userLogin !== userLoginNew.trim()) {
      if (validationUserLogin(userLoginNew)) {
        await userLoginChanging(userID, userLoginNew.trim());
        console.log('Логин пользователя был изменён на ' + userLoginNew.trim())
      }
    } else console.log('Ошибка смены логина пользователя')
  }

  // Скрипт выхода из настроек пользователя
  const closeUserSetting = () => {
    SetUserSettingOn(false);
  }

  // Скрипт для изминения значения инпута с именем пользователя
  const handleInputChangeName = (event) => {
    setUserNameNew(event.target.value);
  };

  // Скрипт для изминения значения инпута с именем пользователя
  const handleInputChangeLogin = (event) => {
    setUserLoginNew(event.target.value);
  };

  return ( // Возвращаем JSX
    <div className='user-setting__box'>
        <img className='user-setting__user-avatar' src={userAvatar} alt='Фото профиля пользователя' width={200}/>
        <input className='user-setting__input' type='text' value={userNameNew} onChange={handleInputChangeName}/>
        <input className='user-setting__input' type='text' value={userLoginNew} onChange={handleInputChangeLogin}/>
        <textarea className='user-setting__input' rows={5} placeholder='Обо мне'></textarea>
        <input className='user-setting__input' type='text' />
        <div className='user-setting__button-wrapper'>
            <button onClick={saveData}>Сохранить</button>
            <button onClick={closeUserSetting}>Отмена</button>
        </div>
    </div>
  );
};

export default UserSetting;