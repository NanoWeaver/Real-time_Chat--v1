import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {gettingUserDataId} from './../registration/script.js'

const RoomInfo = ({ socket, room }) => { // Определение компонента Massages с одним промтом 
    const [usersData, setUsersData] = useState([]); // Состояние для хранения данных пользователей

    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedData = await Promise.all(
                room.roomUsers.map(async (user) => await gettingUserDataId(user))
            );
            setUsersData(fetchedData); // Обновляем состояние массива данных пользователей
        };

        fetchUserData();
    }, [room.roomUsers]);

  

  return ( // Возвращаем JSX
    <div className='room-info'>
        <div className='room-info__header'>
            <img className='room-info__avatar' src={room.roomAvatar} alt='Аватарка чата' />
            <div className='room-info__text-info'>
                <h2 className='room-info__chat-name'>{room.roomName}</h2>
            </div>
            <p className='room-info__about'>{room.roomAbout}</p>
        </div>
        <div className='room-info__bottom'>
            <ul className='room-info__user-list'>
                {
                    usersData.map(([username, login], index) => (
                        <li key={index}>{username}</li>
                    ))
                }
            </ul>
        </div>
    </div>
  );
};

export default RoomInfo;