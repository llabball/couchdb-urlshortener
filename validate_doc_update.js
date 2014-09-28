function (newDoc, oldDoc, userCtx, secObj) {
	var v = require('vendor/validateDocUpdateUtils').init(newDoc, oldDoc, userCtx, secObj)

	//delete a shorturl
	if (newDoc._deleted === true) {
		if (!userCtx.name) 
			v.unauthorized('please sign in')
		if (!v.isRole('writer') && !v.isAdmin())
			v.unauthorized('permission denied')
		else
			return
	}
	
	// example doc schema
	// {
	// 	"_id": "test-url",
	// 	"edited_at": "2014-02-02T16:55:26.158Z",
	// 	"url": "http://blog.lbl.io/post/analytics-and-url-shortener-with-couchdb",
	// 	"created_at": "2014-02-02T16:55:26.158Z",
	// 	"type": "shorturl"
	// }

	//schema validations
	v.matches('_id', /^[A-Za-z0-9_~\.\-]+$/, 'doc._id must be url safe')

	v.require('type')
  v.matches('type', /^shorturl$/, 'doc.type must be shorturl')

  v.require('created_at')
  v.dateFormat('created_at')
  v.unchanged('created_at')
  if (!oldDoc)
  	v.dateAfter(newDoc.created_at, new Date().toISOString(), 'fail: created_at > now')

  v.require('edited_at')
  v.dateFormat('edited_at')
  v.dateAfter(newDoc.created_at, newDoc.edited_at, 'fail: edited_at < created_at')
  v.dateUpdate('edited_at')

  v.require('url')
  v.urlFormat('url')
  v.notunchanged('url')
  
}