var React = require('react/addons');

var generateId = (function() {
    var id = 0;
    return function() {
        return '_' + id++;
    };
})();

var todos = [{
    id: generateId(),
    name: 'Buy some milk'
}, {
    id: generateId(),
    name: 'Birthday present'
}];

var TodoStrage = {
    on: function(_, _callback) { //TODO use EventEmitter
        this._onChangeCallback = _callback;
    },
    getAll: function(callback) {
        callback(todos);
    },
    complete: function(id) {
        for (var i = 0; i < todos.length; i++) {
            var todo = todos[i];
            if (todo.id === id) {
                var newTodo = React.addons.update(todo, {
                    done: {
                        $set: true
                    }
                });
                todos = React.addons.update(todos, {
                    $splice: [
                        [i, 1, newTodo]
                    ]
                });
                this._onChangeCallback();
                break;
            }
        }
    },
    create: function(name, callback) {
        var newTodo = {
            id: generateId(),
            name: name
        };
        todos = React.addons.update(todos, {
            $push: [newTodo]
        });
        this._onChangeCallback();
        callback();
    }
};
module.exports = TodoStrage;
