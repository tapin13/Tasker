var storage = window.localStorage;
var tasks = new Array();

$(function() {
    setCheckbox();
    setWhenToNotify(getCookie("when_to_notify"));

    var today = new Date();
    $("#today_date").html(today.getDate() + "." + (parseInt(today.getMonth()) + 1) + "." + today.getFullYear());
    
    $("#add_task").click(function() {
        var new_task = new Object();
        new_task.date = validateField($("#new_date").val(), "date");
        new_task.time = validateField($("#new_time").val(), "time");
        new_task.date = $("#new_date").val();
        new_task.time = $("#new_time").val();
        new_task.task = $("#new_task").val();
        if(!new_task.time || !new_task.date || !new_task.task) {
            return false;
        }
        tasks[tasks.length] = new_task;
        storage.setItem("tasks", JSON.stringify(tasks));
        alert("add task ok");
        return true;
    });
    
    $("#show_notifications").click(function() {
        setCookie("show_notifications", $("#show_notifications").is(':checked'));
    });
    
    $("#when_to_notify").change(function() {
        setWhenToNotify($(this).val());
    });
    
    var now_hours = (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
    var now_minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    var now_time = now_hours + "" + now_minutes;
    
    //storage.getItem("tasks", function(items) {
        items = jQuery.parseJSON('{ "tasks" : ' + storage.getItem("tasks") + ' }');
        if(items.tasks) {
            tasks = items.tasks;
            var today_tasks = getTodayTasks(tasks);
            //var today_tasks = tasks;
            if(today_tasks.length > 0) {
                for(var i in today_tasks) {
                    var this_time = today_tasks[i].time.replace(":", "");
                    var add = this_time > now_time ? "" : " class='done'";
                    var add_html = '<li' + add + '>';
                    add_html += '<strong>' + today_tasks[i].time + '</strong> ' + today_tasks[i].task;
                    add_html += '</li>';
                    $("ul").append(add_html);
                }
            }
        }
    //});
});

var validateField = function(val, type) {
    if(type == "date") {
        var date = val.split(".");
        var year = new Date();
        year = year.getFullYear();
        if(date.length == 3 && parseInt(date[0]) == date[0] && date[0] <= 31
            && parseInt(date[1]) == date[1] && date[1] <= 12
            && parseInt(date[2]) == date[2] && date[2] >= year
        ) {
                return val;
        }
    } else if(type == "time") {
        var time = val.split(":");
        if(time.length == 2 && parseInt(time[0]) == time[0] && time[0] <= 24
            && parseInt(time[1]) == time[1] && time[1] <= 60
        ) {
                return val;
        }        
    }

    return null;
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

function setCookie(c_name,value,exdays){    
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

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

function setCheckbox() {
    var val = getCookie("show_notifications");
    document.getElementById('show_notifications').checked = ((val == "true") ? true : false);
}

function setWhenToNotify(val) {
    var last_val = getCookie("when_to_notify");
    last_val = (last_val != undefined ? last_val : 0);
    val = (parseInt(val) == val && val <= 120 ? val : last_val);
    setCookie("when_to_notify", val);
    $("#when_to_notify").val(val);
}