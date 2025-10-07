// Create an array of contacts as our simple JSON database
const contacts = [
    {
        id: 1,
        name: "Иван Петров",
        email: "ivan.petrov@example.com",
        phone: "+7 (999) 123-45-67",
        status: "активный"
    },
    {
        id: 2,
        name: "Анна Сидорова",
        email: "anna.s@example.com",
        phone: "+7 (999) 234-56-78",
        status: "активный"
    },
    {
        id: 3,
        name: "Михаил Иванов",
        email: "m.ivanov@example.com",
        phone: "+7 (999) 345-67-89",
        status: "неактивный"
    },
    {
        id: 4,
        name: "Елена Смирнова",
        email: "elena.s@example.com",
        phone: "+7 (999) 456-78-90",
        status: "активный"
    },
    {
        id: 5,
        name: "Дмитрий Козлов",
        email: "d.kozlov@example.com",
        phone: "+7 (999) 567-89-01",
        status: "неактивный"
    }
];

// Convert the array to JSON string (if you need to save it or transmit it)
const jsonDatabase = JSON.stringify(contacts, null, 2);

// Example of how to use the data
console.log('Все контакты:', contacts);
console.log('JSON формат:', jsonDatabase);

// Example of filtering active contacts
const activeContacts = contacts.filter(contact => contact.status === "активный");
console.log('Активные контакты:', activeContacts);

// Пример функций для работы с базой данных

// Получить все контакты
function getAllContacts() {
    return JSON.parse(JSON.stringify(contacts)); // Возвращаем копию массива
}

// Поиск контакта по ID
function findContactById(id) {
    return contacts.find(contact => contact.id === id);
}

// Получить активные контакты
function findActiveContacts() {
    return contacts.filter(contact => contact.status === "активный");
}

// Добавление нового контакта
function addContact(contactData) {
    // Проверяем наличие всех необходимых полей
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.status) {
        throw new Error('Не все обязательные поля заполнены');
    }

    // Проверяем корректность статуса
    if (!['активный', 'неактивный'].includes(contactData.status)) {
        throw new Error('Некорректный статус. Допустимые значения: "активный" или "неактивный"');
    }

    // Если ID не предоставлен, генерируем новый
    if (!contactData.id) {
        contactData.id = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    }

    // Проверяем уникальность ID
    if (contacts.some(contact => contact.id === contactData.id)) {
        throw new Error('Контакт с таким ID уже существует');
    }

    contacts.push(contactData);
    return contactData;
}

// Обновление контакта
function updateContact(id, updateData) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts[index] = { ...contacts[index], ...updateData };
        return contacts[index];
    }
    return null;
}

// Удаление контакта
function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        return contacts.splice(index, 1)[0];
    }
    return null;
}

// Примеры использования функций:

// Получить все контакты
console.log('Все контакты:', getAllContacts());

// Получить активные контакты
console.log('Активные контакты:', findActiveContacts());

// Добавить новый контакт
const newContact = addContact({
    name: "Ольга Новикова",
    email: "olga.n@example.com",
    phone: "+7 (999) 678-90-12",
    status: "активный"
});
console.log('Добавлен новый контакт:', newContact);

// Обновить контакт
const updatedContact = updateContact(1, { status: "неактивный" });
console.log('Обновлен контакт:', updatedContact);

// Удалить контакт
const deletedContact = deleteContact(2);
console.log('Удален контакт:', deletedContact);

// Вывести обновленную базу данных
console.log('Обновленная база данных:', contacts);