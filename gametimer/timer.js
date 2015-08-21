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
    if ('config' in localStorage)
        config = localStorage.getObject('config');

    if ('save' in localStorage)
        save = localStorage.getObject('save');
}

$(document).ready(function(){

    loadSettings();
    $('#playerCount').val(config.playerCount);
    $('#time').val(config.time);

   $('#update-btn').click(updateSettings);
   $('#playerCount').blur(updateSettings).keyup(updateSettings);
   $('#time').blur(updateSettings).keyup(updateSettings);
   $('#stop-btn').click(pauseTimer);
   $('#game-btn').click(startKeyPressed);
   $('#reset-btn').click(resetProgress);
   $('#add-btn').click(addPlayer);
    updateSettings();
});


function nameChanged()
{
    var playerNumber = $(this).attr('player-n')
    save.players[playerNumber].name = $(this).val()+'';
    saveGame();
    console.log(save);
}

function drawProgressBar(player)
{
    return '<div class="row" id="row-' +player.n+ '">'
            + '<div class="form-group col-xs-3">'
                + '<input id="name-' + player.n + '" value="' + player.name +'" player-n="' + player.n + '" type="text" class="player-name" >'
            + '</div> <div class="col-xs-7 bbar-container"> <div class="progress">'
                + '<div id="pbar-'+ player.n +'" class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" >'
                    + '<span id="progress-'+ player.n +'"></span>'
                + '</div></div>'
            + '</div>'
            + '<div class="col-xs-1">'
                + '<button class="btn btn-sm rm-btn" href="#" title="Remove player" player-n="' + player.n + '"><i class="fa fa-trash-o"></i></button>'
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
    bindDynamicHandlers();
}

function bindDynamicHandlers()
{
    $('input.player-name').blur(nameChanged);
    $('button.rm-btn').click(function(){
        removePlayer($(this).attr('player-n'));
    });
}

function removePlayer(index)
{
    var player = save.players[index];
    console.log('Removing ', player.name);
    save.players.splice(index, 1);
    config.playerCount = save.players.length;
    for ( var n = index; n < save.players.length; n++)
    {
        console.log(save.players[n]);
        save.players[n].n = n;
    }
    saveGame();
    drawGameArea();
}

function updateSettings()
{
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

function addPlayer()
{
    console.log('Adding player');
    config.playerCount++;
    updateSettings();
}

function startKeyPressed()
{
    if ( ! game.ongoing)
    {
        hideSettings();
        startTimer();
    } else {

        switchTimer();
    }
}

function startTimer()
{
    console.log('starting timer');
    game.ongoing = true;
    $('#game-btn').html('<i class="fa fa-step-forward"></i> Next');
    $('#pbar-' + save.current).removeClass('progress-bar-warning').addClass('progress-bar-info active');
    save.players[save.current].turnStarted = new Date().getTime();
    save.players[save.current].turnLength = 0;
    game.interval = setInterval(tick, 1000);
}

function tick()
{
    var now = new Date().getTime(),
        player = save.players[save.current],
        timePassed = (now - player.turnStarted),
        totalTime = 60*config.time,
        timeSpent = Math.floor(player.progress + player.turnLength/1000),
        timeRemaining = totalTime - timeSpent;

    player.turnLength = timePassed;
    updateProgressBar(player);

    if (timeRemaining <= 0)
    {
        switchTimer();
    }
}

function updateProgressBar(player)
{
    var totalTime = 60*config.time,
        timeSpent = Math.floor(player.progress + player.turnLength/1000),
        timeRemaining = totalTime - timeSpent,
        percent = Math.floor(timeSpent / totalTime * 100),
        minutes = Math.floor(timeRemaining/60),
        seconds = (timeRemaining % 60) < 10 ? '0' + (timeRemaining % 60) : (timeRemaining % 60)
        ;
    $('#name-' + player.n).val(player.name);
    if (timeRemaining <= 0)
    {
        $('#pbar-' + player.n)
            .width('100%').attr('aria-valuenow', 100)
            .removeClass('active progress-bar-info progress-bar-striped')
            .addClass('progress-bar-danger');
        $('#progress-' + player.n).html('-');
    } else {
        $('#pbar-' + player.n)
            .width(percent + '%').attr('aria-valuenow', percent);
        $('#progress-' + player.n).html(minutes+':'+seconds);
    }
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

    saveGame();
}

function updateProgress()
{
    save.players[save.current].progress += (save.players[save.current].turnLength / 1000);
    save.players[save.current].turnLength = 0;
    localStorage.setObject("save", save);
}

function pauseTimer()
{
    game.ongoing = false;
    clearInterval(game.interval);
    updateProgress();
    $('#pbar-' + save.current).removeClass('active')
    $('#game-btn').html('<i class="fa fa-play"></i> Start');
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
    pauseTimer();
    save.current = 0;
    save.next = 1;
    saveGame();
    showSettings();
}

function showSettings()
{
    $('#settings-row').collapse('show');
    $('button.rm-btn').show();
}

function hideSettings()
{
    $('#settings-row').collapse('hide');
    $('button.rm-btn').hide();
}

function saveGame()
{
    localStorage.setObject('save', save);
    localStorage.setObject('config', config);
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    console.log(value);
    return value && JSON.parse(value);
}
