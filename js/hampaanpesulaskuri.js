var totalTime = 120, //time in seconds
    timeRemaining = totalTime,
    intervalHandle = false;

$( document ).ready(function() {
  $('#start-btn').click(function() {
        $('#status').toggleClass('fa-play').toggleClass('fa-pause');
        if ( ! intervalHandle) {
            start();
        } else {
            pause();
        }
    }
  );

  $('#reset-btn').click(reset);
});

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
    if (timeRemaining == totalTime)
    {
        $('div.smile').height(0);
    }
    timeRemaining--;
    var remaining = timeRemaining/totalTime,
        percent = 100 - Math.floor(remaining*100),
        minutes = Math.floor(timeRemaining/60),
        seconds = (timeRemaining % 60) < 10 ? '0' + (timeRemaining % 60) : (timeRemaining % 60),
        pbarLimit = 5;

    $('div.smile').height(60*(1-remaining));
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
    $('#start-btn').addClass('hidden');
    $('#reset-btn').removeClass('hidden');
    $('#pbar').removeClass('active');
    playSound();
    fireConfetti();
    openMouth();
}

function openMouth()
{
    $('.smile').css('border', '5px solid #222')
        .css('background-color', 'rgb(253, 252, 241)');
    $('table.teeth').removeClass('hidden');
}

function playSound()
{
    var a = new Audio();
    a.autoplay = true;
    var audiofilename = 'sound/done' + (Math.floor(Math.random()*14)+1);

    if (a.canPlayType("audio/mp3")) {
        a.src = audiofilename + ".mp3";
        a.load();
        a.play();
    } else if(a.canPlayType("audio/ogg; codec=vorbis")) {
        a.src = audiofilename + ".ogg";
        a.load();
        a.play();
    } else {
        console.log("audio not supported");
    }
}

function fireConfetti()
{
    $('#confettiPlaceholder').removeClass('hidden').addClass('done');
    var confettiEffect = new confetti.Context('confettiPlaceholder');
    confettiEffect.start();
    $(window).resize(function() {
        confettiEffect.resize();
    });
}
