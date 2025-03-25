import './styles.css'; // Импорт стилей
import { useState } from 'react'; // Импорт хуков React
import MessagesArea from './messages-area.js'; // Импорт компонента отображения сообщений  
import SendMessage from './send-message.js'; // Импорт компонента отправки сообщений
import NavigationMessage from './navigation-message.js'
import UserSetting from './user-setting.js'
import CreatingRoom from './creating-room.js'
import RoomInfo from './room-info.js';

// Определяем компонент Chat
const Chat = ({ userName, room, socket, userLogin, setRoom, userAvatar, setUserAvatar, setUserName , setUserLogin, userPassword, setUserPassword, userID, userAbout, setUserAbout}) => { // Он принимает три пропса
  const [userSettingOn, SetUserSettingOn] = useState(false);
  const [roomCreatingOn, setRoomCreatingOn] = useState(false);
  const [windowRoomInfo, setWindowRoomInfo] = useState(false) // Состояние для отслеживания открыто ли окно инофрмации о чате
  return ( // Возвращаемый JSX:
    <div className='connectify'>
        <NavigationMessage socket={socket} userLogin={userLogin} setRoom={setRoom} room={room} userAvatar={userAvatar} SetUserSettingOn={SetUserSettingOn} userID={userID} userName={userName} userAbout = {userAbout} setUserAbout = {setUserAbout} setRoomCreatingOn = {setRoomCreatingOn}/>
        { 
          roomCreatingOn ? (
            <CreatingRoom setRoomCreatingOn = {setRoomCreatingOn} socket={socket} userID={userID} />
          ) : !userSettingOn ? (
              <div className='connectify__chat-area-box'>
                {
                  windowRoomInfo ? (
                    <RoomInfo socket={socket} room={room} setWindowRoomInfo = {setWindowRoomInfo} userID = {userID} />
                  ) : null
                }
                <div className='connectify__chat-area'>
                <MessagesArea socket={socket} userName={userName} room={room} userLogin={userLogin} userAvatar={userAvatar} userID={userID} setWindowRoomInfo = {setWindowRoomInfo}/>
                <SendMessage socket={socket} userName={userName} room={room} userLogin={userLogin} userAvatar={userAvatar} userID={userID} />
              </div>
              </div>
            ) : (
              <UserSetting userName={userName} setUserName = {setUserName} userLogin = {userLogin} setUserLogin = {setUserLogin} 
              userPassword = {userPassword} setUserPassword = {setUserPassword} userAvatar={userAvatar} setUserAvatar = {setUserAvatar} 
              SetUserSettingOn = {SetUserSettingOn} userID = {userID} userAbout = {userAbout} setUserAbout = {setUserAbout} />
            )
        }
    </div>
  );
};

export default Chat;