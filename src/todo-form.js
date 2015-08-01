var React = require('react/addons');
var TodoStorage = require('./strage.js');

var TodoForm = React.createClass({
    getInitialState: function() {
        return {
            name: ''
        };
    },
    handleNameChange: function(e) {
        this.setState({
            name: e.target.value
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        TodoStrage.create(name, function() {
            this.setState({
                name: ''
            });
        }.bind(this));
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.name !== nextState.name;
    },
    render: function() {
        var disabled = this.state.name.trim().length <= 0;
        return (
            <form onSubmit={this.handleSubmit}>
                <input value={this.state.name} onChange={this.handleNameChange}></input>
                <input type="submit" disabled={disabled}></input>
            </form>
        );
    }
});

module.exports = TodoForm;
