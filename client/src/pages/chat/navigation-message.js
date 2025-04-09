import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции
import {getUserRooms, roomSearchDatabase, roomSearchDatabaseID} from './script.js' // Импорт функции получения списка комнат пользователя

const NavigationMessage = ({ socket, userLogin, setRoom, room, userAvatar ,SetUserSettingOn, userName, userID, userAbout, setUsetAbout, setRoomCreatingOn}) => { // Определение компонента Massages с одним промтом 
  const [creatingChat, setCreatingChat] = useState(false);
  const [addingChat, setAddChat] = useState(false);
  const [rooms, setRooms] = useState([]);
  const roomNameRef = useRef(null);
  const roomLoginRef = useRef(null);
  const [activeRoom, setActiveRoom] = useState(room) // Создаём состояние для хранения активной комнаты
  const [optionsСovered, setOptionsСovered] = useState(false)

  // Логика для отображения чатов пользователя
  useEffect(() => {
    updateListRooms();
    console.log('Логин пользователя в компоненте navigation-massage :' + userLogin)
    // Функция очистки
    return () => {
      console.log('Компонент размонтирован или userLogin изменился');
    };
  },[userLogin])

  // Скрипт для открытия чата
  const handleRoomClick = (room) => {
    console.log(room)
    socket.emit('join_room', {room, userName, userLogin}); // Отправляем событие на сервер
    setRoom(room); // Обновляем состояние комнаты
    setActiveRoom(room); // Обновляем состояние активной комнаты
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
    const userRoomsList = await getUserRooms(userID); // Получаем комнаты пользователя
    const userRoomsObjectArr = []; // Создаём массив для переноса информации о комнатах
    console.log('userRoomsList = ' + userRoomsList)
    // Проходим по всем логинам комнт из объекта пользователя и получаем объекты этих комнат
    for (let i = 0; i < userRoomsList.length; i++) {
      let room = await roomSearchDatabaseID(userRoomsList[i]);
      console.log('Объект комнаты ' + room)
      userRoomsObjectArr.push(room);
    }
    setRooms(userRoomsObjectArr); // Обновляем состояние предовая массив объектов комнат
    console.log(userRoomsObjectArr)
  };

  // Скрипт для открытия опций
  const openOptions = () => {
    setOptionsСovered(true)
  }

   // Скрипт для закрытия опций
   const closeOptions = () => {
    setOptionsСovered(false)
  }

  // Скрипт для открытия окна создания чата
  const showChatCreationForm = () => {
    setAddChat(false);
    setCreatingChat(true);
    console.log('Окно создания чата открыто')
  }

   // Скрипт для открытия компонента создания чата
   const showChatCreation = () => {
    setRoomCreatingOn(true)
  }

  // Скрипт для создания нового чата
  const createChat = () => {
    if (validationUserName(roomNameRef) && validationUserLogin(roomLoginRef)) {
      socket.emit('creating_room', {
        roomName: roomNameRef.current.value,
        roomLogin: roomLoginRef.current.value,
        userID : userID
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
        userID : userID
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

  const userSettingOn = () => {
    SetUserSettingOn(true)
  }

  return ( // Возвращаем JSX
    <div className='navigation-message'>
      
        {
          optionsСovered ? (
            <div className='navigation-message__button-wrapper'>
              <button className='navigation-message__options' onClick={closeOptions}>
                <svg className='navigation-message__options-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="30px" height="20px">
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="9" x2="2" y2="9"/>
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="2" x2="2" y2="2"/>
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="16" x2="2" y2="16"/>
                </svg>
              </button>
              <button className='navigation-message__button --create-chat' onClick={showChatCreation}>Создать чат</button>
              <button className='navigation-message__button --add-chat' onClick={showChatAddForm}>Добавить чат</button>
              <button className='navigation-message__setting' onClick={userSettingOn}>
                <svg className='navigation-message__setting-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
                  <path style={{strokeWidth:4,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} d="M46.999,27.708v-5.5l-6.546-1.07c-0.388-1.55-0.996-3.007-1.798-4.342l3.815-5.437L38.58,7.472l-5.368,3.859c-1.338-0.81-2.805-1.428-4.366-1.817L27.706,3h-5.5l-1.06,6.492c-1.562,0.383-3.037,0.993-4.379,1.799l-5.352-3.824l-3.889,3.887l3.765,5.384c-0.814,1.347-1.433,2.82-1.826,4.392l-6.464,1.076v5.5l6.457,1.145c0.39,1.568,1.009,3.041,1.826,4.391l-3.816,5.337l3.887,3.891l5.391-3.776c1.346,0.808,2.817,1.423,4.379,1.808L22.206,47h5.5l1.156-6.513c1.554-0.394,3.022-1.013,4.355-1.824l5.428,3.809l3.888-3.891l-3.875-5.38c0.802-1.335,1.411-2.794,1.795-4.344L46.999,27.708z"/>
                  <circle style={{strokeWidth:4,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} cx="25" cy="25" r="5"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className='navigation-message__button-wrapper'>
              <button className='navigation-message__options' onClick={openOptions}>
                <svg className='navigation-message__options-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="30px" height="20px">
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="9" x2="2" y2="9"/>
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="2" x2="2" y2="2"/>
                  <line style={{strokeWidth:2,strokeLinecap:'round',strokeMiterlimit:10}} x1="28" y1="16" x2="2" y2="16"/>
                </svg>
              </button>
              <input className='navigation-message__search-input'/>
              <button className='navigation-message__search-button' key="search">
                <svg className='navigation-message__search-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20px" height="20px">
                  <circle strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="8" cy="8" r="6"/>
                  <line strokeWidth="2" strokeMiterlimit="10" x1="11" y1="12" x2="18" y2="19"/>
                </svg>
              </button>
            </div>
          )
        }
        

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
                    <div key={room.roomID} className={`message-wrapper ${activeRoom.roomLogin === room.roomLogin ? 'message-wrapper--active' : ''}`} onClick = {() => handleRoomClick(room)}>
                      <div className='message-wrapper__logo-wrapper'>
                        <img className='message-wrapper__logo' src={room.roomAvatar}  alt='Иконка Чата' width={54} height={54}/>
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