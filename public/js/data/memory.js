const memory = {};


memory.now = function() {
    return new Date();
};


memory._changesStore = localforage.createInstance({
    name: 'changesStore',
});


memory._offlineStore = localforage.createInstance({
    name: 'offlineStore',
});


memory._offlineKeyPrefix = 'offline-';


memory._getNextIndex = function(store){
    return store.length();
};


memory.thisSunday = function() {
    return this._getBeginningOfWeek(this.now());
};


memory._isSameDay = function(date1, date2){
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};


memory._getBeginningOfWeek = function(date) {
    const beginning = new Date(date);
    beginning.setDate(beginning.getDate() - beginning.getDay());
    return beginning;
};


memory.thisWeekUnorganised = [];
memory.thisWeekByDays= [[], [], [], [], [], [], []];
memory.overdue= [];


memory.organiseTodos = async function(){
    const allTodos = await this.getAll();
    const thisWeek = allTodos.filter(todo => {
        return this._isSameDay(this._getBeginningOfWeek(this.now()), this._getBeginningOfWeek(todo.date));
    }); // all week

    this.thisWeekUnorganised.length = 0; // clear
    thisWeek.filter(todo => todo.organised === false).forEach(todo => this.thisWeekUnorganised.push(todo)); // populate thisWeekUnorganised


    //clear all the days
    this.thisWeekByDays.forEach(dayTodos => dayTodos.length = 0);

    //organise everything
    thisWeek.filter(todo => todo.organised === true)
        .forEach(todo => {
            const dayOfWeek = todo.date.getDay();
            this.thisWeekByDays[dayOfWeek].push(todo);
        });

    this.overdue.length = 0; // clear
    allTodos.filter(todo => !thisWeek.includes(todo)).forEach(todo => this.overdue.push(todo)); //populate overdue

};


memory.get = function(id){
    return this._offlineStore.getItem(id);
};


memory._makeLocalId = function(){
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++){
       text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    }
    return text;
};


memory.put = async function(todo){
    // save in offline store
    if(!todo._id){
        todo._id = this._offlineKeyPrefix + this._makeLocalId(); // if added offline then assign an offline id
    }

    await this._offlineStore.setItem(todo._id, todo); // save in offline store
    await this._changesStore.setItem(todo._id, todo); // remember that the todo has been changed


    await this.organiseTodos();
};


memory.remove = async function(id){
    await this._offlineStore.removeItem(id);
    await this._changesStore.setItem(id, 'deleted');
};


memory.changeProperty = function(id, propertyName, propertyValue){
    return this.get(id).then(todo => {
        todo[propertyName] = propertyValue;
        return this.put(todo);
    });
};


memory.changeStatus = function(id, newStatus){
    return this.changeProperty(id, 'status', newStatus);
};


memory.getAll = async function(){
    const data = [];
    await this._offlineStore.iterate(value => {
        data.push(value);
    });
    return data;
};


memory.toToday = function toToday(id) {
    return this.changeProperty(id, 'date', this.now());
};


memory.update = async function(){
    await this._offlineStore.clear();
    (await db.getAll()).map(todo => {
        todo.date = new Date(todo.date);
        return todo;
    }).forEach(async todo => {
        try{
            await this._offlineStore.setItem(todo._id, todo);
        }catch(e){
            console.log('error while saving todos:', e);
        }
    });
    await this.organiseTodos();
};


memory.uploadToDatabase = async function(){
    // get all updated todos
    const keys = await this._changesStore.keys();
    for(const key of keys){
        const changedTodo = await this._changesStore.getItem(key);
        if(changedTodo === 'deleted'){ // if a todo has been deleted
            if(key.startsWith(this._offlineKeyPrefix)){
                await this._changesStore.removeItem(key);
                continue; // offline added todo has been deleted
            }
            try{
                await db.remove(key);
            }catch(e){
                console.log('We are offline');
                throw 'offline';
            }
            await this._changesStore.removeItem(key);
            continue;
        }
        if(key.startsWith(this._offlineKeyPrefix)){ // if a todo was added offline
            changedTodo._id = undefined; // let the db choose the id
            let data;
            try{
                const response = await db.add(changedTodo);
                data = response.data;
            }catch(e){
                console.log('We are offline ;C');
                throw 'offline';
            };
            // everything went fine
            data.date = new Date(data.date);
            await this._changesStore.removeItem(key);
            await this._offlineStore.removeItem(key);
            await this._offlineStore.setItem(data._id, data);
            continue;
        }
        // if a todo is changed
        try{
            await db.update(changedTodo);
            const newTodo = await db.get(changedTodo._id);
            newTodo.date = new Date(newTodo.date);
            await this._changesStore.removeItem(key);
            await this._offlineStore.setItem(newTodo._id, newTodo);
        }catch(e){
            console.log('We are offline ;C');
            throw 'offline';
        };     
    }
};
