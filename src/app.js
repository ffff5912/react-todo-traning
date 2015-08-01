var React = require('react/addons');
var Perf = React.addons.Perf;
var TodoStrage = require('./strage.js');
var TodoForm = require('./todo-form.js');
var Router = require('director').Router;

var Todo = React.createClass({
    handleClick: function() {
        TodoStrage.complete(this.props.todo.id);
    },
    render: function() {
        var todo = this.props.todo;
        var doneButton = todo.done ? null : (<button onClick={this.handleClick}> Done </button>);
        return (<li>{todo.name}{doneButton}</li>);
    }
});

var TodoList = React.createClass({
    render: function() {
        var rows = this.props.todos.filter(function(todo) {
            return !todo.done;
        }).map(function(todo) {
            return (
                <Todo key={todo.id} todo={todo}></Todo>
            );
        });
        return (
            <div className="active-todos">
                <h2>Active</h2>
                <ul>{rows}</ul>
                <TodoForm />
            </div>
        );
    }
});

var CompletedTodoList = React.createClass({
  render: function() {
    var rows = this.props.todos.filter(function(todo) {
      return todo.done;
    }).map(function(todo) {
      return (<Todo key={todo.id} todo={todo}></Todo>);
    });
    return (
      <div className="completed-todos">
        <h2>Completed</h2>
        <ul>{rows}</ul>
      </div>
    );
  }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            todos: []
        };
    },
    componentDidMount: function() {
        //one of the lifecycle methods
        var setTodoState = function() {
            TodoStrage.getAll(function(todos) {
                Perf.start();
                this.setState({
                    todos: todos
                }, function() {
                    Perf.stop();
                    Perf.printWasted();
                });
            }.bind(this));
        }.bind(this);
        //フィードバックをうけとる
        TodoStrage.on('change', setTodoState);
        setTodoState();

        var setActivePage = function() {
          this.setState({ page: 'active'});
        }.bind(this);
        var setCompletedPage = function() {
          this.setState({ page: 'completed' });
        }.bind(this);
        var router = Router({
          '/active': setActivePage,
          '/completed': setCompletedPage,
          '*': setActivePage,
        });
        router.init();
      },
      render: function() {
        var page = this.state.page === 'active' ?
          (<TodoList todos={this.state.todos} />) :
          (<CompletedTodoList todos={this.state.todos} />);
        return (
          <div>
            <h1>My Todo</h1>
            <ul>
              <li><a href="#/active">Active</a></li>
              <li><a href="#/completed">Completed</a></li>
            </ul>
            {page}
          </div>
        );
      }
});

React.render(
    <App></App>,
    document.getElementById('app-container')
);
