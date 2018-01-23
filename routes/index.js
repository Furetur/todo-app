const todoRoutes = require('./todo_routes');

module.exports = function(app, database){
    todoRoutes(app, database);
};