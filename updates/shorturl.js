function(doc, req) {
  var q = req.query
    , doc = doc || {}

  doc.edited_at = new Date().toISOString()
  
  // /url/create
  if (q.path === 'create') {
    doc['_id'] = (q.title) ? q.title : randomHash() //add opt. ?title= or random hash
    doc['url'] = q.url                              //add required ?url=
    doc['created_at'] = new Date().toISOString()
    doc['type'] = 'shorturl'

    //build resolving short url path responsive to any
    //possible vhost/path configuration
    var path = req.requested_path.join().match(/.*(?=,create)/)
    path = (path) ? '/' + path.toString().replace(/,/g,'/') : ''
    path = 'http://' + req.headers.Host + path + '/' + doc._id

    return [doc, {"json": {"shorturl": path}}] //create doc and respond shorturl
  } 
  // /url
  else {
    if (doc._id) {
      if (req.method === 'GET') {
        return [null, { //no write, redirect to longurl
          code: 302,
          headers: {'Location': (doc.url.match(/^http/)) ? doc.url : 'http://' + doc.url}
        }]
      } 
      if (req.method === 'DELETE') {
        doc._deleted = true
        return [doc, {"json": {"msg": "url deleted"}}] //delete doc and respond success
      }
      
      doc.url = q.url
      return [doc, {"json": {"msg": "changes accepted"}}] //edit doc and respond success
    } else {
      return [null, { //no write, 404
        code: 404,
        headers: {'Content-Type': 'text/html'},
        body: 'URL not found'
      }]
    }
  }
    
}

//creates hashes of different lengths containing
//lower and upper case chars and numbers
function randomHash(len) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    , len = len || 4
    , hash = '', clen, i;

  for(i=0, clen=chars.length; i<len; i++){
     hash += chars.substr(0|Math.random() * clen, 1);
  }

  return hash;
}