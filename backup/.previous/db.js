import * as Optr from "./core.js";

export * from "./core.js";

export var DBServer = Optr.Class.from(DBServer = (function() {
  class DBServer extends Optr.default {
    toPrimitive() {
      return this.detach();
    }

  };

  DBServer.classIndex = DBServer.store(DBServer);

  DBServer.prototype.uuid = Optr.UUID;

  DBServer.prototype.version = Optr.Number;

  return DBServer;

}).call(this));

DBServer.define("hello", {
  class: Optr.Number,
  value: -1.23
});
