const page = require('webpage').create();
const date = new Date();
const foldername = date.toISOString().split('T')[0];

page.viewportSize = { width: 1920, height: 1080 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
page.open('http://www.vg.no/');

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

  for (k = 0; k < plusArticles.length; k++) {
    page.clipRect = {
      top: plusArticles[k].position.top,
      left: plusArticles[k].position.left,
      width: plusArticles[k].position.width,
      height: plusArticles[k].position.height,
    };
    page.render('images/' + foldername + '/vgpluss' + (k + 1) + '.png');
  }
  page.exit();
};
