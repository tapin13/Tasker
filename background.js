//var storage = null;
var storage = window.localStorage;
var tasks = new Array();
setInterval(function() {
    var items = JSON.parse('{ "tasks" : ' + storage.getItem("tasks") + ' }');
    if(items.tasks && getCookie("show_notifications") == "true") {
        tasks = items.tasks;
        for(i in tasks) {
            tasks[i].date = new Date(tasks[i].date);
        }        
        tasks = getTodayTasks(tasks);
        if(window.webkitNotifications) {
            var texts = getNextTask(tasks);
            for(var i in texts) {
                show(texts[i]);
            }
        }
    }
}, 60 * 1000);

function getCookie(c_name){
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++){
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name){
            return unescape(y);
        }
    }
}

function getTodayTasks(tasks) {
    var today_tasks = new Array();
    var today = new Date();
    for(var i in tasks) {
        if(tasks[i].date.getDate() ==  today.getDate() && tasks[i].date.getMonth() ==  today.getMonth() && tasks[i].date.getFullYear() ==  today.getFullYear()) {
            today_tasks[today_tasks.length] = tasks[i];
        }
    }
    if(today_tasks.length > 0) {
        today_tasks = sortTasks(today_tasks);
    }
    
    return today_tasks;
}

function getNextTask(tasks) {
    var now = new Date();
    now = now.getTime();
    var next = new Array();
    for(var i in tasks) {
        var delta = Math.round((tasks[i].date - now) / 60000);
        if(delta == getCookie("when_to_notify")) {
            next[next.length] = tasks[i].date.getHours() + ":" + tasks[i].date.getMinutes() + " - " + tasks[i].task;
        }
    }
    return next;
}

function show(text) {
    var notification = window.webkitNotifications.createNotification('tasker.png', 'Prepare to task', text);
    notification.show();
}

function sortTasks(tasks) {
    if(tasks.length > 0) {
        var swapped = true;
        while(swapped) {
            swapped = false;
            for(var i = 0; i < tasks.length-1; i++) {
                var this_time = tasks[i].date.getTime();
                var next_time = tasks[i+1].date.getTime();
                if(this_time > next_time) {
                    var temp = tasks[i];
                    tasks[i] = tasks[i+1];
                    tasks[i+1] = temp;
                    swapped = true;
                }
            }
        }
    }
    return tasks;
}