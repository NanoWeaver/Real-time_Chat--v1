import './styles.css'; // Импорт стилей
import ChoosingAvatar from './choosing-avatar.js'


const AvatarRegistration = ({setUserAvatar, userLogin, userAvatar}) => {

  return (
    <div className='home__container'>
      <h1 className='home__heading'>Регистрация в Connectify</h1>
      <p className='home__subtitle'>Настройте свой профиль:<br/>выберите любимую аватарку!</p>

      <ChoosingAvatar setUserAvatar = {setUserAvatar} userLogin = {userLogin} userAvatar = {userAvatar}/>

      <p className='home__subtitle'>
        Есть аккаунт? <span className='home__link'>Вход</span>.
      </p>
    </div>
  );
};

export default AvatarRegistration;