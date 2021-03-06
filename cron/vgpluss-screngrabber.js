const page = require('webpage').create();

page.viewportSize = { width: 1920, height: 1080 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
page.open('http://www.vg.no/');

// page.onConsoleMessage = function(msg) {
//   console.log(msg);
// };

// page.onResourceRequested = function(requestData) {
//   console.info('Requesting', requestData.url);
// };

// page.onError = function(msg, trace) {
//   var msgStack = ['PAGE ERROR: ' + msg];
//   if (trace && trace.length) {
//     msgStack.push('TRACE:');
//     trace.forEach(function(t) {
//       msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
//     });
//   }
//   console.error(msgStack.join('\n'));
// };

// phantom.onError = function(msg, trace) {
//   var msgStack = ['PHANTOM ERROR: ' + msg];
//   if (trace && trace.length) {
//     msgStack.push('TRACE:');
//     trace.forEach(function(t) {
//       msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
//     });
//   }
//   console.log(msgStack.join('\n'));
// };

page.onLoadFinished = function(status) {
  if (status !== 'success') {
    console.log('Not able to load vg.no, exiting...');
    phantom.exit();
  }
  const plusArticles = page.evaluate(function() {
    const plusArticles = [];
    const date = new Date();
    const today = date.toISOString().split('T')[0];

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
          const qPos = links[j].href.indexOf('?');
          const link = links[j].href.substring(0, qPos != -1 ? qPos : links[j].href.length);
          const lastSlashPos = link.lastIndexOf('/');
          const plusId = link.substr(lastSlashPos + 1);
          plusArticles.push({
            id: plusId,
            article: articles[i],
            title: articles[i].innerText.trim().replace(/(?:\r\n|\r|\n)/g, ' '),
            link: link,
            date: today,
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
      page.render('images/' + plusArticles[l].date + '/' + plusArticles[l].id + '.jpg');
    }
    phantom.exit();
  }, 10000);
};
