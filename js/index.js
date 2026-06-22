document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function ()
{
  /* back to top */
  var backBtn = document.getElementById('back-to-top');
  if (backBtn)
  {
    window.addEventListener('scroll', function()
    {
      backBtn.classList.toggle('visible', window.scrollY > 300);
    });

    backBtn.addEventListener('click', function()
    {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* bgm */
  var musicBtn = document.getElementById('music-toggle');
  var musicInfo = document.getElementById('musicInfo');
  var musicWrapper = document.getElementById('musicWrapper');
  if (musicBtn)
  {
    var audio = new Audio('/resources/Melodiniq.mp3');
    audio.loop = true;
    var particleTimer = null;

    musicBtn.addEventListener('click', function()
    {
      if (audio.paused)
      {
        audio.play();
        musicBtn.classList.add('playing');
        if (musicInfo) musicInfo.classList.add('visible');
        startParticles();
      } else
      {
        audio.pause();
        audio.currentTime = 0;
        musicBtn.classList.remove('playing');
        if (musicInfo) musicInfo.classList.remove('visible');
        stopParticles();
      }
    });

    if (musicWrapper && musicInfo)
    {
      musicWrapper.addEventListener('mouseenter', function()
      {
        if (!audio.paused) musicInfo.classList.add('visible');
      });

      musicWrapper.addEventListener('mouseleave', function()
      {
        musicInfo.classList.remove('visible');
      });
    }

    /* 🎵 particles */
    function createParticle()
    {
      var rect = musicWrapper.getBoundingClientRect();
      var particle = document.createElement('div');
      particle.className = 'music-particle';
      particle.textContent = '🎵';
      particle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
      particle.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
      particle.style.color = 'hsl(' + Math.floor(Math.random() * 360) + ', 80%, 50%)';
      particle.style.fontSize = (14 + Math.random() * 8) + 'px';
      particle.style.animationDuration = (1.5 + Math.random() * 1) + 's';
      document.body.appendChild(particle);
      setTimeout(function() { particle.remove(); }, 2500);
    }

    function scheduleParticle()
    {
      if (!musicBtn.classList.contains('playing')) return;
      createParticle();
      particleTimer = setTimeout(scheduleParticle, 500 + Math.random() * 1000);
    }

    function startParticles()
    {
      stopParticles();
      scheduleParticle();
    }

    function stopParticles()
    {
      if (particleTimer) { clearTimeout(particleTimer); particleTimer = null; }
    }
  }

  var sidebarLinks = document.querySelectorAll('.sidebar a, .sidebar-link');
  for (var i = 0; i < sidebarLinks.length; i++)
  {
    sidebarLinks[i].addEventListener('click', function()
    {
      var btn = document.getElementById('music-toggle');
      if (btn && btn.classList.contains('playing'))
      {
        btn.click();
      }
    });
  }
});
