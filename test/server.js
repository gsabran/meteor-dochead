let onSsrContext = function(fn) {
  SsrContext.addToHead = fn;
  let stop = function() {
    SsrContext.addToHead = null;
  };
  return {
    stop: stop
  };
};

Tinytest.addAsync('Server - setTitle and getTitle', function(test, done) {
  const id = Random.id();
  let handle = onSsrContext(function(html) {
    const title = `<title>${id}</title>`;
    test.equal(html, title);
    test.equal(DocHead.getTitle(), id);
    handle.stop();
    done();
  });
  DocHead.setTitle(id);
});

Tinytest.addAsync('Server - addMeta and setMeta', function(test, done) {
  const metaInfo = {name: "description", content: "hello content"};
  let handle = onSsrContext(function(html) {
    const metaTag = `<meta name="${metaInfo.name}" content="${metaInfo.content}" dochead="1"/>`;
    test.equal(html, metaTag);
    test.equal(DocHead.getMeta(metaInfo.name), metaInfo);
    handle.stop();
    done();
  });
  DocHead.addMeta(metaInfo);
});

Tinytest.addAsync('Server - addLdJsonScript', function(test, done) {
  const snippet = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    url: 'http://www.example.com',
    logo: 'http://www.example.com/images/logo.png'
  };
  let handle = onSsrContext(function(html) {
    const scriptTag = '<script type="application/ld+json" dochead="1">' +
      '{' +
        '"@context":"http://schema.org",' +
        '"@type":"Organization",' +
        '"url":"http://www.example.com",' +
        '"logo":"http://www.example.com/images/logo.png"}' +
    '</script>';
    test.equal(html, scriptTag);
    handle.stop();
    done();
  });
  DocHead.addLdJsonScript(snippet);
});

Tinytest.addAsync('Server - setDefaultTitle and getTitle', function(test, done) {
  const defaultId = Random.id();
  let handle = onSsrContext(function(html) {
    const title = `<title>${defaultId}</title>`;
    test.equal(html, title);
    test.equal(DocHead.getTitle(), defaultId);
    handle.stop();
    done();
  });
  DocHead.setDefaultTitle(defaultId);
  DocHead.addDefaultAttributes();
});

Tinytest.addAsync('Server - setDefaultTitle, setTitle and getTitle', function(test, done) {
  const defaultId = Random.id();
  const id = Random.id();
  let handle = onSsrContext(function(html) {
    const title = `<title>${id}</title>`;
    test.equal(html, title);
    test.equal(DocHead.getTitle(), id);
    handle.stop();
    done();
  });
  DocHead.setDefaultTitle(defaultId);
  DocHead.setTitle(id);
  DocHead.addDefaultAttributes();
});

Tinytest.addAsync('Server - setDefaultTitle and resetDefaultAttributes', function(test, done) {
  const defaultId = Random.id();
  let handle = onSsrContext(function(html) {
    const title = '';
    test.equal(html, title);
    test.equal(DocHead.getTitle(), null);
    handle.stop();
    done();
  });
  DocHead.setDefaultTitle(defaultId);
  DocHead.resetDefaultAttributes();
  DocHead.addDefaultAttributes();
});
