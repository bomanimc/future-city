class TopCodesList {
  constructor(topcodes) {
    this.topcodes = this._processTopCodeJSON(topcodes);
  }

  setTopCodes(topcodes) {
    this.topcodes = this._processTopCodeJSON(topcodes);
  }

  getTopCodes() {
    return this.topcodes;
  }

  _processTopCodeJSON(topcodes) {
    return topcodes.map(
      topcode => new TopCode(topcode.code, topcode.x, topcode.y, topcode.radius),
    );
  }
}

class TopCode {
  constructor(code, x, y, radius) {
    this.code = code;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
