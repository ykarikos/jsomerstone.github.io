/**
 * Created by joona on 11/03/14.
 */
function SpeedReadUi(reader, contentElementSelector)
{
    this.reader = reader;
    this.outputElement =jQuery('<pre id="reader-output" class="output lead col-lg-12">&nbsp;</pre>');

    var container = jQuery('<div id="reader-container" class="hidden"></div>'),
        showBtn = jQuery('<button id="readerBtn" data-toggle="tooltip" data-placement="top" title="Press here to start speed-reading" class="btn btn-info glyphicon glyphicon-forward pull-right"></button>'),
        playBtn = jQuery('<button id="startBtn" class="btn btn-primary btn-lg glyphicon glyphicon-play" data-toggle="button">'),
        plusBtn = jQuery('<button id="plusWpm" type="button" class="btn btn-default glyphicon glyphicon-plus"></button>'),
        minusBtn = jQuery('<button id="minusWpm" type="button" class="btn btn-default glyphicon glyphicon-minus"></button>'),
        self = this;


    this.show = function()
    {
        container.toggleClass('hidden');
        return this;
    }

    /**
     *
     * @returns {SpeedRead}
     */
    this.getReader = function()
    {
        return this.reader;
    }

    function injectUi()
    {
        container.html([
            self.outputElement,
            playBtn,
            plusBtn,
            minusBtn
        ]);

        jQuery(contentElementSelector).before(container);
        jQuery(contentElementSelector).before(showBtn);
        return this;
    }

    function initListeners()
    {
        self.reader.on('play pause', self.onTogglePlay);
        self.reader.on('type', function(){
             console.log('type');
            console.log(self.outputElement.html());
        });
    }

    function initHandlers()
    {
        playBtn.click(function(){ self.reader.togglePlay(); });
        showBtn.click(function(){ self.show() });

    }

    this.onTogglePlay = function(reader)
    {
        playBtn.toggleClass('glyphicon-play glyphicon-pause');
    }

    this.reader.bind(self.outputElement.selector).readElement(contentElementSelector);
    initListeners();
    initHandlers();
    injectUi();
}