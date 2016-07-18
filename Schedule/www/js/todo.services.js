/**
 * Created by V3790154 on 6/29/2016.
 */
angular.module('todo.services',[])
  
  .factory("SQLService",function($q){
    var db;


    function createDB(){
      try{
        db = window.openDatabase("todoDB","1.0","ToDoApp",10*1024*1024);
        db.transaction(function(tx){
          tx.executeSql("create table if not exists tasks (task_id integer not null primary key autoincrement,task_name varchar(100) )",[] );
        });
      }catch (err){
        alert("Error processing Sql: " + err);
      }
    }
    function setTask(tname){
      return promisedQuery("insert into tasks (task_name) values ('" + tname + "')", defaultResultHandler,defaultErrorHandler);
    }

    function delTasks(tid){
      return promisedQuery("delete from tasks where task_id=" + tid , defaultResultHandler,defaultErrorHandler);
    }
    function UpdateTasks(tname,tid){
      return promisedQuery("update tasks set task_name='" + tname +"'  where task_id=" + tid , defaultResultHandler,defaultErrorHandler);
    }
    function getTasks(tname,tid){
      return promisedQuery("select * from tasks", defaultResultHandler,defaultErrorHandler);
    }
    function defaultResultHandler(deferred) {
      return function (tx, results) {
        var len = results.rows.length;
        var output_results = [];

        for (var i = 0; i < len; i++) {
          var t={'task_id':results.rows.item(i).task_id,'task_name': results.rows.item(i).task_name};
          output_results.push(t);
        }
        deferred.resolve(output_results);
      }
    }
    function defaultErrorHandler(deferred){
      return function(tx,result){
        var len=0;
        var output_result='';
        deferred.resolve(output_result);
      }
    }
    function promisedQuery(query,successCB,errorCB){
      var deferred=$q.defer();
      db.transaction(function(tx){
        tx.executeSql(query,[],successCB(deferred),errorCB(deferred));
      }, errorCB);
      return deferred.promise;
    }
    return {
      setup:function(){
        return createDB();
      },
      set: function(t_name){
        return setTask(t_name);
      },
      del:function(taskid){
        return delTasks(taskid);
      },
      edit:function(t_name,t_id){
        return UpdateTasks(t_name,t_id);
      },
      all:function(){
        return getTasks();
      }
    }
  });
