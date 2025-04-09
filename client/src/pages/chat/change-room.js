import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {gettingUserDataId} from './../registration/script.js'
import ChoosingAvatar from '../registration/choosing-avatar.js'

const ChangeRoom = ({ socket, room, setChangeRoomWindow }) => { 
  const [photoSVG, setPhotoSVG] = useState('') ; // Состояние для показа значака изминения фото
  const [choosingAvatar, setChoosingAvatar] = useState(false); // Состояние для отоборажения компонента изминения аватарки
  const [buttonCancel, setButtonCancel] = useState(true); // Состояние для показа кнопки Отмена
  const [roomAvatarURL, setRoomAvatarURL] = useState(room.roomAvatar); // Состояние для хранения аватраки группы
  const [newRoomName, setNewRoomName] = useState(room.roomName); // Состояние для хранения нового имени чата
  const [newRoomAbout, setNewRoomAbout] = useState(''); // Состояние для хранения нового опичсания чата
  const [newRoomLogin,setNewRoomLogin] = useState(room.roomLogin); // Состояние для хранения нового логина чата
  const itsRoom = true;

  // Следим за изминением фото , передаём запрос на сервер
  useEffect(() => {
    const comparisonСhanges = () => {
      let newValues = {roomID : room.roomID};
      if (roomAvatarURL !== room.roomAvatar) newValues.newAvatar = roomAvatarURL;
      if (newRoomName !== room.roomName) newValues.newName = newRoomName;
      if (newRoomAbout !== room.roomAbout) newValues.newAbout = newRoomAbout;
      if (newRoomLogin !== room.roomLogin) newValues.newLogin = newRoomLogin;

      return newValues
    };

    const newValues = comparisonСhanges();

    if (Object.keys(newValues).length >=1) {
      socket.emit('change_room', newValues); // Если хть что-то было изменено ,то отправляем это на сервер
    }

  },[roomAvatarURL, newRoomName, newRoomAbout, newRoomLogin])

  // Скрипт закрытия окна изминения и переход к информации о чате
  const closeChangeRoomWindow = () => {
    setChangeRoomWindow(false);
  }

  // Скрипт для назначения класса для показа SVG 
  const openPhotoSVG = () => {
    setPhotoSVG('change-room__SVG--open-SVG')
  }

  // Скрипт снятия класса показа SVG иконки
  const closePhotoSVG = () => {
    setPhotoSVG('')
  }

  // Скрипт открытия компонента изминения аватарки
  const openChoosingAvatar = () => {
    setChoosingAvatar(true)
  }

  // Скрипт закрытия компонента изминения аватарки
  const closeChoosingAvatar = () => {
    setChoosingAvatar(false)
  }

  return ( // Возвращаем JSX
    <div className='change-room'>
      <div className='change-room__head'>
        <button className='change-room__back' onClick={closeChangeRoomWindow}>
          <svg className='change-room__back-svg'  width="24px" height="24px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1">
            <path d="M50,24H6.83L27.41,3.41a2,2,0,0,0,0-2.82,2,2,0,0,0-2.82,0l-24,24a1.79,1.79,0,0,0-.25.31A1.19,1.19,0,0,0,.25,25c0,.07-.07.13-.1.2l-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l24,24a2,2,0,1,0,2.82-2.82L6.83,28H50a2,2,0,0,0,0-4Z"/>
          </svg>
        </button>
        <h2 className='change-room__heading'>Изминения</h2>
      </div>
      {
        !choosingAvatar ? (
          <div className='change-room__room-avatar-wrapper' onMouseEnter={openPhotoSVG} onMouseLeave={closePhotoSVG} onClick={openChoosingAvatar}>
            <img className='change-room__room-avatar' src={room.roomAvatar} alt='Фото чата' />
            <svg className={`change-room__SVG ${photoSVG}`} width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 3V5.5M18.5 8V5.5M18.5 5.5H16M18.5 5.5H21"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        ) : (
          <div className='change-room__room-avatar-wrapper'>
            <ChoosingAvatar setButtonCancel = {setButtonCancel} setRoomAvatarURL = {setRoomAvatarURL} itsRoom = {itsRoom}/>
            {
              buttonCancel ? (
                <button className='change-room__room-avatar-cancel --cancel-setting' onClick={closeChoosingAvatar}>Отмена</button>
              ) : null
            }
            
          </div>
        )
      }
      <div className='change-room__info-wraper'>
        <input type='text' className='change-room__info-input' value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} onBlur={(e) => setNewRoomName(e.target.value)} />
        <input type='text' className='change-room__info-input' value={newRoomLogin} onChange={(e) => setNewRoomLogin(e.target.value)} onBlur={(e) => setNewRoomLogin(e.target.value)}/>
        <textarea className='change-room__info-input' rows={5} onBlur={(e) => setNewRoomAbout(e.target.value)}>{room.roomAbout}</textarea>
      </div>
    </div>
  );
};

export default ChangeRoom;