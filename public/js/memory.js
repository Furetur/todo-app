const memory = {
    todos: [],

    get now(){
        return new Date();
    },

    get thisSunday(){
        return this.getBeginningOfWeek(this.now);
    },

    isSameDay(date1, date2){
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },

    getBeginningOfWeek(date){
        const beginning = new Date(date);
        beginning.setDate(beginning.getDate() - beginning.getDay());
        return beginning;
    },

    thisWeekUnorganised: [],
    thisWeekByDays: [[], [], [], [], [], [], []],
    overdue: [],

    organiseTodos(){
        const thisWeek = this.todos.filter(todo => {
            return this.isSameDay(this.getBeginningOfWeek(this.now), this.getBeginningOfWeek(todo.date));
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

    },

    get(id){
        return this.todos.find(todo => todo._id === id);
    },

    add(todo){
        this.todos.push(todo);
        this.organiseTodos();
    },

    remove(id){
        let index = this.todos.findIndex(todo => todo._id === id);

        if(index >= 0){
            this.todos.splice(index, 1);
            this.organiseTodos();
        }
    },

    changeStatus(id, newStatus){
        this.get(id).status = newStatus;
    },

    changeDate(id, newDate){
        this.get(id).date = new Date(newDate);
    },

    changeProperty(id, propertyName, value){
        this.get(id)[propertyName] = value;
    },

    toToday(id){
        let todo = this.get(id);
        todo.date = this.now;
        todo.organised = true;

        this.organiseTodos();
    },

    async update(){
        this.todos = (await db.getAll()).map(todo => {
            todo.date = new Date(todo.date);
            return todo
        });
        this.organiseTodos();
        return;
    },


};