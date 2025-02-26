import './styles.css'; // Импорт стилей
import { useState } from 'react'; // Импорт хуков React
import MessagesArea from './messages-area.js'; // Импорт компонента отображения сообщений  
import SendMessage from './send-message.js'; // Импорт компонента отправки сообщений
import NavigationMessage from './navigation-message.js'
import UserSetting from './user-setting.js'

// Определяем компонент Chat
const Chat = ({ userName, room, socket, userLogin, setRoom, userAvatar, setUserAvatar, setUserName , setUserLogin, userPassword, setUserPassword}) => { // Он принимает три пропса
  const [userSettingOn, SetUserSettingOn] = useState(false);
  return ( // Возвращаемый JSX:
    <div className='connectify'>
        <NavigationMessage socket={socket} userLogin={userLogin} setRoom={setRoom} room={room} userAvatar={userAvatar} SetUserSettingOn={SetUserSettingOn}/>
        {
          !userSettingOn ? (
            <div className='connectify__chat-area'>
              <MessagesArea socket={socket} userName={userName} room={room} userLogin={userLogin} userAvatar={userAvatar}/>
              <SendMessage socket={socket} userName={userName} room={room} userLogin={userLogin} userAvatar={userAvatar}/>
          </div>
          ) : (
            <UserSetting userName={userName} setUserName = {setUserName} userLogin = {userLogin} setUserLogin = {setUserLogin} 
            userPassword = {userPassword} setUserPassword = {setUserPassword} userAvatar={userAvatar} setUserAvatar = {setUserAvatar} />
          )
        }
    </div>
  );
};

export default Chat;