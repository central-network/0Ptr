var HTMLElement, Proxy;

export default Proxy = self.Proxy;

Proxy.HTMLElement = HTMLElement = class HTMLElement {
  constructor(name) {
    this.name = name;
    this.tagName = this.name.replace(/HTML|Element/g, "").toUpperCase();
  }

};
