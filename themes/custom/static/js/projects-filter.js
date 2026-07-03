(function () {
  var btns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#project-grid .pcard');
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) {
        var tags = (c.getAttribute('data-tags') || '').split(' ');
        c.style.display = (f === 'all' || tags.indexOf(f) !== -1) ? '' : 'none';
      });
    });
  });
})();
