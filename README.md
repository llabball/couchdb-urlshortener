## CouchDB url shortener

This couchapp ([CouchDB design doc](http://docs.couchdb.org/en/latest/api/design.html)) is an API for url shortening.

The couchapp provides mainly two services on the API endpoint `/url`

1. create a short URL (~20 characters) that points to the longer URL
2. redirect/forward every request of the short URL to the longer URL

You may want to read the full [story](http://blog.lbl.io/post/url-shortening-with-couchdb). Finally you can read the commit/tag history to review the implementation details.

## installation

You will need a CouchDB installed/hosted and one of the upload tools [couchapp](https://github.com/couchapp/couchapp) or [erica](https://github.com/benoitc/erica)

Clone the repo and enter the directory.

```sh
$ couchapp push http://admin:password@couchdbdomain:port/databasename
```
Upload the couchapp. Alternatively upload targets can be defined in the `.couchapprc` file.

The repo contains a test shorturl doc which will uploaded automatically with the couchapp. To test the installation request `http://couchdbdomain:port/databasename/_design/urlshortener/_rewrite/url/test-url` - it should forward you to the blog post.

Because thats a huuuge URI you may also want to enable a vhost in the local.ini.

```ini
//subdomain without endpoint path
[vhosts]
sub.domain.tld=databasename/_design/urlshortener/_rewrite/url

//subdomain with endpoint path
[vhosts]
sub.domain.tld=databasename/_design/urlshortener/_rewrite
```
Also, you can change the API endpoint paths in the `rewrites.json`

## get in touch

Feel free to open issues, comment code lines ... it's a maintained thing
I am [llabball](https://twitter.com/llabball) in twitter.