import express from 'express'; // Импортируем Express
const app = express(); // Создаём экземпляр приложения Express 
import http from 'http'; // Импортируем встроенный модуль Node для создания сервера
import cors from 'cors'; // Импортируем библиотека для принятия запросов из других доменов
import { Server } from 'socket.io'; // Импортируем класс с помощью деструктуризации объекта  
import { userSearchDatabase, verifyinUserPassword, registerUser } from '../client/src/pages/registration/script.js'; // Импортируем наши функции работы с бд 
import { roomSearchDatabase, registerRoom, addingRoomUser, addingUserRoom } from '../client/src/pages/chat/script.js'; // Импортируем наши функции работы с бд 
app.use(cors()); // Добавляем промежуточное CORS ПО , для обработки запросов с других доменов

const server = http.createServer(app); // Создаём HTTP сервер с помощью экземпляра Express

 // Создаем сервер Socet.io , передовая ему созданный HTTP сервер и настройку CORS 
 // (подключения только с домена http://localhost:3000 и разрешаем методы GET POST)
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot'; // Имя чат бота
let chatRoom = ''; // Переменная для хранения названия комнаты , к которой подключился пользователь
let allUsers = []; // Массив для хранения всех пользователей в комнате 

io.on('connection', (socket) => { // Обработка подключения пользователей , слушаем событие connection
    console.log(`User connected ${socket.id}`); // Выводим id пользователя в консоль
  
    // // Обработка события присоединения к комнате, слушаем событие join_room
    // socket.on('join_room', (data) => {
    //     const { username, room } = data; // Извлекаем имя пользователя и название комнаты
    //     socket.join(room); // Подключаем пользователя к комнате

    //     let createdtime = Date.now(); // Запоминаем время подключения 

    //     // Отправляем всем в комнает уведомление о подключении нового пльзователя (кроме пользователя)
    //     socket.to(room).emit('receive_message', {
    //         message: `${username} Присоединился к чату`, // Само сообщение
    //         username: CHAT_BOT, // Имя отправителя
    //         createdtime, // Время отправления 
    //     });

    //     // Отправляем сообщение новому пользователю
    //     socket.emit('receive_message', {
    //         message: `Добро пожаловать ${username}`, // Само сообщение
    //         username: CHAT_BOT, // Имя отправителя
    //         createdtime, // Время отправления 
    //       });

    //     // Обновление списка пользователей
    //     chatRoom = room; // Сохраняем название комнаты
    //     allUsers.push({ id: socket.id, username, room }); // Добавляем в массив объект нового пользователя
    //     // Создаем массив только с теми пользователями ,Что находятся в этой же комнате
    //     let chatRoomUsers = allUsers.filter((user) => user.room === room); 
    //     // Сервер отправляет список пользователей всем подключенным клиентам в комнате, за исключением отправителя.
    //     socket.to(room).emit('chatroom_users', chatRoomUsers);
    //     // Здесь сервер отправляет то же самое событие только что подключившемуся пользователю
    //     socket.emit('chatroom_users', chatRoomUsers);
    // });

    // // Обработка отрправки сообщения пользователем
    // socket.on('send_message', (data) => {
    //     io.to(data.room).emit('receive_message', data); // Отправляем всем пользователям в комнате
    // })

    // Обработка запроса на регистрацию
    socket.on('send_registr', async (data) => {
        // Ищем пользователя в бд
        const searchResult = await userSearchDatabase(data.userLogin)
        if (!searchResult) { // Если пользователь ещё не зарегистриован , то регистрируем
            await registerUser(data.userName, data.userLogin, data.userPassword);
        } else { // А если уже есть такой логин , то не дублируем
            console.log('Пользователь уже зарегистрирвоан')
        }
    });

    // Обработка запроса на вход в аккаунт
    socket.on('login_vertification', async (data) => {
        // Ищем пользователя в бд
        const searchResult = await userSearchDatabase(data.userLogin);
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
            await registerRoom(data.roomName, data.roomLogin);
            // Затем добавляем эту комнату в объект пользователя
            console.log('Передаём логин пользователя:' + data.userLogin + 'И логин комнаты' + data.roomLogin)
            await addingRoomUser(data.userLogin, data.roomLogin);
            // Затем добавлем пользователя в объект комнаты
            await addingUserRoom(data.userLogin, data.roomLogin)
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
            console.log('Передаём логин пользователя:' + data.userLogin + 'И логин комнаты' + data.roomLogin)
            await addingRoomUser(data.userLogin, data.roomLogin);
            // Затем добавлем пользователя в объект комнаты
            await addingUserRoom(data.userLogin, data.roomLogin)
        }
    })
});

app.get('/', (req, res) => { // Определение маршрута для корневого адреса
    res.send('Hello world');
});

server.listen(4000, () => 'Server is running on port 4000'); // Запускаем сервер