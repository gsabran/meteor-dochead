var FlowRouter = null;
if (Package['kadira:flow-router-ssr']) {
  FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;
}

if (Meteor.isClient) {
  var titleDependency = new Tracker.Dependency();
}

DocHead = {
  setTitle(title, {isDefault=false}={}) {
    if (isDefault && this._currentAttributes.title) { return; }
    if (Meteor.isClient) {
      titleDependency.changed();
      document.title = title;
    } else {
      this.currentTitle = title;
      const titleHtml = `<title>${title}</title>`;
      this._addToHead(titleHtml);
    }
  },
  _currentAttributes: {title: null, meta: {}, link: {}},
  resetAttributeCache: function() {
    this._currentAttributes = {title: null, meta: {}, link: {}};
  },
  addMeta(info, {isDefault=false}={}) {
    if (!isDefault || !(this._getTagKey(info) in this._currentAttributes.meta)) this._addTag(info, 'meta');
  },
  addLink(info, {isDefault=false}={}) {
    if (!isDefault || !(this._getTagKey(info) in this._currentAttributes.link)) this._addTag(info, 'link');
  },
  getTitle() {
    if (Meteor.isClient) {
      titleDependency.depend();
      return document.title;
    }
    return this._currentAttributes.title;
  },
  getMeta(key) {
    return this._currentAttributes.meta[key];
  },
  getLink(key) {
    return this._currentAttributes.link[key];
  },
  addLdJsonScript(jsonObj) {
    const strObj = JSON.stringify(jsonObj);
    this._addLdJsonScript(strObj);
  },
  loadScript(url, options, callback) {
    if (Meteor.isClient) {
      npmLoadScript(url, options, callback);
    }
  },
  _getTagKey(info) {
    return info.name || info.property;
  },
  _addTag(info, tag) {
    const meta = this._buildTag(info, tag);
    if (Meteor.isClient) {
      document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', meta);
    } else {
      this._addToHead(meta);
    }
    const key = this._getTagKey(info);
    if (key) {
      this._currentAttributes[tag][key] = info.content || info.href || true;
    }
  },
  _addToHead(html) {
    // only work there is kadira:flow-router-ssr
    if (!FlowRouter) {
      return;
    }
    let ssrContext = FlowRouter.ssrContext.get();
    if (ssrContext) {
      ssrContext.addToHead(html);
    }
  },
  _buildTag(metaInfo, type) {
    let props = "";
    for (let key in metaInfo) {
      props += `${key}="${metaInfo[key]}" `;
    }
    props += 'dochead="1"';
    var meta = `<${type} ${props}/>`;
    return meta;
  },
  _addLdJsonScript(stringifiedObject) {
    const scriptTag = `<script type="application/ld+json" dochead="1">${stringifiedObject}</script>`;
    if (Meteor.isClient) {
      document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', scriptTag);
    } else {
      this._addToHead(scriptTag);
    }
  },
  removeDocHeadAddedTags() {
    if (Meteor.isClient) {
      const elements = document.querySelectorAll('[dochead="1"]');
      // We use for-of here to loop only over iterable objects
      for (let element of elements) {
        element.parentNode.removeChild(element);
      }
    }
  }
};
