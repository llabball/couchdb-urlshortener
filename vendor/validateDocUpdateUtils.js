exports.init = function(newDoc, oldDoc, userCtx, secObj) {
  var v = {};
  
  v.forbidden = function(message) {    
    throw({forbidden : message});
  };

  v.unauthorized = function(message) {
    throw({unauthorized : message});
  };

  v.assert = function(should, message) {
    if (!should) v.forbidden(message);
  }
  
  v.isAdmin = function() {
    return userCtx.roles.indexOf('_admin') != -1
  };
  
  v.isRole = function(role) {
    return userCtx.roles.indexOf(role) != -1
  };

  v.require = function() {
    for (var i=0; i < arguments.length; i++) {
      var field = arguments[i];
      message = "The '"+field+"' field is required.";
      if (typeof newDoc[field] === "undefined") v.forbidden(message);
    };
  };

  v.unchanged = function(field) {
    if (oldDoc && oldDoc[field] !== newDoc[field]) 
      v.forbidden("You may not change the '"+field+"' field.");
  };

  v.notunchanged = function(field) {
    if (oldDoc && oldDoc[field] === newDoc[field]) 
      v.forbidden("You must change the '"+field+"' field.");
  };

  v.matches = function(field, regex, message) {
    if (!newDoc[field].match(regex)) {
      message = message || "Format of '"+field+"' field is invalid.";
      v.forbidden(message);    
    }
  };

  v.urlFormat = function(url, message) {
    var pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
                             "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+ // domain name
                             "((\\d{1,3}\\.){3}\\d{1,3}))"+ // OR ip (v4) address
                             "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+ // port and path
                             "(\\?[;&a-z\\d%_.~+=-]*)?"+ // query string
                             "(\\#[-a-z\\d_]*)?$","i"); // fragment locater
    message = message || "Sorry, '"+newDoc.url+"' is not a valid url. Try: http://domain.tld/path/to/";
    if (!pattern.test(newDoc.url)) {
      v.forbidden(message)
    }
  };

  // this ensures that the date will be UTC, parseable, and collate correctly
  v.dateFormat = function(field) {
    message = "Sorry, '"+field+"' is not a valid date format. Try: 2010-02-24T17:00:03.432Z";
    v.matches(field, /\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d*)?Z/, message);
  };

  v.dateAfter = function(date, dateEqualOrAfter, message) {
    datetm = new Date(date).valueOf()
    dateEqualOrAftertm = new Date(dateEqualOrAfter).valueOf()
    if (isNaN(datetm) || isNaN(dateEqualOrAftertm) || datetm > dateEqualOrAftertm) {
      message = message || dateEqualOrAfter+"' must be equal or after "+date;
      v.forbidden(message); 
    }
  };

  v.dateUpdate = function(datefield, message) {
    if (oldDoc) 
      this.dateAfter(oldDoc[datefield], newDoc[datefield], message)
  };
  
  return v;
};