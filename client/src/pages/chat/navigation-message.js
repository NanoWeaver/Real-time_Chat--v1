import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции
import {getUserRooms, roomSearchDatabase} from './script.js' // Импорт функции получения списка комнат пользователя

const NavigationMessage = ({ socket, userLogin, setRoom }) => { // Определение компонента Massages с одним промтом 
  const [creatingChat, setCreatingChat] = useState(false);
  const [addingChat, setAddChat] = useState(false);
  const [rooms, setRooms] = useState([]);
  const roomNameRef = useRef(null);
  const roomLoginRef = useRef(null);

  // Логика для отображения чатов пользователя
  useEffect(() => {
    updateListRooms();
    
    // Функция очистки
    return () => {
      console.log('Компонент размонтирован или userLogin изменился');
    };
  },[userLogin])

  // Скрипт для открытия чата
  const handleRoomClick = (room) => {
    console.log(room)
    socket.emit('join_room', {room}); // Отправляем событие на сервер
    setRoom(room) // Обновляем состояние комнаты
  }

  // Логика обновления чатов пользователя при создании/добавлении комнаты
  useEffect(() => {
    socket.on('rooms_updated', updateListRooms);
  
    return () => {
      socket.off('rooms_updated', updateListRooms);
    };
  }, [userLogin]);

  // Логика обновления чатов пользователя при изминении поледнего сообщения
  useEffect(() => {
    socket.on('last_message_updated', async (data) => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.roomLogin === data.roomLogin 
            ? { ...room, lastMessage: data.lastMessage } 
            : room
        )
      );
    });
  
    return () => {
      socket.off('last_message_updated');
    };
  }, []);

  // Обновление комнат пользователя
  const updateListRooms = async () => {
    const userRoomsList = await getUserRooms(userLogin); // Получаем комнаты пользователя
    const userRoomsObjectArr = []; // Создаём массив для переноса информации о комнатах
    console.log('userRoomsList = ' + userRoomsList)
    // Проходим по всем логинам комнта из объекта пользователя и получаем объекты этих комнат
    for (let i = 0; i < userRoomsList.length; i++) {
      let room = await roomSearchDatabase(userRoomsList[i]);
      console.log('Объект комнаты' + room)
      userRoomsObjectArr.push(room);
    }
    setRooms(userRoomsObjectArr); // Обновляем состояние предовая массив объектов комнат
    console.log(userRoomsObjectArr)
  };

  // Скрипт для открытия окна создания чата
  const showChatCreationForm = () => {
    setAddChat(false);
    setCreatingChat(true);
    console.log('Окно создания чата открыто')
  }

  // Скрипт для создания нового чата
  const createChat = () => {
    if (validationUserName(roomNameRef) && validationUserLogin(roomLoginRef)) {
      socket.emit('creating_room', {
        roomName: roomNameRef.current.value,
        roomLogin: roomLoginRef.current.value,
        userLogin : userLogin
      });
      console.log('Валидация комнаты прошла успешно, отправлен запрос на сервер, логин пользователя ' + userLogin)
      setCreatingChat(false);
    } else {
      console.log('Данные некоректны')
    }
    
  }

  // Отмена создания чата
  const cancelingCreation = () => {
    setCreatingChat(false);
  }

  // Функция открытия окна добавления чата
  const showChatAddForm = () => {
    setCreatingChat(false);
    setAddChat(true);
    console.log('Открыто окно добавления чата')
  }

  // Функция добавления чата пользователю
  const addChat = () => {
    if (validationUserLogin(roomLoginRef)) {
      socket.emit('add_room', {
        roomLogin: roomLoginRef.current.value,
        userLogin : userLogin
      });
      console.log('Валидация комнаты прошла успешно, отправлен запрос на сервер, логин пользователя ' + userLogin)
      setAddChat(false);
    } else {
      console.log('Данные некоректны')
    }
  }

  // Функция отмены добавления чата пользователю
  const cancelingAdd = () => {
    setAddChat(false)
  }

  return ( // Возвращаем JSX
    <div className='navigation-message'>
      <div className='navigation-message__button-wrapper'>
        <button className='navigation-message__button --create-chat' onClick={showChatCreationForm}>Создать чат</button>
        <button className='navigation-message__button --add-chat' onClick={showChatAddForm}>Добавить чат</button>
      </div>
      {
        creatingChat ? (
          <div className='chat-form'>
            <div className='chat-form__form'>
              <input className='chat-form__input' placeholder='Имя чата' ref={roomNameRef}/>
              <input className='chat-form__input' placeholder='Идентификатор чата' ref={roomLoginRef}/>
              <button className='chat-form__button' onClick={createChat}>Создать</button>
              <button className='chat-form__button --cancellation' onClick={cancelingCreation}>Отмена</button>
            </div>
          </div>
        ) : addingChat ?  (
          <div className='chat-form'>
          <div className='chat-form__form'>
            <input className='chat-form__input' placeholder='Идентификатор чата' ref={roomLoginRef}/>
            <button className='chat-form__button --add-button' onClick={addChat}>Добавить</button>
            <button className='chat-form__button --cancellation' onClick={cancelingAdd}>Отмена</button>
          </div>
        </div>
        ) : (
          <div className='navigation-message__rooms-wrapper'>
            {
              rooms.length >= 1 ? (
                <div className="list-massages">
                  {rooms.map((room) => (
                    <div key={room.roomLogin} className='message-wrapper' onClick = {() => handleRoomClick(room)}>
                      <div className='message-wrapper__logo-wrapper'>
                        <img className='message-wrapper__logo' src='/images/userIcon.webp' alt='Иконка пользователя' width={54} height={54}/>
                      </div>
                      <div className='message-wrapper__text-wrapper'>
                        <div className='message-wrapper__head'>
                          <h2 className='message-wrapper__heading'>{room.roomName}</h2>
                          <span className='message-wrapper__time'>{new Date(room.lastMessage?.createdtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className='message-wrapper__footer'>
                        <p className='message-wrapper__text'><span className='message-wrapper__user-name'>{room.lastMessage?.userSenderName}:</span> {room.lastMessage?.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  У вас пока нет чатов
                </div>
              )
            }
            
          </div>
        )
      }
    </div>
  );
};

export default NavigationMessage;