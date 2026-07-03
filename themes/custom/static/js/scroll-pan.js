(function () {
  var bg = document.getElementById('bg');
  if (!bg) return;
  function pan() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? (window.scrollY / max) : 0;
    bg.style.backgroundPosition = 'center ' + (p * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', pan, { passive: true });
  window.addEventListener('resize', pan);
  pan();
})();
