$(function(){
    if(!$.jStorage.storageAvailable()) {
        alert("localStorage not supported.");
    }
    else {
        listTasks();
        updateProgressBar();
    }

    var index = $.jStorage.index();
    var i = index.length;
    if(i == null) { i = 0; }
    i++;

    var validate = $("form").validate({
        rules: {
            task: {
                required: true
            }
        },
        messages: {
            "task": {
                required: "Fill with task name"
            }
        },
        errorPlacement: function(error, element) {
            var elem = $(element);

            if(!error.is(':empty')) {
                elem.filter(':not(.valid)').tooltip({
                    trigger: 'manual',
                    title: error.text(),
                    placement: 'top' // Tooltip placement: (top | right | bottom | left)
                });

                elem.tooltip('show');
                $('.tooltip').addClass('error');
                elem.parent().addClass('has-error');
            }
            else {
                elem.tooltip('destroy');
                elem.parent().removeClass('has-error');
            }
        },
        success: $.noop
    });

    $('form input:submit').click(function(e) {
        $('form').submit();

        e.preventDefault();
    });

    $('form').submit(function(e) {
        if( $(this).valid() ) {
            $.jStorage.set('task_'+ i, $('#task').val());
            $.jStorage.set('completed_'+ i, 0);
            updateProgressBar();

            var $li = $('<li />');
            var $button = $('<button />');
            var $span = $('<span />');

            $button.attr('role', 'button');
            $button.attr('id', 'btn-'+ i);
            $button.addClass('btn btn-link btn-lg task');
            $span.addClass('glyphicon glyphicon-unchecked');

            $button.text(' '+ $('#task').val() );
            $span.prependTo($button);

            $button.appendTo($li);
            $li.appendTo('.tasks');

            $('#task').val("");
            i++;
        }

        e.preventDefault();
    });

    $(document.body).on('click', 'button.task', function() {
        if( $(this).parent().hasClass('checked') ) {
            $.jStorage.set('completed_'+ $(this).attr('id').substr(4), 0);
            $(this).children('span').removeClass('glyphicon-ok');
            $(this).children('span').addClass('glyphicon-unchecked');
            $(this).parent().removeClass('checked');

//					console.log( $.jStorage.get('completed_'+ $(this).attr('id').substr(4)) );
        }
        else {
            $.jStorage.set('completed_'+ $(this).attr('id').substr(4), 1);
            $(this).children('span').removeClass('glyphicon-unchecked');
            $(this).children('span').addClass('glyphicon-ok');
            $(this).parent().addClass('checked');

//					console.log( $.jStorage.get('completed_'+ $(this).attr('id').substr(4)) );
        }
        updateProgressBar();
    });

    $(document.body).on('click', 'button.empty', function() {
        $.jStorage.flush();
        $('.tasks').empty();
        updateProgressBar();
    });
});

var listTasks = function() {
    var j,
        tasks = $.jStorage.index();

    for(j = 0; j < tasks.length; ++j) {
        var name = tasks[j];
        var index = name.split('_');

        if(index[0] == 'task') {
            var $li = $('<li />');
            var $button = $('<button />');
            var $span = $('<span />');

            $button.attr('role', 'button');
            $button.attr('id', 'btn-'+ index[1]);
            $button.addClass('btn btn-link btn-lg task');

            if($.jStorage.get('completed_'+ index[1] ) == '0') {
                $span.addClass('glyphicon glyphicon-unchecked');
            }
            else {
                $span.addClass('glyphicon glyphicon-ok');
                $li.addClass('checked');
            }

            $button.text(' '+ $.jStorage.get('task_'+ index[1] ));
            $span.prependTo($button);

            $button.appendTo($li);
            $li.appendTo('.tasks');
        }
    }
};

var updateProgressBar = function() {
    var completed = 0,
        total = 0,
        progress = 0,
        index = $.jStorage.index();

    if(index.length > 0) {
        for (var j = 0; j < index.length; ++j) {
            if (/completed_\d+/.test(index[j])) {
                total++;

                if ($.jStorage.get(index[j]))
                    completed++;
            }
        }

        progress = Math.floor((completed / total) * 100);
    }
    
    $('.progress-bar').attr('aria-valuenow', progress).css('width', progress +'%');
}