document.addEventListener('DOMContentLoaded', () => {
    const addTodoForm = document.getElementById('add-todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const fetchRequest = async (url, options) => {
        try {
            await fetch(url, options);
            updateTodoList();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    addTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (todoInput.value) {
            fetchRequest('/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ todo: todoInput.value })
            });
            todoInput.value = '';
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            fetchRequest(`/delete/${e.target.getAttribute('data-id')}`, { method: 'POST' });
        }
    });

    const updateTodoList = async () => {
        try {
            const response = await fetch('/');
            const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
            todoList.innerHTML = doc.getElementById('todo-list').innerHTML;
        } catch (error) {
            console.error('Error:', error);
        }
    };
});
