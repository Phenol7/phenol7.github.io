document.addEventListener('DOMContentLoaded', function ()
{
  /* 清除 Turbo 导航残留的淡出状态 */
  document.body.classList.remove('page-leaving');

  /* Sidebar 展开/收起 + 滑动指示器 */
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  var sidebarNav = sidebar.querySelector('.sidebar-nav');
  var indicator = sidebarNav && sidebarNav.querySelector('.sidebar-nav-indicator');

  /* 将指示器定位到当前 active 标签 */
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

  /* 点击 sidebar 内任何链接：统一处理 */
  sidebar.addEventListener('click', function(e)
  {
    var link = e.target.closest('a');
    if (!link) return;

    var isNavLink = sidebarNav && sidebarNav.contains(link);
    var isNavActive = isNavLink && link.classList.contains('active');

    /* 点击当前页面标签：什么也不做 */
    if (isNavActive) return;

    /* 点击非 active 的导航标签：滑动指示器 + 灰色底收起 + 延迟跳转 */
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

      /* 内容淡出（0.15s）与指示器滑动同步 */
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
    /* avatar 或 active 标签：正常跳转（即时，不存在延迟间隙） */
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
      /* 加载动画播放期间不展开 sidebar */
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

