from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

todos = []


@app.route('/')
def index():
    if not todos:
        flash("No tasks yet! Add some tasks to get started.")
    enumerated_todos = list(enumerate(todos))
    return render_template('index.html', todos=enumerated_todos)


@app.route('/add', methods=['POST'])
def add_todo():
    todo = request.form.get('todo')
    if todo:
        todos.append(todo)
        flash(f'Task "{todo}" added successfully!', 'success')
    else:
        flash("Task cannot be empty!", 'error')
    return redirect(url_for('index'))


@app.route('/delete/<int:todo_id>', methods=['POST'])
def delete_todo(todo_id):
    try:
        if 0 <= todo_id < len(todos):
            removed_task = todos.pop(todo_id)
            flash(f'Task "{removed_task}" deleted successfully!', 'success')
        else:
            flash("Invalid task ID!", 'error')
    except IndexError:
        flash("Task not found!", 'error')
    return redirect(url_for('index'))


@app.route('/edit/<int:todo_id>', methods=['GET', 'POST'])
def edit_todo(todo_id):
    if request.method == 'POST':
        new_task = request.form.get('todo')
        if new_task:
            todos[todo_id] = new_task
            flash(f'Task "{new_task}" updated successfully!', 'success')
        else:
            flash("Task cannot be empty!", 'error')
        return redirect(url_for('index'))

    if 0 <= todo_id < len(todos):
        task_to_edit = todos[todo_id]
        return render_template('edit.html', todo=task_to_edit, todo_id=todo_id)
    else:
        flash("Task not found!", 'error')
        return redirect(url_for('index'))


@app.route('/clear', methods=['POST'])
def clear_todos():
    todos.clear()
    flash("All tasks cleared!", 'success')
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
