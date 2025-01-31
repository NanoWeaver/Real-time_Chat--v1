export function validationUserName(input) {
    if (input.current.value !== '' && input.current.value.length >= 3 && input.current.value.length <= 50) {
        let valid = true;
        for (let i = 0; i < input.current.value.length; i++) { 
            if (!(/\p{L}/u.test(input.current.value[i]))) { // Используем регулярное выражение для проверки символа
                valid = false;
            };
        };
        if (valid) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export function validationUserLogin(input) {
    if (input.current.value !== '' && input.current.value.length >= 5 && input.current.value.length <= 50) {
        return true
    } else {
        return false
    }
}

export function validationUserPassword(input) {
    if (input.current.value !== '' && input.current.value.length >= 6 && input.current.value.length <= 50) {
        return true
    } else {
        return false
    }
}