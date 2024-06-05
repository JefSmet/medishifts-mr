String.prototype.padLeft = function (length, character) {
  return new Array(length - this.length + 1).join(character || ' ') + this;
};
