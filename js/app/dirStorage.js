angular.module('app').service('dirStorage', function ($q) {
    var _this = this;
    this.data = [];

    this.findAll = function(callback) {
        chrome.storage.sync.get('history', function(keys) {
            if (keys.history != null) {
                _this.data = keys.history;
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }

    this.sync = function() {
        chrome.storage.sync.set({history: this.data}, function() {
            //console.log('Data is stored in Chrome storage');
        });
    }

    this.exists = function(person) {
        for (var i=0; i<this.data.length; i++) {
            if (this.data[i].name == person.name &&
                this.data[i].email == person.email &&
                this.data[i].phone == person.phone) {
                return i;
            }
        }
        return -1;
    }

    this.add = function (newPerson) {
        var existed = this.exists(newPerson);
        if (existed >= 0) {
            this.data.splice(existed, 1);
        }
        else if (this.data.length >= 30) {
            this.data.splice(29, this.data.length);
        }
        var person = {
            history: true,
            name: newPerson.name,
            phone: newPerson.phone,
            email: newPerson.email,
            aka: newPerson.aka,
        };
        this.data.unshift(person);
        this.sync();
    }

    this.remove = function(index) {
        this.data.splice(index, 1);
        this.sync();
    }

    this.removeAll = function() {
        this.data = [];
        this.sync();
    }

});