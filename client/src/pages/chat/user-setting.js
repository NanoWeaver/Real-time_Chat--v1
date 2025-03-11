import './styles.css'; // Импортируем стили
import ChoosingAvatar from '../registration/choosing-avatar.js'
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {userLoginChanging, userNameChanging, userAboutChanging, userPasswordChanging, userSearchDatabaseID, verifyinUserPassword} from '../registration/script.js'
import { validationUserName, validationUserLogin, validationUserPassword} from '../../validation/index.js'; // Импортируем функции
import {getUserRooms, roomSearchDatabase} from './script.js' // Импорт функции получения списка комнат пользователя

const UserSetting = ({ userName, setUserName, userLogin, setUserLogin, userPassword, setUserPassword, userAvatar, setUserAvatar, SetUserSettingOn, userID, userAbout, setUserAbout}) => { // Определение компонента Massages с одним промтом 
  const [userNameNew, setUserNameNew] = useState(userName);
  const [userLoginNew, setUserLoginNew] = useState(userLogin);
  const [openPasswordChangeWindow, setOpenPasswordChangeWindow] = useState(false)
  const [PhotoSVG, setPhotoSVG] = useState('');
  const [avatarChanging,setAvatarChanging] = useState(false);
  const [buttonCancel,setButtonCancel] = useState(true);
  const userAboutArea = useRef('');
  const newPaswword = useRef('');
  const newPaswwordReplay = useRef('');
  const oldPaswword = useRef('')

  // Скрипт срабатывает при клике на кнопку Сохранить
  const saveData = async () => {
    // Изминение имени пользователя
    if (userName !== userNameNew.trim()) {
      if (validationUserName(userNameNew)) {
        await userNameChanging(userID, userNameNew.trim());
        setUserName(userNameNew.trim())
        console.log('Имя пользователя было изменено на ' + userNameNew.trim())
      }
    }  else console.log('Ошибка смены имени пользователя')
    
    // Изминение логина пользователя
    if (userLogin !== userLoginNew.trim()) {
      if (validationUserLogin(userLoginNew)) {
        await userLoginChanging(userID, userLoginNew.trim());
        setUserLogin(userLoginNew.trim())
        console.log('Логин пользователя был изменён на ' + userLoginNew.trim())
      }
    } else console.log('Ошибка смены логина пользователя')

    // Изминения Обо мне пользователя
    if (userAbout !== userAboutArea.current.value) {
      userAboutChanging(userID, userAboutArea.current.value);
      setUserAbout(userAboutArea.current.value)
      console.log('Информация о пользователе была изменена на  ' + userAboutArea.current.value)
    } else console.log('Ошибка смены Обо мне пользователя')
    
    // Изминения Паролья пользователя
    if (newPaswword.current.value === newPaswwordReplay.current.value) {
      if (userPassword === oldPaswword.current.value) {
        userPasswordChanging(userID, newPaswword.current.value);
        setUserPassword(newPaswword.current.value);
        console.log('Пароль успешно был изменён на ' + newPaswword.current.value);
      }
    } else console.log('Ошибка смены паролья пользователя')
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

  // Скрипт открытия изминения пароля
  const openPasswordChange = () => {
    setOpenPasswordChangeWindow(true)
  }

  // Скрипт закрытия изминения пароля
  const closePasswordChange = () => {
    if (newPaswword.current.value === '') {
      setOpenPasswordChangeWindow(false)
    }
  }

  // Скрипт добавляющий SVG иконку для обозначения возможности сменить фото
  const openPhotoSVG = () => {
    setPhotoSVG('user-setting__user-avatar-SVG--open-SVG')
  }

  // Скрипт добавляющий SVG иконку для обозначения возможности сменить фото
  const closePhotoSVG = () => {
    setPhotoSVG('')
  }

  // Скрипт открытия инструмента смены аватарки пользователя
  const openChangingAvatar = () => {
    setAvatarChanging(true)
  }

  // Скрипт закрытия инструмента смены аватарки пользователя
  const closeChangingAvatar = () => {
    setAvatarChanging(false);
    console.log(avatarChanging)
  }
  return ( // Возвращаем JSX
    <div className='user-setting__box'>
        {
          !avatarChanging ? (
            <div className={`user-setting__user-avatar-wrapper`} onMouseEnter={openPhotoSVG} onMouseLeave={closePhotoSVG} onClick={openChangingAvatar}>
              <img className={`user-setting__user-avatar`}  src={userAvatar} alt='Фото профиля пользователя' width={260}/>
              <div className={`user-setting__user-avatar-SVG-wrapper ${PhotoSVG}`}>
                <svg className='user-setting__SVG' width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 3V5.5M18.5 8V5.5M18.5 5.5H16M18.5 5.5H21"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          ) : (
            <div className={`user-setting__user-avatar-wrapper`}>
              <ChoosingAvatar setUserAvatar = {setUserAvatar} userLogin = {userLogin} userAvatar = {userAvatar} setButtonCancel = {setButtonCancel}/>
              {
                buttonCancel ? (
                  <button className='user-setting__user-avatar-cancel --cancel-setting' onClick={closeChangingAvatar}>Отмена</button>
                ) : false
              }
            </div>
          )
        }
        
        <div className='user-setting__info-wrapper'>
          <input className='user-setting__input' type='text' value={userNameNew} onChange={handleInputChangeName}/>
          <input className='user-setting__input' type='text' value={userLoginNew} onChange={handleInputChangeLogin}/>
          <textarea className='user-setting__input' rows={5} placeholder='Обо мне' ref={userAboutArea}>{userAbout}</textarea>
          <input className='user-setting__input' type='text' placeholder='Сменить пароль' onFocus={openPasswordChange} onBlur={closePasswordChange} ref={newPaswword}/>
          {
            openPasswordChangeWindow ? (
              <div className='user-setting__password-wrapper'>
                <input className='user-setting__input' type='text' placeholder='Повторите новый пароль' ref={newPaswwordReplay}/>
                <input className='user-setting__input' type='text' placeholder='Напишите текущий' ref={oldPaswword}/>
              </div>
            ) : (
              false
            )
          }
          <div className='user-setting__button-wrapper'>
              <button className='user-setting__button --save-setting' onClick={saveData}>Сохранить</button>
              <button className='user-setting__button --cancel-setting' onClick={closeUserSetting}>Отмена</button>
          </div>
        </div>
    </div>
  );
};

export default UserSetting;