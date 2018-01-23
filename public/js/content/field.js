function updateTodoField(placeholder, additionalTodoDataOrFn){
    const addTodoField = document.getElementById('add-todo-field');

    if(placeholder === false){
        //disable the to-do field
        addTodoField.disabled = true;
        addTodoField.placeholder = 'you cant add todos here';
        addTodoField.onkeyup = () => {};
        return;
    }

    addTodoField.disabled = false;
    addTodoField.placeholder = placeholder;

    addTodoField.onkeyup = function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            if(typeof additionalTodoDataOrFn === 'object'){
                addTodo(addTodoField.value, additionalTodoDataOrFn)
                    .catch(e => {
                        console.warn('error while adding a todo:', e);
                    })
            }else if(typeof  additionalTodoDataOrFn === 'function'){
                additionalTodoDataOrFn(addTodoField.value);
            }

            addTodoField.value = '';
            tabs.update();
            mainContent.updateTodoList();
        }
    }
}

const field = {};

field._inputField = document.getElementById('add-todo-field');

field.tab = 7 - memory.now().getDay();
field._dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

field._onEnterKey = function(todoProperties){

    return function onKeyUp(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            addTodo(field._inputField.value, todoProperties)
                .catch(e => {
                    console.log('error while adding a todo:', e);
                });

            field._inputField.value = '';
            tabs.update();
            mainContent.updateTodoList();
        }
    }

};

field._getSundayFor = function(date){
    const beginning = new Date(date);
    beginning.setDate(beginning.getDate() - beginning.getDay());
    return beginning;
};

field._getDateForDay = function (numberOfDay){
    const date = this._getSundayFor(memory.now());
    date.setDate(date.getDate() + numberOfDay);
    return date
};

field.update = function(tab = this.tab){
    this.tab = tab;


    this._inputField.disabled = false;

    this._inputField.placeholder = `Add a to-do for ${tabs._tabNames[tab].toLowerCase()}`;
    if(tab === 0){
        this._inputField.onkeyup = this._onEnterKey({
            date: this._getSundayFor(memory.now()),
            organised: false
        })
    }else if(1 <= tab && tab <= 7 - memory.now().getDay()){
        this._inputField.onkeyup = this._onEnterKey({
            date: this._getDateForDay(7 - tab),
            organised: true
        })
    }else{
        this._inputField.disabled = true;
        this._inputField.placeholder = `How can you do stuff in the past?!`;
    }

}