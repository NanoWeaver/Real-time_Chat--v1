import './styles.css'; // Импортируем CSS
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate, который позволяет программе перемещать пользователя между различными страницами приложения
import { useRef } from 'react';
import { validationUserName, validationUserLogin, validationUserPassword } from '../validation/index.js'; // Импортируем функции

const Registr = ({socket}) => {
    const navigate = useNavigate(); // Создаем функцию ,чтоб перенапровлять пользователя на другую страницу

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
            userPassword: userPasswordRef.current.value 
          });
        }
    
    // После переводим пользователя на страницу Входа в аккаутн и убираем возможность шагнуть назад с помощью стрелки браузера
        joinHome();
      };

    const joinHome = () => { // Прик клике на Вход перенаправляет на страницу входа
        navigate('/', { replace: true });
      }
    return ( // Возвращащем JSX 
        <div className='home'>
          <div className='home__container'>
            <h1 className='home__heading'>Регистрация в Connectify</h1>
            <p className='home__subtitle'>Укажите свои данные</p>
            <input className='home__input --userName' placeholder='Имя пользователя' ref={userNameRef}/>
            <input className='home__input --userLogin' placeholder='Логин' ref={userLoginRef}/>
            <input className='home__input --userPassword' placeholder='Пароль'  ref={userPasswordRef}/>
            <button className='home__button' onClick={registerUser}>Регистрация</button> 
            <p>Есть аккаунт? <span onClick={joinHome}>Вход</span>.</p>
          </div>
        </div>
    );
}

export default Registr;