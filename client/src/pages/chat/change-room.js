import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {gettingUserDataId} from './../registration/script.js'

const ChangeRoom = ({ socket, room, setChangeRoomWindow }) => { // Определение компонента Massages с одним промтом 
   
  const closeChangeRoomWindow = () => {
    setChangeRoomWindow(false);
  }

  return ( // Возвращаем JSX
    <div className='change-room'>
      <div className='change-room__head'>
        <button className='change-room__back' onClick={closeChangeRoomWindow}>
          <svg className='change-room__back-svg'  width="24px" height="24px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1">
            <path d="M50,24H6.83L27.41,3.41a2,2,0,0,0,0-2.82,2,2,0,0,0-2.82,0l-24,24a1.79,1.79,0,0,0-.25.31A1.19,1.19,0,0,0,.25,25c0,.07-.07.13-.1.2l-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l24,24a2,2,0,1,0,2.82-2.82L6.83,28H50a2,2,0,0,0,0-4Z"/>
          </svg>
        </button>
        <h2 className='change-room__heading'>Иминения</h2>
      </div>
      <div className='change-room__room-avatar-wrapper'>
        <img className='change-room__room-avatar' src={room.roomAvatar} alt='Фото чата' />
      </div>
      <div className='change-room__info-wraper'>
        <input type='text' className='change-room__info-input' value={room.roomName} />
        <input type='text' className='change-room__info-input' value={room.roomLogin} />
        <textarea className='change-room__info-input' rows={5}>{room.roomAbout}</textarea>
      </div>
    </div>
  );
};

export default ChangeRoom;