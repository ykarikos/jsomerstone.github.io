config = {
    'playerCount':2,
    'time': 30
},
save = {
    players: [
        {
            'n' : 0,
            'name' : 'Player 1',
            'progress' : 0,
            'turnLength' : 0
        },{
            'n' : 1,
            'name' : 'Player 2',
            'progress' : 0,
            'turnLength' : 0
        }
    ],
    turn: 0,
    current: 0,
    next: 1
},
game = {
    ongoing: false,
    interval: false
};


function loadSettings()
{
    if (localStorage.getObject('config'))
        config = localStorage.getObject('config');

    if (localStorage.getObject('save'))
        save = localStorage.getObject('save');
}

$(document).ready(function(){

    loadSettings();
    $('#playerCount').val(config.playerCount);
    $('#time').val(config.time);

   $('#update-btn').click(updateSettings);
   $('#playerCount').blur(updateSettings).keyup(updateSettings);
   $('#time').blur(updateSettings).keyup(updateSettings);
   $('#stop-btn').click(stopTimer);
   $('#game-btn').click(startKeyPressed);
   $('#reset-btn').click(resetProgress);
    updateSettings();
});

function updateProgressBar(player)
{
    var totalTime = 60*config.time,
        timeSpent = Math.floor(player.progress + player.turnLength/1000),
        percent = Math.floor(timeSpent / totalTime * 100),
        minutes = Math.floor(timeSpent/60),
        seconds = (timeSpent % 60) < 10 ? '0' + (timeSpent % 60) : (timeSpent % 60)
        ;
    $('#name-' + player.n).val(player.name);
    $('#pbar-' + player.n).width(percent + '%').attr('aria-valuenow', percent);
    $('#progress-' + player.n).html(minutes+':'+seconds);
}

function nameChanged()
{
    for (var i = 0; i < save.players.length; i++)
    {
        save.players[i].name = $('#name-' + i).val();
    }
    localStorage.setItem('save', save);
}

function drawProgressBar(player)
{
    return '<div class="row">'
            + '<div class="form-group col-xs-2">'
                + '<input id="name-' + player.n + '" value="' + player.name +'" type="text" class="player-name">'
            + '</div> <div class="progress">'
                + '<div id="pbar-'+ player.n +'" class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" >'
                    + '<span id="progress-'+ player.n +'">0:00</span>'
                + '</div>'
            + '</div>'
        + '</div>';
}

function drawGameArea()
{
    var htmlContent = '';
    for (var i = 0; i < save.players.length; i++)
    {
        htmlContent += drawProgressBar(save.players[i]);
    }
    $('#progress-bars').html(htmlContent);
    for (var i = 0; i < save.players.length; i++)
    {
        updateProgressBar(save.players[i]);
    }

    $('#pbar-' + save.current).removeClass('progress-bar-warning').addClass('progress-bar-info');
    $('input.player-name').blur(nameChanged);
}

function updateSettings()
{
    config.playerCount = $('#playerCount').val();
    config.time = $('#time').val();

    localStorage.setObject("config", config);
    while (config.playerCount > save.players.length)
    {
        save.players[save.players.length] = {
            'n': save.players.length,
            'name' : 'Player ' + (save.players.length+1),
            'progress' : 0,
            'turnLength' : 0

        }
    }
    while (config.playerCount < save.players.length)
    {
        save.players.pop();
    }
    localStorage.setObject("save", save);
    drawGameArea();
}

function startKeyPressed()
{
    if ( ! game.ongoing)
    {
        startTimer();
    } else {

        switchTimer();
    }
}

function startTimer()
{
    game.ongoing = true;
    $('#pbar-' + save.current).removeClass('progress-bar-warning').addClass('progress-bar-info active');
    save.players[save.current].turnStarted = new Date().getTime();
    save.players[save.current].turnLength = 0;
    game.interval = setInterval(tick, 500);
}

function switchTimer()
{
    updateProgress();
    $('#pbar-' + save.current).removeClass('progress-bar-info active').addClass('progress-bar-warning');
    $('#pbar-' + save.next).removeClass('progress-bar-warning').addClass('progress-bar-info active');

    save.current = save.next;
    save.next = (save.next+1 > save.players.length-1)
        ? 0 : save.next+1;

    save.players[save.current].turnStarted = new Date().getTime();
    save.players[save.current].turnLength = 0;

    if (save.current == 0)
        save.turn++;

    localStorage.setItem('save', save);
}

function updateProgress()
{
    save.players[save.current].progress += (save.players[save.current].turnLength / 1000);
    save.players[save.current].turnLength = 0;
    localStorage.setObject("save", save);
}

function stopTimer()
{
    game.ongoing = false;
    clearInterval(game.interval);
    updateProgress();
    $('#pbar-' + save.current).removeClass('active')
    $('#update-btn').prop('disabled', false);
}

function resetProgress()
{
    for (var i = 0; i < save.players.length; i++)
    {
        save.players[i].progress = 0;
        save.players[i].turnLength = 0;
        save.players[i].turnStarted = null;
        save.current = 0;
        updateProgressBar(save.players[i]);
    }
    stopTimer();
}

function tick()
{
    var now = new Date().getTime(),
        player = save.players[save.current],
        timePassed = (now - player.turnStarted),
        maxTime = config.time * 60;

    player.turnLength = timePassed;

    if (player.progress + timePassed > maxTime)
    {
        $('#pbar-' + save.current)
            .removeClass('active progress-bar-info progress-bar-striped')
            .addClass('progress-bar-danger')

    } else {
        updateProgressBar(save.players[save.current]);
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
