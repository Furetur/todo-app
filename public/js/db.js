const db = {};


db.dbUrl = 'http://localhost:6969';
db.request = axios.create({
    baseURL: 'http://localhost:6969/',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});


db.add = function add(todo){
    return this.request.post(this.dbUrl + '/todo/', todo);
    return fetch(this.dbUrl + '/todo/', {
        method: 'POST',
        body: JSON.stringify(todo)
    })
};


db.remove = function remove(id){
    return this.request.delete(this.dbUrl + '/todo/' + id)
};

db.removeAll = function removeAll(){
    return this.request.delete('/todos/');

};


db.get = function getItem(id){
    return fetch(this.dbUrl + '/todo/' + id).then(result => result.json());
};


db.getAll = function getAll(){
    return fetch(this.dbUrl + '/todos/').then(result => result.json());
};


db.changeStatus = function changeStatus(id, status){
    return this.request.put('/todo/' + id, {
        status: status
    });
};


db.changeDate = function changeDate(id, date){
    return this.request.put('/todo/' + id, {
        date: date
    });
    return fetch(this.dbUrl + '/todo/' + id, {
        method: 'PUT',
        body: JSON.stringify({date})
    })
};

db.toToday = function toToday(id){
    return this.changeDate(id, memory.getNow)
};
