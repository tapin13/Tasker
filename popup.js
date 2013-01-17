var storage = window.localStorage;
var tasks = new Array();

$(function() {
    fillSelectors();
    setCheckbox();
    setWhenToNotify(getCookie("when_to_notify"));

    var today = new Date();

    $("#today_date").html(today.getDate() + "." + (parseInt(today.getMonth()) + 1) + "." + today.getFullYear());
    
    $("#add_task").click(function() {
        var new_task = new Object();
        new_task.date = $("#add_task_day").val() + "." + $("#add_task_month").val()+ "." + $("#add_task_year").val();
        new_task.time = $("#add_task_hour").val() + ":" + $("#add_task_minute").val();
        new_task.task = $("#new_task").val();
        if(new_task.task == '') {
            return false;
        }
        tasks[tasks.length] = new_task;
        storage.setItem("tasks", JSON.stringify(tasks));
        
        $("#new_task").val('');
        showTasks();
        
        return true;
    });
    
    $("#show_notifications").click(function() {
        setCookie("show_notifications", $("#show_notifications").is(':checked'));
    });
    
    $("#when_to_notify").change(function() {
        setWhenToNotify($(this).val());
    });

    showTasks();
});

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

function fillSelectors() {
    var html = '';
    
    var today = new Date();
    
    html = '<option value="">Day</option>'
    for(var i = 1; i < 32; i++) {
        html += '<option value="' + i + '" ' + (i == today.getDate() ? 'selected' : '') + '>' + addZero(i) + '</option>';
    }
    $("#add_task_day").append(html);
    
    html = '<option value="">Month</option>'
    for(var i = 1; i < 13; i++) {
        html += '<option value="' + (i) + '" ' + (i == (parseInt(today.getMonth()) + 1) ? 'selected' : '') + '>' + addZero(i) + '</option>';
    }
    $("#add_task_month").append(html);
    
    html = '<option value="">Year</option>'
    for(var i = today.getFullYear(); i < today.getFullYear() + 6; i++) {
        html += '<option value="' + i + '" ' + (i == today.getFullYear() ? 'selected' : '') + '>' + addZero(i) + '</option>';
    }
    $("#add_task_year").append(html);
    
    html = '<option value="">Hour</option>'
    for(var i = 0; i < 24; i++) {
        html += '<option value="' + i + '" ' + (i == today.getHours() ? 'selected' : '') + '>' + addZero(i) + '</option>';
    }
    $("#add_task_hour").append(html);
    
    html = '<option value="">Minute</option>'
    for(var i = 0; i < 60; i++) {
        html += '<option value="' + i + '" ' + (i == today.getMinutes() ? 'selected' : '') + '>' + addZero(i) + '</option>';
    }
    $("#add_task_minute").append(html);
    
    html = '<option value="">Minutes</option>'
    for(var i = 1; i < 60; i++) {
        html += '<option value="' + i + '" ' + (i == 5 ? 'selected' : '') + '>' + i + '</option>';
    }
    $("#when_to_notify").append(html);
}

function showTasks() {
    var today = new Date();
    
    var now_hours = addZero(today.getHours());
    var now_minutes = addZero(today.getMinutes());
    var now_time = now_hours + "" + now_minutes;
    
    //storage.getItem("tasks", function(items) {
        items = jQuery.parseJSON('{ "tasks" : ' + storage.getItem("tasks") + ' }');
        if(items.tasks) {
            tasks = items.tasks;
            var today_tasks = getTodayTasks(tasks);
            //var today_tasks = tasks;
            if(today_tasks.length > 0) {
                $("ul").empty();
                for(var i in today_tasks) {
                    var this_time = today_tasks[i].time.replace(":", "");
                    var today_tasks_time_arr = today_tasks[i].time.split(":");
                    var add = this_time > now_time ? "" : " class='done'";
                    var add_html = '<li' + add + '>';
                    add_html += '<strong>' + addZero(today_tasks_time_arr[0]) + ":" + addZero(today_tasks_time_arr[1]) + '</strong> ' + today_tasks[i].task;
                    add_html += '</li>';
                    $("ul").append(add_html);
                }
            }
        }
    //});
}

function addZero(num) {
    return (num < 10 ? "0" + num : num );
}