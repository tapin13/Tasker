//var storage = null;
var storage = window.localStorage;
var tasks = new Array();
setInterval(function() {
    var items = JSON.parse('{ "tasks" : ' + storage.getItem("tasks") + ' }');
    if(items.tasks && getCookie("show_notifications") == "true") {
        tasks = getTodayTasks(items.tasks);
        if(window.webkitNotifications) {
            var texts = getNextTask(tasks);
            for(var i in texts) {
                show(texts[i]);
            }
        }
    }
}, 20 * 1000);

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
    var today_date = today.getDate() + "." + (parseInt(today.getMonth()) + 1) + "." + today.getFullYear();
    for(var i in tasks) {
        if(tasks[i].date == today_date) {
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
        var date = tasks[i].date.split(".");
        var time = tasks[i].time.split(":");
        var task_date = new Date(parseInt(date[2]), parseInt(date[1] - 1), parseInt(date[0]), parseInt(time[0]), parseInt(time[1]), 0, 0);
        task_date = task_date.getTime();
        var delta = Math.round((task_date - now) / 60000);
        if(delta == getCookie("when_to_notify")) {
            next[next.length] = tasks[i].time + " - " + tasks[i].task;
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
                var this_time = tasks[i].time.replace(":", "");
                var next_time = tasks[i+1].time.replace(":", "");
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