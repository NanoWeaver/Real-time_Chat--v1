// Функция валидации имени пользователя
export function validationUserName(input) {
    console.log('Значение инпута ', input)
    const value = input.current?.value ? input.current.value : input;
    console.log('Имя пользователя ' + value)
    const valueWithoutSpaces = value.trim();
    if (valueWithoutSpaces !== '' && valueWithoutSpaces.length >= 3 && valueWithoutSpaces.length <= 50) {
        let valid = true;
        for (let i = 0; i < valueWithoutSpaces.length; i++) { 
            // Используем регулярное выражение для проверки символа, разрешены только буквы и пробелы
            if (!(/[\p{L}\s]/u.test(valueWithoutSpaces[i]))) { 
                valid = false;
            };
        };
        if (valid) {
            return true
        } else {
            return false
        }
    } else {
        console.log('Поле пустое  или имя короче 3 или длиннее 50')
        return false
    }
}

// Функция валидации логина пользователя
export function validationUserLogin(input) {
    const value = input.current?.value ? input.current.value : input;
    const valueWithoutSpaces = value.trim();
    if (valueWithoutSpaces !== '' && valueWithoutSpaces.length >= 5 && valueWithoutSpaces.length <= 50 && !/\s/.test(valueWithoutSpaces)) {
        return true
    } else {
        console.log('Данные некоректны')
        return false
    }
}

// Функция валидации пароля пользователя
export function validationUserPassword(input) {
    const value = input.current?.value ? input.current.value : input;
    if (value !== '' && value.length >= 6 && value.length <= 50) {
        return true
    } else {
        return false
    }
}