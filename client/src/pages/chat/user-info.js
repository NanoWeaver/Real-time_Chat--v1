import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {gettingUserDataId} from './../registration/script.js';
import {giveUserAdministratorRights, deleteUserFromChat} from './script.js';
import ChangeRoom from './change-room.js';

const UserInfo = ({ socket, room, setRoom, setWindowUserInfo, userID, IDSelectedUser }) => { // Определение компонента Massages с одним промтом 
    const [userDoc, setUserDoc] = useState({})


    // При монтировани компонента отправляем запрос на севрвер , для полученния данных
    useEffect(() => {
        console.log('ID пользователя чью информацию смотрим' , IDSelectedUser)
        socket.emit('get_user_data',{IDSelectedUser})
    },[])

    // Ждём ответ от сервера с данными пользователя и передаём их в стейт
    useEffect(() =>{
        const updateUserData = (userData) => {
            setUserDoc(userData);
        }

        socket.on('result_user_data', updateUserData);

        return () => {
            socket.off('result_user_data', updateUserData);
        } 
    },[])


    

    // Скрипт закрытия окна информации о пользователе
    const closeUserInfoWindow = () => {
        setWindowUserInfo(false)
    }

    const openChatBetweenUsers = (targetUser, currentUser = userID) => {
        socket.emit('join_private_chat', {targetUser, currentUser})
    }

  return ( // Возвращаем JSX
    <div className='user-info'>
        <div className='user-info__head'>
            <div className='user-info__header-wrapper'>
                <button className='user-info__close' onClick={closeUserInfoWindow}>
                    <svg className='user-info__close-svg' xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">
                        <path d="M 19.990234 2.9863281 A 1.0001 1.0001 0 0 0 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 A 1.0001 1.0001 0 0 0 3.9902344 2.9902344 A 1.0001 1.0001 0 0 0 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 A 1.0001 1.0001 0 1 0 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 A 1.0001 1.0001 0 1 0 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 A 1.0001 1.0001 0 0 0 19.990234 2.9863281 z"/>
                    </svg>
                </button>
                <h2 className='user-info__header'>Информация</h2>
            </div>
            <img className='user-info__avatar' src={userDoc.userAvatar} alt='Аватарка пользователя' />
            <div className='user-info__data'>
                <p className='user-info__text'><span className='user-info__span'>Имя: </span>{userDoc.userName}</p>
                <p className='user-info__text'><span className='user-info__span'>Логин: </span>{userDoc.userLogin}</p>
            </div>
        </div>
        <div className='user-info__bottom'>
            <button className='user-info__button' onClick={() => openChatBetweenUsers(userDoc.userID)}>Открыть чат</button>
        </div>
    </div>
  );
};

export default UserInfo;