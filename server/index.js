import express from 'express'; // Импортируем Express
const app = express(); // Создаём экземпляр приложения Express 
import http from 'http'; // Импортируем встроенный модуль Node для создания сервера
import cors from 'cors'; // Импортируем библиотека для принятия запросов из других доменов
import { Server } from 'socket.io'; // Импортируем класс с помощью деструктуризации объекта  
import { userSearchDatabaseLogin, userSearchDatabaseID, verifyinUserPassword, registerUser, gettingUserDataId } from '../client/src/pages/registration/script.js'; // Импортируем наши функции работы с бд 
import { roomSearchDatabase, registerRoom, addingRoomUser, addingUserRoom, addMessage, changingLastMessage, getMessagesRoom, searchMessages, removingRoomUser, removingUserRoom, changingRoomAvatar, changingRoomName, changingRoomLogin, changingRoomAbout, searchPrivateChat } from '../client/src/pages/chat/script.js'; // Импортируем наши функции работы с бд 
app.use(cors()); // Добавляем промежуточное CORS ПО , для обработки запросов с других доменов

const server = http.createServer(app); // Создаём HTTP сервер с помощью экземпляра Express

 // Создаем сервер Socet.io , передовая ему созданный HTTP сервер и настройку CORS 
 // (подключения только с домена http://localhost:3000 и разрешаем методы GET POST)
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'OPTIONS'],
    },
});

const CHAT_BOT = 'ChatBot'; // Имя чат бота
let chatRoom = ''; // Переменная для хранения названия комнаты , к которой подключился пользователь
let allUsers = []; // Массив для хранения всех пользователей в комнате 

io.on('connection', (socket) => { // Обработка подключения пользователей , слушаем событие connection
    console.log(`User connected ${socket.id}`); // Выводим id пользователя в консоль
  
    // Обработка захода в комнату
    socket.on('join_room', async (data) => {
        const {room} = data; // Деструктуризируем объект
        // Получаем список объектов сообщений
        const massagesList = await getMessagesRoom(room.roomID);
        console.log('Список объектов сообщений из переменной massagesList ', massagesList)
        let senderName = ''; // Переменная для хранения имени пользователя
        let senderLogin = '';
        // Обновляем значение имени пользователя
        // Перебираем объекты сообщений для маркировки по типо От пользователя или Нет
        let massagesListFinal = await Promise.all(
            massagesList.map( async (msg) => {
                console.log('Переделываем объект сообщения и определяес значение isCurrentUser');
                console.log('Логин отправителя = ' + msg.userLogin + ' А логин текущего пользователя ' + data.userLogin);
        
                const userDoc = await userSearchDatabaseID(msg.userID);
                senderName = userDoc.userName;
                senderLogin = userDoc.userLogin;
                msg.userLogin = senderLogin;
                  
                return {
                  ...msg,
                  // Устанавливаем имя отправителя по логике имя пользователя или имя другого 
                  userName: senderName,
                  // Маркеруем сообщение от пользователя или нет
                  isCurrentUser: msg.userLogin === data.userLogin
                }
              })
        ) 
        // Переворачиваем массив (Потом поправлю)
        massagesListFinal = massagesListFinal.reverse()
        console.log('Значение финального массива сообщений ',massagesListFinal)
        socket.emit('loading_message_history', massagesListFinal); // Отправляем событие для загрузки сообщений
        console.log('Подключаем пользователя к комнате ' + room.roomLogin)
        socket.join(room.roomLogin) // Подключаем пользователя к комнате
        console.log('Пользователь подключен к комнате ' + room.roomLogin)
    });

    // Обработка отправки сообщения пользователем
    socket.on('send_message', async (data) => {
        const { room, message, userID, userName, createdtime, userAvatar, userLogin } = data;
        console.log('Пользователь с ID ' + userID + ' отправил сообщение')
        io.to(room.roomLogin).emit('receive_message', { // Отправляем сообщение всем в комнате
            message,
            userName,
            userAvatar,
            createdtime,
            userLogin,
            userID,
        });
        // Добавляем сообщение в бд
        await addMessage(room.roomID, room.roomLogin, message, userID, createdtime, userAvatar  )
        // Изминяем последнее собщение в комнате
        const lastMessage = await changingLastMessage(userID, room.roomID, message,  createdtime, room.roomLogin)
        // Отправляем событие обновления последнего сообщения
        // Предворительно получив актаульное имя пользователя
        const [userNameLastMessage, userLoginLastMessage] = await gettingUserDataId(userID);
        lastMessage.userSenderName = userNameLastMessage; // Устанавливаем имя пользователя
        io.emit('last_message_updated', { roomLogin: room.roomLogin, lastMessage});
    });

    // Обработка запроса на регистрацию
    socket.on('send_registr', async (data) => {
        // Ищем пользователя в бд
        const searchResult = await userSearchDatabaseLogin(data.userLogin)
        if (!searchResult) { // Если пользователь ещё не зарегистриован , то регистрируем
            await registerUser(data.userName, data.userLogin, data.userPassword);
        } else { // А если уже есть такой логин , то не дублируем
            console.log('Пользователь уже зарегистрирвоан')
        }
    });

    // Обработка запроса на вход в аккаунт
    socket.on('login_vertification', async (data) => {
        // Ищем пользователя в бд
        const searchResult = await userSearchDatabaseLogin(data.userLogin);
        if (!searchResult) { // Проверяем ответ
            console.log('Пользователь не найден, проверьте логин'); // Если нет такого логина
        } else {
            // Получаем ответ правильный ли ввёл пользователь пароль
            const passwordCorrectness = await verifyinUserPassword(searchResult, data.userPassword);
            if (!passwordCorrectness) {
                console.log('Проверьте пароль'); // Если пароль не верный
            } else {
                console.log('Всё верно!')
                socket.emit('open_connectify', searchResult);
            }
        }
    });

    // Обработка события создания комнаты
    socket.on('creating_room', async (data) => {
        // Проверяем нет ли уже такой комнаты
        console.log('Отправляем запрос на существование комнаты')
        const searchResult = await roomSearchDatabase(data.roomLogin);
        console.log('Получили результаты поиска комнаты')
        if (!searchResult) { // Если комнаты нет ,то создаём её и добавляем на сервер
            const roomID = await registerRoom(data);
            console.log('Передаём ID пользователя:' + data.userID + ' И логин комнаты ' + data.roomLogin)
            // Добавляем комнату в объект пользователя
            await addingRoomUser(data.userID, roomID);
            // Затем добавлем пользователя в объект комнаты
            await addingUserRoom(data.userID, roomID)
            // Отправляем событие обновления клиенту
            io.emit('rooms_updated', {  });
        } else {
            console.log('Комната уже создана')
        }
    })

    // Обработка события добавления комнаты пользователю
    socket.on('add_room', async (data) => {
        // Проверяем существует ли комната
        const searchResult = await roomSearchDatabase(data.roomLogin);
        if (!searchResult) {
            console.log('Комнаты не существует')
        } else {
            // Добавляем эту комнату в объект пользователя
            console.log('Передаём ID пользователя: ' + data.userID + ' И логин комнаты ' + data.roomLogin)
            await addingRoomUser(data.userID, searchResult.roomID);
            // Затем добавлем пользователя в объект комнаты
            await addingUserRoom(data.userID, searchResult.roomID)
            // Отправляем событие обновления клиенту
            io.emit('rooms_updated', {  });
        }
    })

    // Обработка события выхода из комнаты
    socket.on('leave_chat', async (data) => {
       await removingRoomUser(data.userID, data.roomID);
       await removingUserRoom(data.userID, data.roomID);
        io.emit('rooms_updated', {  });
    })
    

    //Обработка поиска сообщения по ключевому запросу пользователя
    socket.on('chat_search', (data) => {
        const searchResult = searchMessages(data.searchQuery , data.messagesReceived);
        socket.emit('chat_message_search_results', searchResult)
    })

    // Обработка изминения параметров групповог чата
    socket.on('change_room', async (data) => {
        const {roomID ,newAvatar, newName, newLogin, newAbout} = data;
        
        if (newAvatar) await changingRoomAvatar(roomID, newAvatar);
        if (newName) await changingRoomName(roomID, newName);
        if (newLogin) await changingRoomLogin(roomID, newLogin);
        if (newAbout) await changingRoomAbout(roomID, newAbout);
    })

    // Обработка запроса на получение информации о пользователе
    socket.on('get_user_data', async (data) => {
        const userDoc = await userSearchDatabaseID(data.IDSelectedUser)
        socket.emit('result_user_data', (userDoc))
    })

    // Обработка подключения к личному чату с пользователем
    socket.on('join_private_chat', async (data) => {
       const {targetUser, currentUser} = data;
        // Проверяем есть ли уже между пользователями чат
        if (searchPrivateChat(targetUser, currentUser)) {
            const privateChatID = targetUser + currentUser;
            socket.emit('open_private_chat', (privateChatID));
        }
    })
});

app.get('/', (req, res) => { // Определение маршрута для корневого адреса
    res.send('Hello world');
});

const PORT = process.env.PORT || 4000; // Задайте порт, если PORT не установлен
   server.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });