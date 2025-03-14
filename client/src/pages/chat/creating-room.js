import './styles.css'; // Импортируем стили
import ChoosingAvatar from '../registration/choosing-avatar.js'
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import { validationUserName, validationUserLogin} from '../../validation/index.js'; // Импортируем функции


const CreatingRoom = ({setRoomCreatingOn, socket, userID}) => { // Определение компонента Massages с одним промтом 
  const roomName = useRef('');
  const roomLogin = useRef('');
  const roomAbout = useRef('');
  const [roomAvatarURL, setRoomAvatarURL] = useState('')
  const itsRoom = true;

  // Скрипт создания чата
  const roomCreating = () => {
    let creationAllowed = false;

    if (validationUserName(roomName.current.value) && validationUserLogin(roomLogin.current.value)) {
        creationAllowed = true;
    } else console.log('Данные некоректны')

    socket.emit('creating_room', {
      roomName: roomName.current.value,
      roomLogin: roomLogin.current.value,
      roomAbout: roomAbout.current.value,
      roomAvatar: roomAvatarURL,
      userID : userID
    });
  }

  // Скрипт закрытия компонента создания чата
  const closeRoomCreating = () => {
    setRoomCreatingOn(false)
  }

  return ( // Возвращаем JSX
    <div className='creating-room__box'>
        <div className='creating-room__avatar-wrapper'>
            <h2 className='creating-room__heading'>Загрузите фото чата</h2>
            <ChoosingAvatar setRoomAvatarURL = {setRoomAvatarURL} itsRoom = {itsRoom}/>
        </div>
        <div className='creating-room__info-box'>
            <h2 className='creating-room__heading'>Придумайте имя и описание</h2>
            <div className='creating-room__info-wrapper'>
                <label>Выберите название чата</label>
                <input className='creating-room__input' type='text' ref={roomName}/>
            </div>
            <div className='creating-room__info-wrapper'>
                <label>И его уникальный логин</label>
                <input className='creating-room__input' type='text' ref={roomLogin}/>
            </div>
            <div className='creating-room__info-wrapper'>
                <label>Напишите об этом чате</label>
                <textarea className='creating-room__input' ref={roomAbout} rows={5}></textarea>
            </div>
            <div className='creating-room__button-wrapper'>
                <button className='creating-room__button --save-setting' onClick={roomCreating}>Создать</button>
                <button className='creating-room__button --cancel-setting' onClick={closeRoomCreating}>Отмена</button>
            </div>
        </div>
    </div>
  );
};

export default CreatingRoom;