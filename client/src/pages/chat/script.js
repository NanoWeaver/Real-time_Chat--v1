import { db } from '../../firebase.js';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, orderBy } from "firebase/firestore";
import {userSearchDatabaseLogin, userSearchDatabaseID} from '../registration/script.js'

// Функция поиска комнаты в базе данных
export async function roomSearchDatabase(roomLogin) {
    // Получаем нашу колекцию комнат
    const roomsCollection = collection(db, "rooms");
    // Формируем запрос к бд , где будет искать соответствия roomLogin
    const request = query(roomsCollection, where("roomLogin", "==", roomLogin));
    // Получаем объект с результатами запроса
    const roomSnapshot = await getDocs(request);
    // Получаем массив с объектом комнаты
    const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Проверяем есть ли такая комната
    if(roomList.length >= 1) {
        console.log('Комната с таким логином найдена')
        return roomList[0]
    } {
        console.log('Комната не найден')
        return false
    }
}

// Функция регеистрации комнаты и добавления её в базу данных
export async function registerRoom(room) {
    try {
        console.log(room)
        const roomDoc = await addDoc(collection(db, "rooms"), {
            roomName: room.roomName,
            roomLogin: room.roomLogin,
            roomAbout: room.roomAbout,
            roomAdmin: [room.userID,],
            roomAvatar: room.roomAvatar,
            roomUsers: [],
            lastMessage: {
                userSenderName: '',
                createdtime: '',
                message: ''
            }
        });
        console.log("Комната создана с ID:",  roomDoc.id);
    } catch (e) {
        console.error("Ошибка создания комнаты:", e);
    }
}

// Фунция добавления новой комнаты в объект пользователя
export async function addingRoomUser(userID, roomLogin) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    console.log(userDoc)
    // Добавляем комнату в общий массив
    const userRoomsNew = userDoc.userRooms;
    userRoomsNew.push(roomLogin)
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userID);
    await updateDoc(userRef, {
        userRooms : userRoomsNew
    })
}

// Фунция добавления нового пользователя в объект комнаты
export async function addingUserRoom(userID, roomLogin) {
    // Получаем комнату
    const roomDoc = await roomSearchDatabase(roomLogin);
    console.log(roomDoc)
    // Добавляем пользователя в общий массив
    const roomUsersNew = roomDoc.roomUsers;
    roomUsersNew.push(userID)
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomDoc.id);
    await updateDoc(roomRef, {
        roomUsers : roomUsersNew
    })
}

// Фунция удаления комнаты из объекта пользователя
export async function removingRoomUser(userID, roomLogin) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    console.log(userDoc)
    // Создаём новый массив без удалённой комнаты
    const userRoomsNew = userDoc.userRooms.filter(room => room !== roomLogin);
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userID);
    await updateDoc(userRef, {
        userRooms : userRoomsNew
    })
}

// Фунция удаления пользователя из объекта комнаты
export async function removingUserRoom(userID, roomLogin) {
    // Получаем комнату
    const roomDoc = await roomSearchDatabase(roomLogin);
    console.log(roomDoc)
    // Создаём новый массив без пользователя
    const roomUsersNew = roomDoc.roomUsers.filter(user => user !== userID);
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomDoc.id);
    await updateDoc(roomRef, {
        roomUsers : roomUsersNew
    })
}

// Функция получения списка комнат пользователя
export async function getUserRooms(userID) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    // Получаем его список чатов
    const userRooms = userDoc.userRooms || [];
    return userRooms
}

// Функция добавления сообщения в базу данных
export async function addMessage(roomLogin, message, userID, createdtime, userAvatar) {
    try {
        const messageDoc = await addDoc(collection(db, "messages"), {
            userID,
            userName: '',
            userLogin: '',
            roomLogin, 
            message, 
            createdtime,
            userAvatar, 
        });
        console.log("Сообщение сохранено с ID:",  messageDoc.id);
    } catch (e) {
        console.error("Ошибка сохранения сообщения:", e);
    }
}

// Функция загрузики истории собщений для определённой комнаты
export async function getMessagesRoom(roomLogin, limit = 20) {
    // Получили колекцию сообщений
    const collectionMessages = collection(db, 'messages');
    // Формируем запрос к бд
    const request = query(collectionMessages, where('roomLogin', '==', roomLogin),orderBy('createdtime', 'desc'));
    // Получаем результаты поиска
    const messageSnapshot = await getDocs(request)

  return messageSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Функция изминения данных последнего сообщения в комнате
export async function changingLastMessage(userID, roomLogin, message, createdtime) {
    // Получаем комнату
    console.log('Получаем комнату для обновления полседнего сообщения с именем ' + roomLogin + 'с текстом ' + message)
    const roomDoc = await roomSearchDatabase(roomLogin);
    // Создаём новый объект последнего сообщения
    const roomLastMessageNew = {
        userSenderID: userID,
        userSenderName: '',
        createdtime,
        message,
    };
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomDoc.id);
    // Перезаписываем данные
    await updateDoc(roomRef, {
        lastMessage : roomLastMessageNew
    })

    return roomLastMessageNew;
}

// Функция поиска сообщений
export function searchMessages(searchQuery, messagesReceived) {
    const filtered = messagesReceived
        .filter((msg) =>
            msg.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.createdTime - a.createdTime);
    return filtered;
}