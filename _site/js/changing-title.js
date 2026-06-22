(function() 
{
    'use strict';

    var body = document.querySelector('[changing-title]');
    if (!body) return;

    var oriTitle = document.title;
    var titleTexts = [
        '我在这里等你 (つ≧▽≦)つ',
        '(≧∇≦) 不要走！'
    ];
    var timer;

    document.addEventListener('visibilitychange', function()
    {
        clearTimeout(timer);

        if (document.hidden)
        {
            document.title = titleTexts[Math.floor(Math.random() * titleTexts.length)];
        } else
        {
            document.title = '(*´∀ ˋ*) 欢迎回来！';
            timer = setTimeout(function()
            {
                document.title = oriTitle;
            }, 800);
        }
    });
})();