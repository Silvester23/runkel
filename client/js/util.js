// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();


if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

var deleteIndex = function (arr, index) {
    for (var i = index, len = arr.length - 1; i < len; i++)
        arr[i] = arr[i + 1];

    arr.length = len;
    return arr;
};


var getOffset = function (elem) {
    // From http://www.quirksmode.org/js/findpos.html
    var curleft = curtop = 0;
    if (elem.offsetParent) {
        do {
            curleft += elem.offsetLeft;
            curtop += elem.offsetTop;
        } while (elem = elem.offsetParent);
    }
    return [curleft, curtop];
};

var getTiles = function (coords) {
    tileX = Math.floor(coords[0] / _TILESIZE);
    tileY = Math.floor(coords[1] / _TILESIZE);
    return [tileX, tileY];
};