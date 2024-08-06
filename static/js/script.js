document.addEventListener('DOMContentLoaded', () => {
    const addTodoForm = document.getElementById('add-todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const todo = todoInput.value;
        if (!todo) return;

        try {
            await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ todo })
            });

            todoInput.value = '';
            updateTodoList();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    todoList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const todoId = e.target.getAttribute('data-id');

            try {
                await fetch(`/delete/${todoId}`, {
                    method: 'POST',
                });

                updateTodoList();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    
    async function updateTodoList() {
        try {
            const response = await fetch('/');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newTodoList = doc.getElementById('todo-list').innerHTML;
            todoList.innerHTML = newTodoList;
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
