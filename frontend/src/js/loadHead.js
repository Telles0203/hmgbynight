const rawPage = location.pathname.replace('/', '') || 'home';
const page = rawPage.charAt(0).toUpperCase() + rawPage.slice(1);

fetch('/src/config/head.json')
  .then(res => res.json())
  .then(config => {
    document.documentElement.lang = config.lang;

    const charset = document.createElement('meta');
    charset.setAttribute('charset', config.charset);
    document.head.appendChild(charset);

    config.meta.forEach(m => {
      const meta = document.createElement('meta');
      Object.entries(m).forEach(([k, v]) => meta.setAttribute(k, v));
      document.head.appendChild(meta);
    });

    const title = document.createElement('title');
    title.textContent = config.title.replace('{page}', page);
    document.head.appendChild(title);

    config.links.forEach(l => {
      const link = document.createElement('link');
      Object.entries(l).forEach(([k, v]) => link.setAttribute(k, v));
      document.head.appendChild(link);
    });

    config.scripts.forEach(s => {
      const script = document.createElement('script');
      Object.entries(s).forEach(([k, v]) => script.setAttribute(k, v));
      document.head.appendChild(script);
    });
  });
