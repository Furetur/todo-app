const mainContent = {

    clear(container){
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    populateWithTodos(container, template, todos, onchange){
        todos.forEach(todo => {
            const clonedTemplateContent = template.content.cloneNode(true);
            const todoTextElement = clonedTemplateContent.querySelector('.todo-text');
            const todoCheckbox = clonedTemplateContent.querySelector('.todo-checkbox');
            const todoDeleteButton = clonedTemplateContent.querySelector('.delete-todo');

            todoTextElement.textContent = todo.action; //set the to-do ('cook spaghetti' text)
            todoCheckbox.addEventListener('change', () => {
                onchange(todo);
                tabs.update();
                this.updateTodoList();
            });

            todoDeleteButton.addEventListener('click', () => {
                removeTodo(todo)
                    .catch(e => {
                        console.log('error while deleting a todo:', e);
                    });
                tabs.update();
                this.updateTodoList();
            });

            if(this.otherDay && todo.status === 'undone'){
                const doItTodayButton = clonedTemplateContent.querySelector('.do-today-todo');
                doItTodayButton.addEventListener('click', () => {
                    doToday(todo)
                        .catch(e => {
                            console.log('error while moving to today:', e);
                        });
                    tabs.update();
                    this.updateTodoList();
                })
            }

            container.appendChild(clonedTemplateContent);
        })
    },


    undoneTodosContainer: document.getElementById('undone-todos'),
    templateUndoneTodo: document.getElementById('template-undone-todo'),
    doneTodosContainer: document.getElementById('done-todos'),
    templateDoneTodo: document.getElementById('template-done-todo'),

    templateUndoneTodoOtherDay: document.getElementById('template-other-day-undone-todo'),


    async updateTodoList(todos, otherDay = this.otherDay){
        await memory.organiseTodos();
        todos = tabs.getTodosForTab();
        this.otherDay = otherDay === true;

        this.clear(this.undoneTodosContainer);
        this.clear(this.doneTodosContainer);

        let undoneTodoTemplate = this.otherDay? this.templateUndoneTodoOtherDay:this.templateUndoneTodo;

        this.populateWithTodos(this.undoneTodosContainer, undoneTodoTemplate, todos.filter(todo => todo.status === 'undone'), (todo) => {
            markAsDone(todo)
                .catch(e => {
                    console.log('error while marking as done:', e);
                }) ;
        });

        this.populateWithTodos(this.doneTodosContainer, this.templateDoneTodo, todos.filter(todo => todo.status === 'done'), (todo) => {
            markAsUndone(todo)
                .then(result => {
                    console.log('marked')
                })
                .catch(e => {
                    console.log('error while marking as undone:', e);
                });
        });
    }

};

