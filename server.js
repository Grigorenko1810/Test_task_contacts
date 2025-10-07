const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATABASE_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors()); // Разрешаем CORS для всех источников
app.use(express.json()); // Парсинг JSON в теле запроса
app.use(express.static('.')); // Раздача статических файлов из текущей директории

// Вспомогательные функции для работы с базой данных
async function readDatabase() {
    try {
        const data = await fs.readFile(DATABASE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения базы данных:', error);
        return { contacts: [] };
    }
}

async function writeDatabase(data) {
    try {
        await fs.writeFile(DATABASE_FILE, JSON.stringify(data, null, 4), 'utf8');
    } catch (error) {
        console.error('Ошибка записи в базу данных:', error);
        throw new Error('Ошибка сохранения данных');
    }
}

// Маршруты API

// Получить все контакты
app.get('/api/contacts', async (req, res) => {
    try {
        const database = await readDatabase();
        res.json(database.contacts);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения контактов' });
    }
});

// Получить активные контакты
app.get('/api/contacts/active', async (req, res) => {
    try {
        const database = await readDatabase();
        const activeContacts = database.contacts.filter(contact => contact.status === 'активный');
        res.json(activeContacts);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения активных контактов' });
    }
});

// Получить контакт по ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const database = await readDatabase();
        const contactId = parseInt(req.params.id);
        const contact = database.contacts.find(c => c.id === contactId);

        if (!contact) {
            return res.status(404).json({ error: 'Контакт не найден' });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных контакта' });
    }
});

// Добавить новый контакт
app.post('/api/contacts', async (req, res) => {
    try {
        const database = await readDatabase();
        const newContact = req.body;

        // Валидация данных
        if (!newContact.name || !newContact.email || !newContact.phone || !newContact.status) {
            return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
        }

        // Генерация нового ID
        const maxId = database.contacts.reduce((max, contact) => 
            Math.max(max, contact.id || 0), 0);
        newContact.id = maxId + 1;

        database.contacts.push(newContact);
        await writeDatabase(database);

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления контакта' });
    }
});

// Обновить существующий контакт
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const database = await readDatabase();
        const contactId = parseInt(req.params.id);
        const updateData = req.body;

        const contactIndex = database.contacts.findIndex(c => c.id === contactId);
        if (contactIndex === -1) {
            return res.status(404).json({ error: 'Контакт не найден' });
        }

        // Обновляем данные контакта
        database.contacts[contactIndex] = {
            ...database.contacts[contactIndex],
            ...updateData,
            id: contactId // Сохраняем исходный ID
        };

        await writeDatabase(database);
        res.json(database.contacts[contactIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления контакта' });
    }
});

// Удалить контакт
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const database = await readDatabase();
        const contactId = parseInt(req.params.id);

        const contactIndex = database.contacts.findIndex(c => c.id === contactId);
        if (contactIndex === -1) {
            return res.status(404).json({ error: 'Контакт не найден' });
        }

        database.contacts.splice(contactIndex, 1);
        await writeDatabase(database);

        res.json({ message: 'Контакт успешно удален' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления контакта' });
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Запуск сервера
app.listen(PORT, () => {
    const appUrl = `http://localhost:${PORT}/contacts.html`;
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте приложение: ${appUrl}`);
});