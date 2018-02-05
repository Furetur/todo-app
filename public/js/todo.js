async function checkIfOnline(){
    if(!navigator.onLine) return false;
    try{
        await fetch('http://localhost:6969/ping');
        // we are online
        return true;
    }catch(e){
        // we are offline
        return false;
    }
}


async function waitForConnection(){
    if(await checkIfOnline()){
        // we are actually online
        memory.uploadToDatabase();
    }
    // we are offline ;C
    const msg = alertify.message('Whoops. We are offline.', 0);

    const intervalId = setInterval(async () => {
        if(await checkIfOnline()){
            // we are online now
            msg.dismiss(); // remove the 'We are offline' notification
            alertify.message('We are back online', 2);
            clearInterval(intervalId);
            await memory.uploadToDatabase();
            mainContent.updateTodoList();
        }
        // we are still offline
    }, 5000);
}


async function updateDatabase(){
    try{
        await memory.uploadToDatabase();
     }catch(e){
         if(e === 'offline'){
             // eh we are offline
             waitForConnection();
         }
         console.log('Failed to add to db:', e);
     }
}


async function addTodo(action, additionalProperties){
    const todo = {
        action: action,
        status: 'undone',
    };

    for(const propertyName of Object.keys(additionalProperties)){
        todo[propertyName] = additionalProperties[propertyName];
    }

    await memory.put(todo);
    await updateDatabase();
    mainContent.updateTodoList();
}


async function removeTodo(todo){
    await memory.remove(todo._id);
    await updateDatabase();
    mainContent.updateTodoList();
}


async function markAsDone(todo){
    await memory.changeStatus(todo._id, 'done');
    await updateDatabase();
    mainContent.updateTodoList();
}


async function markAsUndone(todo){
    await memory.changeStatus(todo._id, 'undone');
    await updateDatabase();
    mainContent.updateTodoList();
}


async function doToday(todo){
    await memory.toToday(todo._id);
    await updateDatabase();
    mainContent.updateTodoList();
}
