fetch('/src/components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;


    const currentRoute = location.pathname.replace('/', '') || 'home';

    document.querySelectorAll('#navbar a.nav-link').forEach(link => {
      const onclick = link.getAttribute('onclick');
      if (onclick && onclick.includes(`loadPage('${currentRoute}'`)) {
        link.closest('li').style.display = 'none';
      }
    });
  });
