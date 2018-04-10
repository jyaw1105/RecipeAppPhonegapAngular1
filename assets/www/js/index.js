/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var recipeApp = angular.module("RecipeApp",[]);
//  recipeApp.config(['$qProvider', function ($qProvider) {
//  $qProvider.errorOnUnhandledRejections(false);
//  }]);

recipeApp.controller("RecipeCtrl", ["$scope","$http","$window",function($scope,$http,$window){
  $scope.init=function(){
        $scope.loadAll();
    }

  $scope.loadAll = function(){
    var URL = "https://apppppp.000webhostapp.com/Angular/selectall_recipe.php";
    $http.get(URL).then(function(response){
      $scope.data = response.data.recipe;
    });
  }

  $scope.search = function(){
    var data = $.param({
              ingredient: $scope.inputSearch,
        });
    var URL = "https://apppppp.000webhostapp.com/Angular/search_recipe.php";
    var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
    $http.post(URL,data, config).then(function(response){
      $scope.data = response.data.recipe;
      if(response.data.recipe.length == 0){
          //$scope.noRecipe();
          $scope.noRecipe = true;
      }else{
        $scope.noRecipe = false;
        //$("#noRecipe").hide();
      }
    });
  }

  //$scope.noRecipe = function(){
  //  $("#noRecipe").show();
  //}

  $scope.clickAdd = function(){
    window.location = "add.html";
  }

  $scope.clickDetail = function clickDetail(item){

    $scope.detailId = item.id;
    $scope.detailName = item.name;
    $scope.detailIngredient = item.ingredient;
    $scope.detailStep = item.step;
    $scope.detailType = item.type;
    sessionStorage.detailId =item.id;
    sessionStorage.detailName = item.name;
    sessionStorage.detailIngredient = item.ingredient;
    sessionStorage.detailStep = item.step;
    sessionStorage.detailType = item.type;

    window.location = "detail.html";

  }

  var config = {
  title: "Choose Type...",
  items: [
      { text: "All", value: "All" },
      { text: "Vegetarian", value: "Vegetarian" },
      { text: "Fast Food", value: "Fast Food" },
      { text: "Healthy", value: "Healthy" },
      { text: "No-Cook", value: "No-Cook" },
      { text: "Make Ahead", value: "Make Ahead" }
  ],
  };

  $scope.clickFilter = function(){
      window.plugins.listpicker.showPicker(config,
    function(item) {
      $scope.filterType = item;
      if(item === "All"){
        $scope.loadAll();
      }else{
        $scope.filter();
      }
    },
    function() {
    }
    );
  }
  $scope.filter = function(){
    var data = $.param({
            type: $scope.filterType,
      });
    var URL = "https://apppppp.000webhostapp.com/Phonegap/select_recipe_by_type.php";
    var config = {
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
    }
    $http.post(URL,data, config).then(function(response){
        $scope.data = response.data.recipe;
        if(response.data.recipe.length == 0){
          $scope.noRecipe = true;
        }else{
          $scope.noRecipe = false;
      }
    });
  }

  $scope.validation = function(){
    var error = "";
    $scope.error="";
    if($scope.inputName === '' || $scope.inputName === undefined){
      error += "Name cannot be empty. <br/>"
      $scope.error += "Name cannot be empty. <br/>"
    }if($scope.inputIngredient === '' || $scope.inputIngredient === undefined){
      error += "Ingredient cannot be empty.<br/>"
    }if($scope.inputStep === '' || $scope.inputStep === undefined){
      error += "Step cannot be empty.<br/>"
    }if($scope.inputType === '' || $scope.inputType === undefined){
      error += "Choose a type.<br/>"
    }
    if(error == ""){
      $scope.add();
    }
    document.getElementById("error").innerHTML = error;
  }

  $scope.add = function(){
    var data = $.param({
            name: $scope.inputName,
            ingredient: $scope.inputIngredient,
            step: $scope.inputStep,
            type: $scope.inputType,
      });
      var URL = "https://apppppp.000webhostapp.com/Phonegap/insert_recipe.php";
    var config = {
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
    }
    $http.post(URL,data, config).then(function(response){
        if(response.data.success == 1){
          window.location.replace("index.html");
        }
          alert(response.data.message);
        });
  }

  $scope.back = function(){
    window.location = "index.html";
  }
  $scope.backTo = function(){
    navigator.app.backHistory();
  }
  $scope.clickEdit = function(){
    window.location = "edit.html";
  }
  $scope.clear = function(){
    $window.navigator.notification.confirm(
          'Are you sure to clear? ', // message
           function(index){
             if(index === 1){
               $scope.inputName = "";
               $scope.inputIngredient = "";
               $scope.inputStep = "";
               $scope.inputType = "null";
               $('#inputType').change();
             }
           },            // callback to invoke with index of button pressed
          'Clear',           // title
          ['Clear','No']         // buttonLabels
      );
  }

  $scope.reset = function(){
    $window.navigator.notification.confirm(
      'Are you sure to reset? ', // message
       function(index){
         if(index === 1){
           $scope.inputName = sessionStorage.detailName;
           $scope.inputIngredient = sessionStorage.detailIngredient;
           $scope.inputStep = sessionStorage.detailStep;
           $scope.inputType = sessionStorage.detailType;
           $('#inputType').change();
         }
       },            // callback to invoke with index of button pressed
      'Reset',           // title
      ['Reset','No']         // buttonLabels
    );
  }

  $scope.delete = function(){
    $window.navigator.notification.confirm(
          'Are you sure to delete? ', // message
           function(index){
             if(index === 1){
               var data = $.param({ id: sessionStorage.detailId });
               var URL = "https://apppppp.000webhostapp.com/Phonegap/delete_recipe.php";
               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}
               $http.post(URL,data, config).then(function(response){
                   if(response.data.status == 1){
                     window.location.replace("index.html");
                   }
                     alert(response.data.message);
               });
             }
           },            // callback to invoke with index of button h3ssed
          'Delete',           // title
          ['Delete','No']         // buttonLabels
      );
  }

  $scope.edit = function(){
    var data = $.param({
            id: sessionStorage.detailId,
            name: $scope.inputName,
            ingredient: $scope.inputIngredient,
            step: $scope.inputStep,
            type: $scope.inputType,
      });
      var URL = "https://apppppp.000webhostapp.com/Phonegap/edit_recipe.php";
    var config = {
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
    }
    $http.post(URL,data, config).then(function(response){
        if(response.data.status == 1){
          sessionStorage.detailName = $scope.inputName;
          sessionStorage.detailIngredient = $scope.inputIngredient;
          sessionStorage.detailStep = $scope.inputStep;
          sessionStorage.detailType = $scope.inputType;
          $scope.detailName = $scope.inputName;
          $scope.detailIngredient = $scope.inputIngredient;
          $scope.detailStep = $scope.inputStep;
          $scope.detailType = $scope.inputType;
          window.location.replace("detail.html");
        }
          alert(response.data.message);
        });
  }

  $scope.loadAll();
  $scope.noRecipe = false;
}]);
