const memory = {}

memory.todos = [];
memory.now = function() {
    return new Date();
};
memory.thisSunday = function() {
    return this.getBeginningOfWeek(this.getNow);
}
memory.isSameDay = function(date1, date2){
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};
memory.getBeginningOfWeek = function (date) {
    const beginning = new Date(date);
    beginning.setDate(beginning.getDate() - beginning.getDay());
    return beginning;
}

memory.thisWeekUnorganised = [];
memory.thisWeekByDays= [[], [], [], [], [], [], []];
memory.overdue= [];

memory.organiseTodos = function (){
    const thisWeek = this.todos.filter(todo => {
        return this.isSameDay(this.getBeginningOfWeek(this.getNow), this.getBeginningOfWeek(todo.date));
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
    this.todos.filter(todo => !thisWeek.includes(todo)).forEach(todo => this.overdue.push(todo)); //populate overdue

}

memory.get = function (id) {
    return this.todos.find(todo => todo._id === id);
}

memory.add = function(todo) {
    this.todos.push(todo);
    this.organiseTodos();
};

memory.remove = function (id){
    let index = this.todos.findIndex(todo => todo._id === id);

    if(index >= 0){
        this.todos.splice(index, 1);
        this.organiseTodos();
    }
};

memory.changeStatus = function(id, newStatus){
    this.get(id).status = newStatus;
};




memory.toToday = function toToday(id) {
    let todo = this.get(id);
    todo.date = this.getNow;
    todo.organised = true;
    this.organiseTodos();
};

memory.update = async function(){
    this.todos = (await db.getAll()).map(todo => {
        todo.date = new Date(todo.date);
            return todo
        });
    this.organiseTodos();
    return;
};


