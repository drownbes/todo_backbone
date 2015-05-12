(function() {
    'use strict';

    function pad(num) {
        return (num > 9 ? num:'0'+num);
    }

    var config = {
        formateDate: function(date) {
            return pad(date.getHours()) + ':' + pad(date.getMinutes());
        }
    };

    var TodoModel = Backbone.Model.extend({
        defaults: {
            title: '',
            date: new Date(),
            completed: false
        },
        parse: function(data) {
            data.date = new Date(data.date);
            return data;
        },
        toggle: function() {
            this.set('completed', !this.get('completed'));
            this.save();
        }
    });

    var TodoCollection = Backbone.Collection.extend({
        model: TodoModel,
        localStorage: new Backbone.LocalStorage('todos'),
        comparator: function(item) {
            return item.get('date');
        }
    });

    var TodoView = Backbone.View.extend({
        className: 'list-group-item clearfix',
        template: _.template($('#todoTpl').html()),
        events: {
            'mouseover': 'showBtns',
            'mouseout': 'hideBtns',
            'click .done-btn': 'done',
            'click .remove-btn': 'remove'
        },
        initilize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template({
                title: this.model.get('title'),
                date: config.formateDate(this.model.get('date'))
            }));
            this.btns = this.$el.find('.control-btns');
            this.btns.hide();
            this.doneBtn = this.btns.find('.done-btn');
            this.removeBtn = this.btns.find('.remove-btn');
            this.$el.toggleClass('todo-done', this.model.get('completed'));
            return this;
        },
        showBtns: function() {
            this.btns.show();
        },
        hideBtns: function() {
            this.btns.hide();
        },
        done: function() {
            this.$el.remove();
            this.model.toggle();
        },
        remove: function() {
            this.undelegateEvents();
            this.model.destroy();
            Backbone.View.prototype.remove.call(this);
        }
    });

    var TodoApp = Backbone.View.extend({
        el: '#todoApp',
        events: {
            'click #add-btn': 'add',
            'keypress #todo-title-field': 'keypress'
        },
        initialize: function() {
            this.$title = this.$el.find('#todo-title-field');
            this.$addBtn = this.$el.find('#add-btn');
            this.$undoneList = this.$el.find('#undone');
            this.$doneList = this.$el.find('#done');

            this.listenTo(this.collection, 'change:completed', this.addOne);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.render);

            this.collection.fetch({reset:true});
            this.collection.sort();
            console.log('Init');
        },
        renderList: function(list) {
            var dom = $(document.createDocumentFragment());
            _.each(list, function(model) {
                dom.append(new TodoView({model:model}).render().$el);
            });
            return dom;
        },
        render: function() {
            this.$undoneList.html(
                this.renderList(this.collection.where({completed:false})));

            this.$doneList.html(
                this.renderList(this.collection.where({completed:true})));

            return this;
        },
        addOne: function(model) {
            (model.get('completed') ? this.$doneList:this.$undoneList).append(
                new TodoView({model: model}).render().$el
            );
        },
        clearTitleField: function() {
            this.$title.val('');
        },
        add: function() {
            this.collection.create({
                title: this.$title.val(),
                date: new Date(),
                completed: false
            });
            this.clearTitleField();
        },
        keypress: function(e) {
            if(e.which === 13) {
                e.preventDefault();
                this.add();
            }
        }
    });

    new TodoApp({
        collection: new TodoCollection()
    });
})();
