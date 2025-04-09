import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {gettingUserDataId} from './../registration/script.js';
import {giveUserAdministratorRights, deleteUserFromChat} from './script.js';
import ChangeRoom from './change-room.js';

const RoomInfo = ({ socket, room, setRoom, setWindowRoomInfo, userID }) => { // Определение компонента Massages с одним промтом 
    const [usersData, setUsersData] = useState([]); // Состояние для хранения данных пользователей
    const [numberUsers, setNumberUsers] = useState(0); // Хранение колличества пользователей в комнате
    const [isAdmin, setIsAdmin] = useState(false) // Хранение состояния является ли пользователь админом в этой комнате
    const [changeRoomWindow, setChangeRoomWindow] = useState(false) // Состояние для отслеживания открытия окна изминения чата ( для админов)

    // конвертируем ID пользователей в их имена
    useEffect(() => {
        const fetchUserData = async () => {
            const adminIds = new Set(room.roomAdmin);
            const fetchedData = await Promise.all(
                room.roomUsers.map(async (user) => {
                   const userData =  await gettingUserDataId(user);
                   const isUserAdmin = adminIds.has(user);
                   return [...userData, isUserAdmin, user];
                })
            );
            setUsersData(fetchedData); // Обновляем состояние массива данных пользователей
        };

        fetchUserData();
    }, [room.roomUsers]);

    // Для обновления количества поьзователей в комнате
    useEffect(() => {
        setNumberUsers(room.roomUsers?.length)
    }, [room])

    // Проверка является ли пользователь админом
    useEffect(() => {
        setIsAdmin((admin) => {
            room.roomAdmin.forEach(adminID => {
                console.log('ID админа' + adminID);
                console.log('ID поьзователя' + userID);
                if (adminID === userID) {
                     admin = true;
                     console.log ('Пользователь админ')
                }
            });
            return admin
        })
    },[room])


    // Скрипт закрытия окна информации о чате
    const closeInfoWindow = () => {
        setWindowRoomInfo(false);
    }

    const openChangeRoomWindow = () => {
        setChangeRoomWindow(true)
    }

    // Скрипт предоставления прав администратора внутри чата
    const giveAdminUser = async (userID) => {
       await giveUserAdministratorRights(userID, room)
    }

    // Скрипт удаления пользователя из чата
    const deleteUser =  async (userID) => {
        const newRoomDoc = await deleteUserFromChat(userID, room);
        console.log('Новые значения комнаты ', newRoomDoc);
        console.log('Новые значения массива админов комнаты ', newRoomDoc.roomAdmin);
        setIsAdmin(newRoomDoc.roomAdmin);
        setRoom(newRoomDoc);
    }

  return ( // Возвращаем JSX
    <>
    {
        changeRoomWindow ? (
            < ChangeRoom socket={socket} room={room} setChangeRoomWindow={setChangeRoomWindow} />
        ) : (
            <div className='room-info'>
        <div className='room-info__head'>
            <div className='room-info__header-wrapper'>
                <button className='room-info__close' onClick={closeInfoWindow}>
                    <svg className='room-info__close-svg' xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">
                        <path d="M 19.990234 2.9863281 A 1.0001 1.0001 0 0 0 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 A 1.0001 1.0001 0 0 0 3.9902344 2.9902344 A 1.0001 1.0001 0 0 0 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 A 1.0001 1.0001 0 1 0 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 A 1.0001 1.0001 0 1 0 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 A 1.0001 1.0001 0 0 0 19.990234 2.9863281 z"/>
                    </svg>
                </button>
                <h2 className='room-info__header'>Информация о группе</h2>
                {
                    isAdmin ? (
                        <button className='room-info__change' onClick={openChangeRoomWindow} >
                            <svg className='room-info__change-svg' viewBox="0 0 50 50" width="24px" height="24px">
                                <polyline fill="none"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="42.948,12.532 10.489,44.99 3,47 5.009,39.511 37.468,7.052 "/>
                                <path d="M45.749,11.134c-0.005,0.004,0.824-0.825,0.824-0.825c1.901-1.901,1.901-4.983,0.002-6.883c-1.903-1.902-4.984-1.9-6.885,0c0,0-0.83,0.83-0.825,0.825L45.749,11.134z"/>
                                <polygon points="5.191,39.328 10.672,44.809 3.474,46.526 "/>
                            </svg>
                         </button>
                    ) : null
                }
            </div>
            <img className='room-info__avatar' src={room.roomAvatar} alt='Аватарка чата' />
            <div className='room-info__text-info'>
                <h2 className='room-info__chat-name'>{room.roomName}</h2>
                <span className='room-info__number-users'>{numberUsers} участников</span>
            </div>
            <p className='room-info__about'>{room.roomAbout}</p>
        </div>
        <div className='room-info__bottom'>
            <h3 className='room-info__bottom-header'>Участники :</h3>
            <ul className='room-info__user-list'>
                {
                    usersData.map(([username, login, isUserAdmin, userID]) => (
                        <li className='room-info__user-item' key={login}>{username}
                        {
                            isAdmin && !isUserAdmin ? (
                                <div className='room-info__button-wrapper'>
                                    <button className='room-info__button --give-admin' onClick={() => {giveAdminUser(userID, room)}}>+</button>
                                    <button className='room-info__button --kick' onClick={() => deleteUser(userID)}>-</button>
                                </div>
                            ) : null
                        }
                        </li>
                    ))
                }
            </ul>
        </div>
    </div>
        )
    }
    </>
  );
};

export default RoomInfo;