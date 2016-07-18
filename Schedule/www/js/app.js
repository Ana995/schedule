/**
 * Created by V3790154 on 6/29/2016.
 */
var app= angular.module('musicApp', ['ionic','todo.services']);

app.config(['$ionicConfigProvider','$stateProvider','$urlRouterProvider', function($ionicConfigProvider,$stateProvider,$urlRouterProvider) {

  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  $stateProvider
    .state('tabs',{
      url: '/tab',
      abstract:true, //nu o sa vreau sa am o pagina doar cu tabs(niciodata!)
      templateUrl:'templates/tabs.html'
    })
    .state('tabs.home',{
      url:'/home',
      views:{
        'home-tab' :{
          templateUrl:'templates/home.html'
        }
      }
    })
    .state('tabs.list',{
       url:'/list',
       views:{
          'list-tab' :{
            templateUrl:'templates/list.html',
            controller:'ListCtrl',
            controllerAs:'list'
          }
      }
  })
    .state('tabs.detail',{
      url:'/list/:aId',
      views:{
        'list-tab' :{
          templateUrl:'templates/detail.html',
          controller:'ListCtrl'
        }
      }
    })
  .state('tabs.calendar',{
    url:'/calendar',
    views:{
      'calendar-tab' :{
        templateUrl:'templates/calendar.html',
        controller:'CalendarCtrl'
      }
    }
  })
   $urlRouterProvider.otherwise('/tab/home');
}]);
app.run(function($ionicPlatform){
  $ionicPlatform.ready(function(){
    if(window.cordova && window.cordova.plugins.Keyboard){
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar){
      StatusBar.styleDefault();
    }
  });
});

app.controller('CalendarCtrl',['$scope','$http','$ionicPopup','$state',function($scope,$http,$ionicPopup,$state){
  debugger;
  $http.get('package.json').success(function(data){
    debugger;
    $scope.calendar=data.calendar;
    $scope.data= { showDelete:false,
      showReorder:false};
    $scope.moveItem=function(item,fromIndex,toIndex){
      $scope.artists.splice(fromIndex,1);
      $scope.artists.splice(toIndex,0,item);
    },
      $scope.backHome = function() {
        window.history.back();
      },
     $scope.doRefresh=function(){
        $http.get('package.json').success(function(data) {
        $scope.calendar = data.calendar;
        $scope.$broadcast('scroll.refreshComplete');
      })
    },
    $scope.toggleStar=function(item){
      item.star = !item.star;
    },
    $scope.onItemDelete=function(dayIndex,item){
      $ionicPopup.confirm({
        title:'Confirm Delete',
        content:'Are you sure you want to delete this?'
      }).then(function(res){
        if(res){
          $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item),1);
        }
      });
    }
  });
}]);
app.controller('ListCtrl',['$scope','$http','$ionicPopup','$state',function($scope,$http,$ionicPopup,$state){
  $http.get('package.json').success(function(data){
    $scope.artists=data.artists;
    $scope.whichArtist=$state.params.aId;
    $scope.data= { showDelete:false,
    showReorder:false};
    $scope.moveItem=function(item,fromIndex,toIndex){
      $scope.artists.splice(fromIndex,1);
      $scope.artists.splice(toIndex,0,item);
    }
    $scope.doRefresh=function(){
      $http.get('package.json').success(function(data) {
        $scope.artists = data.artists;
        $scope.$broadcast('scroll.refreshComplete');
      })
      }
    $scope.toggleStar=function(item){
      item.star = !item.star;
    }
    $scope.onItemDelete=function(item){
      $ionicPopup.confirm({
        title:'Confirm Delete',
        content:'Are you sure you want to delete this task ?'
      }).then(function(res){
        if(res){
          $scope.artists.splice($scope.artists.indexOf(item),1);
        }
      });
    }
  });

}]);
/*app.controller('TodoCtrl', function($scope, $ionicModal, $ionicPopup,SQLService) {
  //debugger;
  SQLService.setup();
  $scope.loadTask=function(){
    SQLService.all().then(function(results){
      $scope.tasks=results;
    })
  }
   $scope.loadTask();

  $ionicModal.fromTemplateUrl('new-task.html',function(modal) {
    $scope.taskModal = modal;
  }, {
       scope:$scope,
      animation:'slide-in-up'
  });

 $scope.newTask=function(){

   $scope.taskModal.show();

 }
  $scope.closeNewTask=function(){
    $scope.taskModal.hide();
  }

  $scope.createTask=function(task){
   SQLService.set(task.title);
    $scope.loadTask();
    $scope.taskModal.hide();
    task.title="";
  }
  $scope.onItemDelete=function(taskid){
    $ionicPopup.confirm({
      title:'Confirm Delete',
      content:'Are you sure you want to delete this task ?'
    }).then(function(res){
       if(res){
         SQLService.del(taskid);
         $scope.loadTask();
       }
    });
  }
  $scope.onItemEdit=function(taskid){
    $ionicPopup.prompt({
       title:'Update task',
      suntitle:'Enter new task'
    }) .then(function(res){
       if(res){

         SQLService.edit(res,taskid);
         $scope.loadTask();
       }
    });
  }
  $scope.moveItem = function(item,fromIndex,toIndex){
    debugger;
    var vm=this;
    vm.items.splice(fromIndex,1);
 vm.items.splice(toIndex,0,item);
  }
});*/
