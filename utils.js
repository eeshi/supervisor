var mergeAttr = function(to, from) {
  
  for (var attr in from) {
    if(from.hasOwnProperty(attr)) {
      to[attr] = from[attr];
    }
  }

  return to;

}

exports.mergeAttr = mergeAttr;