var totalTime = 120, //time in seconds
    timeRemaining = totalTime,
    intervalHandle = false;

$('#start-btn').click(
    function()
    {
        $('#status').toggleClass('fa-play').toggleClass('fa-pause');
        if ( ! intervalHandle)
        {
            start();
        } else {
            pause();
        }
    }
);

$('#reset-btn').click(reset);
function start()
{
    intervalHandle = setInterval(tick, 1000);
    $('#pbar').addClass('active');
}
function pause()
{
    $('#pbar').removeClass('active');
    clearInterval(intervalHandle);
    intervalHandle = false;
}

function reset()
{
    location.reload();
}

function tick()
{
    timeRemaining--;
    var remaining = timeRemaining/totalTime,
        percent = 100 - Math.floor(remaining*100),
        minutes = Math.floor(timeRemaining/60),
        seconds = (timeRemaining % 60) < 10 ? '0' + (timeRemaining % 60) : (timeRemaining % 60),
        pbarLimit = 5;

    $('div.smile').height(70*(1-remaining));
    $('#pbar')
        .width( percent+'%')
        .attr('aria-valuenow', percent);
    $('#counter').html(minutes + ':' + seconds);
    if (percent > 66)
    {
        $('#pbar').removeClass('progress-bar-warning')
            .addClass('progress-bar-success')
    } else if (percent > 33)
    {
        $('#pbar').removeClass('progress-bar-danger')
            .addClass('progress-bar-warning')
    }

    if (timeRemaining == 0)
    {

        done();
    }
}

function done()
{
    clearInterval(intervalHandle);
    intervalHandle = false;
    $('#status').toggleClass('fa-play').toggleClass('fa-pause');
    $('body').addClass('done');
    $('#start-btn').addClass('hidden');
    $('#reset-btn').removeClass('hidden');
    $.playSound('sound/done' + (Math.floor(Math.random()*14)+1));
    $('#pbar').removeClass('active')
        .removeClass('progress-bar-danger')
        .removeClass('progress-bar-warning')
        .removeClass('progress-bar-success')
        .addClass('progress-bar-default');
    $('#confettiPlaceholder').removeClass('hidden');
    var confettiEffect = new confetti.Context('confettiPlaceholder');
    confettiEffect.start();
    $(window).resize(function() {
        confettiEffect.resize();
    });
}

(function($){

    $.extend({
        playSound: function(name){
            return $(
                "<embed src='"+name+".mp3' hidden='true' autostart='true' loop='false' class='playSound' >"
                    + "<audio autoplay='autoplay' style='display:none;' controls='controls' id='sound-" + name +"'><source src='"+name+".mp3' /><source src='"+name+".ogg' /></audio>"
            ).appendTo('body');
        }
    });

})(jQuery);
