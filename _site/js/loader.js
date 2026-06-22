document.addEventListener('DOMContentLoaded', function ()
{
  var loader = document.getElementById('loader');
  if (!loader) return;

  var visited = sessionStorage.getItem('visited');
  if (visited)
  {
    var isReload = false;
    try { var nav = performance.getEntriesByType('navigation')[0]; if (nav) isReload = (nav.type === 'reload'); } catch(e) {}
    if (!isReload) return;
  }

  sessionStorage.setItem('visited', '1');
  loader.style.removeProperty('display');
  loader.classList.add('active');

  var hexPath = loader.querySelector('.hexagon-path');
  if (!hexPath) return;

  var innerPaths = loader.querySelectorAll('.hexagon-inner');

  requestAnimationFrame(function()
  {
    hexPath.style.animation = 'drawHex 0.5s ease-in-out forwards';

    setTimeout(function()
    {
      for (var i = 0; i < innerPaths.length; i++)
      {
        innerPaths[i].style.opacity = '1';
        innerPaths[i].style.animation = 'drawInner 0.5s ease-in-out forwards';
      }

      setTimeout(function()
      {
        loader.classList.add('fade-out');
      }, 750);
    }, 500);
  });
});
