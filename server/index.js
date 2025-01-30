const express = require('express'); // Импортируем Express 
const app = express(); // Создаём экземпляр приложения Express 
const http = require('http'); // Импортируем встроенный модуль Node для создания сервера
const cors = require('cors'); // Импортируем библиотека для принятия запросов из других доменов
const { Server } = require('socket.io'); // Импортируем класс с помощью деструктуризации объекта  

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
  
    // Обработка события присоединения к комнате, слушаем событие join_room
    socket.on('join_room', (data) => {
        const { username, room } = data; // Извлекаем имя пользователя и название комнаты
        socket.join(room); // Подключаем пользователя к комнате

        let createdtime = Date.now(); // Запоминаем время подключения 

        // Отправляем всем в комнает уведомление о подключении нового пльзователя (кроме пользователя)
        socket.to(room).emit('receive_message', {
            message: `${username} Присоединился к чату`, // Само сообщение
            username: CHAT_BOT, // Имя отправителя
            createdtime, // Время отправления 
        });

        // Отправляем сообщение новому пользователю
        socket.emit('receive_message', {
            message: `Добро пожаловать ${username}`, // Само сообщение
            username: CHAT_BOT, // Имя отправителя
            createdtime, // Время отправления 
          });

        // Обновление списка пользователей
        chatRoom = room; // Сохраняем название комнаты
        allUsers.push({ id: socket.id, username, room }); // Добавляем в массив объект нового пользователя
        // Создаем массив только с теми пользователями ,Что находятся в этой же комнате
        let chatRoomUsers = allUsers.filter((user) => user.room === room); 
        // Сервер отправляет список пользователей всем подключенным клиентам в комнате, за исключением отправителя.
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        // Здесь сервер отправляет то же самое событие только что подключившемуся пользователю
        socket.emit('chatroom_users', chatRoomUsers);
    });

    
});

app.get('/', (req, res) => { // Определение маршрута для корневого адреса
    res.send('Hello world');
});

server.listen(4000, () => 'Server is running on port 4000'); // Запускаем сервер