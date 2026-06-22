document.addEventListener('DOMContentLoaded', function ()
{
  /* 清除 Turbo 导航残留的淡出状态 */
  document.body.classList.remove('page-leaving');

  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  var sidebarNav = sidebar.querySelector('.sidebar-nav');
  var indicator = sidebarNav && sidebarNav.querySelector('.sidebar-nav-indicator');

  function positionIndicator(animated)
  {
    var activeItem = sidebarNav && sidebarNav.querySelector('.sidebar-nav-item.active');
    if (!indicator || !activeItem) return;

    var linkRect = activeItem.getBoundingClientRect();
    var navRect = sidebarNav.getBoundingClientRect();

    if (!animated) indicator.style.transition = 'none';
    else indicator.style.transition = 'top 0.3s ease, height 0.3s ease';

    indicator.style.top = (linkRect.top - navRect.top) + 'px';
    indicator.style.height = linkRect.height + 'px';
  }

  /* sidebar 内任何链接统一处理 */
  sidebar.addEventListener('click', function(e)
  {
    var link = e.target.closest('a');
    if (!link) return;

    var isNavLink = sidebarNav && sidebarNav.contains(link);
    var isNavActive = isNavLink && link.classList.contains('active');

    if (isNavActive) return;

    if (isNavLink && !isNavActive)
    {
      e.preventDefault();

      var activeItem = sidebarNav.querySelector('.sidebar-nav-item.active');
      if (activeItem)
      {
        activeItem.classList.remove('active');
        activeItem.classList.add('leaving');
      }
      link.classList.add('active');

      document.body.classList.add('page-leaving');

      var linkRect = link.getBoundingClientRect();
      var navRect = sidebarNav.getBoundingClientRect();
      indicator.style.transition = 'top 0.3s ease, height 0.3s ease';
      indicator.style.top = (linkRect.top - navRect.top) + 'px';
      indicator.style.height = linkRect.height + 'px';

      setTimeout(function()
      {
        if (sidebar.classList.contains('expanded'))
        {
          sessionStorage.setItem('sidebarExpanded', '1');
        }
        window.location.href = link.href;
      }, 300);
    }
    else if (sidebar.classList.contains('expanded'))
    {
      sessionStorage.setItem('sidebarExpanded', '1');
    }
  });

  /* 定位指示器 → 恢复展开状态 */
  if (sessionStorage.getItem('sidebarExpanded') === '1')
  {
    sidebar.classList.add('instant');
    sidebar.classList.add('expanded');
    sidebar.offsetHeight;
    sessionStorage.removeItem('sidebarExpanded');
    requestAnimationFrame(function()
    {
      requestAnimationFrame(function()
      {
        positionIndicator(false);
        sidebar.classList.remove('instant');
      });
    });
  }
  else
  {
    function checkFirstMove(e)
    {
      var loader = document.getElementById('loader');
      if (loader && loader.style.display !== 'none' &&
          !loader.classList.contains('fade-out')) return;

      var rect = sidebar.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.left + 256 &&
          e.clientY >= rect.top && e.clientY <= rect.bottom)
      {
        sidebar.classList.add('instant');
        sidebar.classList.add('expanded');
        sidebar.offsetHeight;
        positionIndicator(false);
        sidebar.classList.remove('instant');
      }
      document.removeEventListener('mousemove', checkFirstMove);
    }
    document.addEventListener('mousemove', checkFirstMove);

    requestAnimationFrame(function()
    {
      positionIndicator(false);
    });
  }

  sidebar.addEventListener('mouseenter', function()
  {
    sidebar.classList.add('expanded');
  });

  sidebar.addEventListener('mouseleave', function()
  {
    sidebar.classList.remove('expanded');
  });
});

