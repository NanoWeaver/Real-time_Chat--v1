import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {getMessagesRoom} from '../chat/script.js'
import RoomOptions from './room-option.js';

const MessagesArea = ({ socket, userName, userLogin, room, userID, setWindowRoomInfo }) => { // Определение компонента Massages с одним промтом 
  const [messagesReceived, setMessagesReceived] = useState([]); // Определяем состояние для хранения сообщений
  const messagesEndRef = useRef(); // Будем получать ссылку на DOM последнего сообщения
  const [numberUsers,setNumberUsers] = useState(0); // Хранение колличества пользователей в комнате
  const [menuVisible, setMenuVisible] = useState(false) // Состояние для открытия функций внутри чата
  const messagesAreaOption = useRef();
  const [messageSearchField, setMessageSearchField] = useState(false) // Отображение инпута поиска сообщений
  const [searchQuery, setSearchQuery] = useState('') // Хранение текста поискового запроса
  const messageRefs = useRef(new Map()); // Map для хранения рефов сообщений
  const [searchResults, setSearchResults] = useState([]); // Состояние для хранение результатов поиска по сообщениям
  const [showNavigationArrows, setShowNavigationArrows] = useState(false) // Состояние отображения стрелок перехода по найденым сообщениям
  const [indexSelectedMessageSearch, setIndexSelectedMessageSearch] = useState(0) // Состояние для хранения на каком мы сейчас собщении , для отработки логики прижков

  // Прокрутка чата до последнего сообщения 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messagesReceived]);

  useEffect(() => {
    setNumberUsers(room.roomUsers?.length)
    console.log(' Колличесвто пользователей в комнате = ' ,numberUsers)
  }, [room])


  // Загрузка истории чата 
  useEffect(() => {
    socket.on('loading_message_history', async (data) => {
      console.log('Логин пользователя в конмпоненте messages-area :' + userLogin)
      console.log('А содержимое массива сообщений messagesReceived ', data);
      setMessagesReceived(data || [])
    })
  })

  // Чистим область сообщений при смене чата
  useEffect(() => {
    setMessagesReceived([]);
  },[room])

  // Обработка завершения поиска с сервера
  useEffect(() => {
    const handleSearchResults = (data) => {
      console.log('Содержимое data ' , data)
      setSearchResults(data);
      scrollToMessage(data[0].createdtime);
      setIndexSelectedMessageSearch(0);
      console.log('Центрируем на самом новом подходящем сообщении')
    };

    socket.on('chat_message_search_results', handleSearchResults);

    return () => {
      socket.off('chat_message_search_results', handleSearchResults);
    };
  }, []); 

  // Обработка отображения стрелок вверх\вниз
  useEffect(() => {
    if (searchResults.length > 1) {
      setShowNavigationArrows(true)
    }
  },[searchResults])

  // Принятие сообщения с сервера и его отображение
  useEffect(() => {
    socket.on('receive_message', (data) => { // Обрабатывем сообщение с сервера
      console.log('Отобразили сообщение от пользователя с ником ' + userName)
      const isCurrentUser = data.userLogin === userLogin // Кто автор сообщения пользователь или нет
      setMessagesReceived((prev) => [
        ...prev,
        {
          message: data.message,
          userName: data.userName,
          userAvatar: data.userAvatar,
          createdtime: data.createdtime,
          isCurrentUser
        },
      ]);
      console.log('Приняли и отобразили сообщение пользователя в чате')
      console.log('Логин пользователя ' + userLogin + '. Имя пользователя ' + userName)
      console.log('ID сообщения ' , data)
    });
    
    return () => {
      socket.off('receive_message'); // Отписываемся от события при размонтировании
    };
  }, [socket]);

  // Переключение видимости функций чата
  const switchingMenuVisibility = () => {
    if (menuVisible) {
      setMenuVisible(false)
    } else setMenuVisible(true)
  }

  // Скрипт выхода из чата
  const handleLeaveChat = () => {
    socket.emit('leave_chat', {userID, roomID : room.roomID});
    setMenuVisible(false)
  }

  const handleToggleSound = () => {
    
  }

  // Скрипт отработки кнопки поиска в меню функций чата
  const handleSearchMessages = () => {
    setMessageSearchField(true);
    setMenuVisible(false);
    console.log(messageSearchField)
  }

  // Скрипт отправки поиского запроса на сервер
  const searchInsideChat = () => {
    if (!searchQuery) return;
    socket.emit('chat_search', {messagesReceived,searchQuery});
    console.log('Запрос на поиск был отправлен на сервер');
  }

  // Скрипт для назначения двух рефов на один элемент сообщения
  const assignRefs = (el, createdTime) => {
    if (!el) return;
    messagesEndRef.current = el;
    messageRefs.current.set(createdTime, el);
  }

  // Функция прыжков по найденым сообщениям
  const scrollToMessage = (createdTime) => {
    console.log('значене таймера createdTime ' + createdTime)
    const foundMessage = messageRefs.current.get(createdTime);
    if (foundMessage) {
      foundMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('Переместились на сообщение с таймингом ' + createdTime)
    }
  };

  // Функция прыжка к более старому сообщению
  const jumpOldMessage = () => {
    if (indexSelectedMessageSearch !== searchResults.length - 1) {
      setIndexSelectedMessageSearch((prevIndex) => {
        const newIndex = ++prevIndex;
        scrollToMessage(newIndex);
        return newIndex;
      })
    };
  };

  // Функция прыжка к более новому сообщению
  const jumpNewMessage = () => {
    if (indexSelectedMessageSearch !== 0) {
      setIndexSelectedMessageSearch((prevIndex) => {
        const newIndex = --prevIndex;
        scrollToMessage(newIndex);
        return newIndex;
      })
    };
  };

  // Скрипт открытия информации о чате
  const openRoomInfo = () => {
    setWindowRoomInfo(true);
    console.log('Объект комнаты ' ,room)
  }

  return ( // Возвращаем JSX
    <div className='messages-area'>
      <div className='messages-area__head' onClick={openRoomInfo}>
        <img className='messages-area__logo' src={room.roomAvatar} alt='Иконка пользователя' width={42} height={42}/>
        {
          messageSearchField ? (
            <div className='messages-area__search-wrapper'>
              <input type='text' autoFocus className='navigation-message__search-input' onChange={e => setSearchQuery(e.target.value)}/>
              {
                showNavigationArrows ? (
                  <div className='navigation-arrows__wrapper'>
                    <button onClick={jumpOldMessage} className='navigation-message__search-button' key="search">
                    <svg style={{rotate: '-90deg'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path  fill-rule="evenodd" d="m7.25 17l7.5-5l-7.5-5a.901.901 0 1 1 1-1.5l8.502 5.668a1 1 0 0 1 0 1.664L8.25 18.5a.901.901 0 1 1-1-1.5"/>
                    </svg>
                    </button>
                    <button onClick={jumpNewMessage} className='navigation-message__search-button' key="search">
                      <svg style={{rotate: '90deg'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path  fill-rule="evenodd" d="m7.25 17l7.5-5l-7.5-5a.901.901 0 1 1 1-1.5l8.502 5.668a1 1 0 0 1 0 1.664L8.25 18.5a.901.901 0 1 1-1-1.5"/>
                      </svg>
                    </button>
                  </div>
                ) : false
              }
              <button className='navigation-message__search-button' key="search" onClick={searchInsideChat}>
                <svg className='navigation-message__search-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20px" height="20px">
                  <circle stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" cx="8" cy="8" r="6"/>
                  <line stroke-width="2" stroke-miterlimit="10" x1="11" y1="12" x2="18" y2="19"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className='messages-area__info-wrapper'>
              <h1 className='messages-area__heading'>{room.roomName}</h1>
              <span className='messages-area__number-users'>{numberUsers} участников</span>
            </div>
          )
        }
        <button className='messages-area__option' onClick={(e) => { 
          e.stopPropagation();
          switchingMenuVisibility();
          }} ref={messagesAreaOption}>
          <svg className='messages-area__option-svg' width="5" height="20" viewBox="0 0 5 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2.5" cy="17.5" r="2" />
            <circle cx="2.5" cy="10" r="2"/>
            <circle cx="2.5" cy="2.5" r="2" />
          </svg>
        </button>
      </div>
      <div className='messages-area__content'>
        <RoomOptions visible = {menuVisible} onLeaveChat = {handleLeaveChat} onToggleSound = {handleToggleSound} onSearchMessages = {handleSearchMessages} />
        {messagesReceived.map((msg, i) => (
        <div  key={msg.createdtime} ref={(el) => assignRefs(el, msg.createdtime)} className={`message__box message__box--${msg.isCurrentUser ? 'you' : 'they'}`}>
          <div key={i} className={`message__wrapper message__wrapper--${msg.isCurrentUser ? 'you' : 'they'}`}>
          <div className='message__head'>
            <img className='message__user-avatar' src={msg.userAvatar} width={45} height={45}/>
            <span className='message__user-name'>{msg.userName} </span> <span className='message__time'>{new Date(msg.createdtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className='message__text'>{msg.message}</p>
        </div>
        </div>
      ))}
      </div>
  </div>
  );
};

export default MessagesArea;