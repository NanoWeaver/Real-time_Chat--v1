import AvatarRegistration from './avatar-registration.js'
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate, который позволяет программе перемещать пользователя между различными страницами приложения
import { useRef, useState } from 'react';
import { validationUserName, validationUserLogin, validationUserPassword } from '../../validation/index.js'; // Импортируем функции

const Registr = ({socket, setUserLogin, userLogin,setUserAvatar, userAvatar}) => {
    const navigate = useNavigate(); // Создаем функцию ,чтоб перенапровлять пользователя на другую страницу

    const [avatarSelectionWindow, setAvatarSelectionWindow] = useState(false);
    const userNameRef = useRef(null) // Получаем поле с именем пользователя
    const userLoginRef = useRef(null) // Получаем поле с логином пользователя
    const userPasswordRef = useRef(null) // Получаем поле с паролем пользователя
    
    const registerUser = () => { // Функция при клике на кнопку Регистрация
        if( // Проверяем правильность заполнения полей регистрации
          validationUserName(userNameRef) &&
          validationUserLogin(userLoginRef) &&
          validationUserPassword(userPasswordRef)
        ) { // Создаём событие send_registr и отправляем на сервер
          socket.emit('send_registr', { 
            userName: userNameRef.current.value, 
            userLogin: userLoginRef.current.value, 
            userPassword: userPasswordRef.current.value,
          });
          // Обновляем логин пользователя
          console.log("Обновили логин пользователя при регистрации" + userLoginRef.current.value)
          setUserLogin(userLoginRef.current.value)
          // После переводим пользователя на страницу Выбора аватарки
         setAvatarSelectionWindow(true)
        } else {
          console.log('Данные не коректны')
        }
      };

    const joinHome = () => { // Прик клике на Вход перенаправляет на страницу входа
        navigate('/', { replace: true });
      }
    return ( // Возвращащем JSX 
        <div className='home'>
          {
            avatarSelectionWindow ? (
            <AvatarRegistration userLogin={userLogin} setUserAvatar={setUserAvatar} userAvatar={userAvatar}/>
            ) : (
            <div className='home__container'>
              <h1 className='home__heading'>Регистрация в Connectify</h1>
              <p className='home__subtitle'>Укажите свои данные</p>
              <input className='home__input --userName' placeholder='Имя пользователя' ref={userNameRef}/>
              <input className='home__input --userLogin' placeholder='Логин' ref={userLoginRef}/>
              <input className='home__input --userPassword' placeholder='Пароль'  ref={userPasswordRef}/>
              <button className='home__button --secondary-button' onClick={registerUser}>Регистрация</button> 
              <p className='home__subtitle'>Есть аккаунт? <span className='home__link' onClick={joinHome}>Вход</span>.</p>
            </div>
            )
          }
        </div>
    );
}

export default Registr;