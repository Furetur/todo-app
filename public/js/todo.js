function addTodo(action, additionalProperties){
    const todo = {
        action: action,
        status: 'undone'
    };

    for(const propertyName of Object.keys(additionalProperties)){
        todo[propertyName] = additionalProperties[propertyName]
    }

    memory.add(todo);

    return db.add(todo);
}

function removeTodo(todo){
    memory.remove(todo._id);
    return db.remove(todo._id)
}

function markAsDone(todo){
    memory.changeStatus(todo._id, 'done');
    return db.changeStatus(todo._id, 'done')
}

function markAsUndone(todo){
    memory.changeStatus(todo._id, 'undone');
    return db.changeStatus(todo._id, 'undone')
}

function doToday(todo){
    memory.toToday(todo._id);
    return db.toToday(todo._id);
}



