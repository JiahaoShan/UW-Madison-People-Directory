'use strict';
angular.module('app').controller('dirCtrl', function ($scope, $http, $location, $anchorScroll, dirStorage) {
    
    $scope.selected = 0;
    $scope.dirStorage = dirStorage;

    $scope.$watch('dirStorage.data', function() {
        $scope.persons = $scope.dirStorage.data;
        $scope.history = $scope.dirStorage.data;
    });

    $scope.dirStorage.findAll(function(data){
        $scope.persons = data;
        $scope.$apply();
    });

    $scope.add = function() {
        dirStorage.add($scope.newContent);
        $scope.newContent = '';
    }

    $scope.remove = function(index) {
        dirStorage.remove(index);
    }

$scope.search = function(keyword) {

  if (!keyword || keyword && keyword.length == 0) {
    $scope.message = null;
    $scope.persons = $scope.history;
    $scope.selected = 0;
    return;
};

$http({
  method: 'GET',
  url: 'http://www.wisc.edu/search/live_lookup.php?q=' + encodeURIComponent(keyword)
}).then(function successCallback(response) {
    var dataDom = convertStringToDOM(response.data);
    if (dataDom.find(".person").length == 1) {
        $scope.message = dataDom.find(".person").first().text();
        $scope.persons = null;
        $scope.selected = 0;
    }
    else {
        var persons = processData(dataDom);
        $scope.persons = persons;
        $scope.selected = 0;
        $scope.message = null;
    }
}, function errorCallback(response) {
    $scope.message = "ERROR: the server cannot be connected.";
    $scope.persons = null;
    $scope.selected = 0;
});
}

$scope.redirect = function(person) {
 if (!person.email) return false;
  chrome.storage.sync.get(["recordHistory"], function(items){
    if (items && items.recordHistory == false) {
        return;
    }
    $scope.dirStorage.add(person);
  });
 var outlook = "https://outlook.office.com/owa/?rru=compose&to=" + encodeURIComponent(person.email) + "&body=Hi " + encodeURIComponent(person.name) + ",";
 var gmail = "https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + encodeURIComponent(person.email) + "&body=Hi " + encodeURIComponent(person.name) + ",";;
 chrome.storage.sync.get(["mailProvider"], function(items){
    if (items && items.mailProvider && items.mailProvider == 'Gmail') {
        chrome.tabs.create({url: gmail});
    }
    else {
        chrome.tabs.create({url: outlook});
    }
  });
 return false;
}

$scope.hover = function(index) {
    $scope.selected = index;
}

$scope.keydown = function($event) {
    if (!$scope.persons || !$scope.persons.length) {
      return false;
  }
  if ($event.keyCode == 37) {
      // left arrow
      $scope.selected = $scope.selected == 0 ? $scope.persons.length - 1 : $scope.selected - 1;
      gotoSelected();
  }
  if ($event.keyCode == 38) {
      // up arrow
      if ($scope.persons.length < 2) {
        return;
    }
    if ($scope.selected == 0) {
        $scope.selected = $scope.persons.length % 2 == 0 ? $scope.persons.length - 2 : $scope.persons.length - 1;
    }
    else if ($scope.selected == 1) {
        $scope.selected = $scope.persons.length % 2 == 0 ? $scope.persons.length - 1 : $scope.persons.length - 2;
    }
    else {
        $scope.selected = $scope.selected - 2;
    }
    gotoSelected();
}
if ($event.keyCode == 39) {
      // right arrow
      $scope.selected = ($scope.selected + 1) % ($scope.persons.length);
      gotoSelected();
  }
  else if ($event.keyCode == 40) {
      // down arrow
      if ($scope.selected == $scope.persons.length - 1) {
        $scope.selected = $scope.persons.length % 2 == 0 ? ($scope.selected + 2) % ($scope.persons.length) : 0;
    }
    else if ($scope.selected == $scope.persons.length - 2) {
        $scope.selected = $scope.persons.length % 2 == 0 ? 0 : (1 % ($scope.persons.length));
    }
    else {
      $scope.selected = ($scope.selected + 2) % ($scope.persons.length);
  }
  gotoSelected();
}
else if ($event.keyCode == 13) {
      // enter
        $scope.redirect($scope.persons[$scope.selected]);
  }
}

function gotoSelected() {
  if ($scope.selected < 4) {
    $("html, body").animate({ scrollTop: 0 }, "fast");
}
else {
  $("html, body").animate({ scrollTop:  Math.floor($scope.selected / 2) * 130 }, "fast");
}

}

function convertStringToDOM(string) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = string;
    return $(wrapper);
}

function processData(dataDom) {
    var persons = dataDom.find(".person").map(function( index ) {
        if (index == 0) return;
        var person = {};
        var name = $(this).find(".person_name").text();
        var akaDelimiter = "Also known as: ";
        var akaIndex = name.indexOf(akaDelimiter);
        if (akaIndex >= 0) {
            person.name = name.substring(0, akaIndex);
            person.aka = name.substring(akaIndex+akaDelimiter.length);
        }
        else {
            person.name = name;
        }
        person.email = $(this).find(".person_email").length ? $(this).find(".person_email").text() : null;
        person.phone = $(this).find(".person_phone").length ? $(this).find(".person_phone").text() : null;
        return person;
    });
    return persons.get();
}

});