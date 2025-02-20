import './styles.css'; // Импорт стилей
import { useRef, useState } from 'react'; // Импорт реакт хуков
import Cropper from 'react-cropper'; // Импорт библиотеки для обрезки фото пользователя
import 'cropperjs/dist/cropper.css';

const AvatarRegistration = () => {
  const [draggingActive, setDraggingActive] = useState(false); // Создаём состояние для флага начал ли пользователь тащить изображение
  const [selectedFile, setSelectedFile] = useState(null); // Состояние для хранения выбраного изображения
  const [croppedImage, setCroppedImage] = useState(null); // Состояние для хранения обрезанного изображения
  const cropperRef = useRef(null);

  // Обработчик выбора файла
  const handleFileSelect = (file) => {
    if (file && file.type.match('image.*')) {
      setSelectedFile(file); // Если это фото то сохроняем его
    }
  };

  // Drag and Drop обработчики
  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggingActive(true); // Над блоком что-то тащат
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggingActive(false); // Перестали тащить над блоком
  };

  const handleDrop = (e) => { // Что-то сбросили в блок
    e.preventDefault();
    setDraggingActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file); // Проверяем фото ли это
  };

  // Обрезка изображения
  const getCroppedImage = () => {
    if (cropperRef.current) { //  Получает текущий экземпляр Cropper через ссылку
      cropperRef.current.cropper // Обращается к внутреннему API Cropper
        .getCroppedCanvas() // Создаёт HTML-элемент <canvas> с обрезанным изображением.
        .toBlob((blob) => { // Конвертирует содержимое <canvas> в объект Blob
          setCroppedImage(blob); // Сохраняет обрезанное изображение в состоянии React
          // Здесь можно сразу вызвать загрузку на сервер
          // uploadAvatar(blob);
        });
    }
  };

  const sendCroppedImage = () => {
    console.log('Изображение ушло на сервер')
  }

  // Отмена выбора
  const handleCancel = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  return (
    <div className='home__container'>
      <h1 className='home__heading'>Регистрация в Connectify</h1>
      <p className='home__subtitle'>Настройте свой профиль:<br/>выберите любимую аватарку!</p>

      {!selectedFile ? (
        <div 
          className={`avatar__wrapper ${draggingActive ? 'avatar__wrapper--dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            className="avatar__input" 
            type="file" 
            id="file-input" 
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <label className="avatar__label" htmlFor="file-input">
            Выберите файл
          </label>
          <span className="avatar__sub-title">или перетащите его сюда</span>
        </div>
      ) : ( !croppedImage ? (
        <div className="cropper-container">
          <Cropper
            ref={cropperRef} // Получаем ссылку на DOM экземпляр
            src={URL.createObjectURL(selectedFile)} // Передаём картинку
            aspectRatio={1} // Соотношение сторон для шаблона обрезки
            viewMode={1} // Можно ли перетаскивать изображение (1 - нет)
            guides={true} // Направляющие линии для обрезки
            minCropBoxWidth={100} // Мин область для обрезки в px
            minCropBoxHeight={100} // Мин область для обрезки в px
            responsive={true} // Изменение размеров Cropper при уменьшении контейнера
            autoCropArea={1} // Какая часть изображения будет автоматически выделена для обрезки
            checkOrientation = {false} // Отключает проверку ориентации изображения
          />
        </div>
      ) : (
        <img src={URL.createObjectURL(croppedImage)} alt="Обрезанное изображение"/>
      )
      )}

      <div className="buttons-wrapper">
        {selectedFile && (
          <button 
            className='home__button --secondary-button'
            onClick={handleCancel}
          >
            Отмена
          </button>
        )}
        <button 
          className='home__button --primary-button' 
          onClick={!croppedImage ? getCroppedImage : sendCroppedImage}
          disabled={!selectedFile}
        >
          {croppedImage ? 'Загрузить' : 'Обрезать'}
        </button>
      </div>

      <p className='home__subtitle'>
        Есть аккаунт? <span className='home__link'>Вход</span>.
      </p>
    </div>
  );
};

export default AvatarRegistration;