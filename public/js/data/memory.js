const memory = {};


memory.now = function() {
    return new Date();
};


memory.thisSunday = function() {
    return this._getBeginningOfWeek(this.now());
};


memory._isSameDay = function(date1, date2){
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};


memory._getBeginningOfWeek = function (date) {
    const beginning = new Date(date);
    beginning.setDate(beginning.getDate() - beginning.getDay());
    return beginning;
};


memory.thisWeekUnorganised = [];
memory.thisWeekByDays= [[], [], [], [], [], [], []];
memory.overdue= [];


memory.organiseTodos = async function (){
    const allTodos = await this.getAll();
    const thisWeek = allTodos.filter(todo => {
        return this._isSameDay(this._getBeginningOfWeek(this.now()), this._getBeginningOfWeek(todo.date));
    }); //all week

    this.thisWeekUnorganised.length = 0; //clear
    thisWeek.filter(todo => todo.organised === false).forEach(todo => this.thisWeekUnorganised.push(todo)); //populate thisWeekUnorganised


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


memory.get = function (id) {
    return localforage.getItem(id);
};


memory.put = async function(todo) {
    await localforage.setItem(todo._id, todo);
    await this.organiseTodos();
};


memory.remove = function (id){
    return localforage.removeItem(id);
};


memory.changeProperty = function(id, propertyName, propertyValue){
    return this.get(id).then(todo => {
        todo[propertyName] = propertyValue;
        return this.put(todo);
    })
};


memory.changeStatus = function(id, newStatus){
    return this.changeProperty(id, 'status', newStatus)
};


memory.getAll = async function(){
    const data = [];
    await localforage.iterate(value => {
        data.push(value);
    });
    return data;
};


memory.toToday = function toToday(id) {
    return this.changeProperty(id, 'date', this.now());
};


memory.update = async function(){
    (await db.getAll()).map(todo => {
        todo.date = new Date(todo.date);
        return todo
    }).forEach(async todo => {
        try{
            await localforage.setItem(todo._id, todo)
        }catch(e){
            console.log('error while saving todos:', e)
        }
    });
    await this.organiseTodos();
};


