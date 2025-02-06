import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции

const NavigationMessage = ({ socket, userLogin }) => { // Определение компонента Massages с одним промтом 
  const [creatingChat, setCreatingChat] = useState(false);
  const roomNameRef = useRef(null);
  const roomLoginRef = useRef(null);

  // Скрипт для открытия окна создания чата
  const showChatCreationForm = () => {
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

  const showChatAddForm = () => {
    console.log('Добавлен в чат')
  }

  return ( // Возвращаем JSX
    <div className='navigation-message'>
      <div className='navigation-message__button-wrapper'>
        <button className='navigation-message__button --create-chat' onClick={showChatCreationForm}>Создать чат</button>
        <button className='navigation-message__button --add-chat' onClick={showChatAddForm}>Добавить чат</button>
      </div>
      {
          creatingChat ? (
            <div className='creatingChat'>
              <div className='creatingChat__form'>
                <input className='creatingChat__input' placeholder='Имя чата' ref={roomNameRef}/>
                <input className='creatingChat__input' placeholder='Идентификатор чата' ref={roomLoginRef}/>
                <button className='creatingChat__button' onClick={createChat}>Создать</button>
                <button className='creatingChat__button --cancellation' onClick={cancelingCreation}>Отмена</button>
              </div>
            </div>
          ) : (
            <div className='navigation-message__rooms-wrapper'>
              <div>
                У вас пока нет чатов
              </div>
            </div>
          )
        }
    </div>
  );
};

export default NavigationMessage;