const page = require('webpage').create();
const date = new Date();
const foldername = date.toISOString().split('T')[0];

page.viewportSize = { width: 1920, height: 1080 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
page.open('http://www.vg.no/');

page.onConsoleMessage = function(msg) {
  console.log(msg);
}

page.onLoadFinished = function(status) {
  if (status !== 'success') {
    console.log('Not able to load vg.no, exiting...');
    page.exit();
  }
  const plusArticles = page.evaluate(function() {
    const plusArticles = [];
    const articles = document.getElementsByClassName('article-content');
    for (i = 0; i < articles.length; i++) {
      const links = articles[i].getElementsByTagName('a');
      for (j = 0; j < links.length; j++) {
        if (links[j].href.match(/pluss\.vg\.no/)) {
          const imgs = articles[i].getElementsByTagName('img');
          for (k = 0; k < imgs.length; k++) {
            if (imgs[k].hasAttribute('data-src')) {
              imgs[k].src = imgs[k].getAttribute('data-src');
            }
          }
          plusArticles.push({
            article: articles[i],
            position: articles[i].getBoundingClientRect(),
          });
          break;
        }
      }
    }
    return plusArticles;
  });

  setTimeout(function() {
    for (l = 0; l < plusArticles.length; l++) {
      page.clipRect = {
        top: plusArticles[l].position.top,
        left: plusArticles[l].position.left,
        width: plusArticles[l].position.width,
        height: plusArticles[l].position.height,
      };
      page.render('images/' + foldername + '/vgpluss' + (l + 1) + '.jpg');
    }
  }, 10000);
  page.exit();
};
