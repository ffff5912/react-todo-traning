// ブラウザのグローバル変数をNode.js上で使うための準備
var jsdom = require('jsdom').jsdom;
global.document = jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

var should = require('should');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('todo-form', function() {
    it('should keep input value when submission failed', function() {
        var React = require('react/addons');
        var TestUtils = React.addons.TestUtils;

        // 入力が'ok'でない場合にエラーを返すように、TodoStorageのモックオブジェクトを作成
        var TodoStorage = {
            create: function(name, callback) {
                callback(name === 'ok' ? null : 'error');
            }
        };
        TodoStorageSpy = sinon.spy(TodoStorage, 'create');
        var TodoForm = proxyquire('../src/todo-form.js', {
            './storage.js': TodoStorage
        });

        var form = TestUtils.renderIntoDocument( <TodoForm/> );

        var input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input')[0];
        var button = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input')[1];

        // 1: inputが'ok'の状態でsubmitすると、inputが初期化される
        TestUtils.Simulate.change(input, { target: { value: 'ok' }});
        TestUtils.Simulate.submit(button);

        TodoStorageSpy.withArgs('ok').callCount.should.equal(1);
        input.getDOMNode().value.should.equal('');

        // 2: inputが'ng'の状態でsubmitすると、inputは初期化されずに残る
        TestUtils.Simulate.change(input, { target: { value: 'ng' }});
        TestUtils.Simulate.submit(button);

        TodoStorageSpy.withArgs('ng').callCount.should.equal(1);
        input.getDOMNode().value.should.equal('ng');
    });
});
