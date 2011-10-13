(function() {
  var fs, http, itemRespond, memory_delta_max, memory_limit, memory_usage, memory_usage_max, serveFile, server, url;
  http = require('http');
  url = require('url');
  fs = require('fs');
  /* Faking it! */
  memory_limit = 524288;
  memory_usage = Math.floor(Math.random() * memory_limit);
  memory_usage_max = memory_usage;
  memory_delta_max = 50000;
  itemRespond = function(item, response) {
    var delta, json;
    switch (item) {
      case 'memory.usage_in_bytes':
        delta = Math.floor(Math.random() * memory_delta_max);
        if (Math.random() < 0.5) {
          delta *= -1;
        }
        memory_usage += delta;
        if (memory_usage > memory_limit) {
          memory_usage = memory_limit;
        } else if (memory_usage < 0) {
          memory_usage = 0;
        }
        if (memory_usage > memory_usage_max) {
          memory_usage_max = memory_usage;
        }
        json = "" + memory_usage;
        response.writeHead(200, {
          'Content-length': json.length,
          'Content-type': 'text/plain'
        });
        response.write(json);
        return response.end();
      case 'memory.limit_in_bytes':
        json = "" + memory_limit;
        response.writeHead(200, {
          'Content-length': json.length,
          'Content-type': 'text/plain'
        });
        response.write(json);
        return response.end();
      case 'memory.max_usage_in_bytes':
        json = "" + memory_usage_max;
        response.writeHead(200, {
          'Content-length': json.length,
          'Content-type': 'text/plain'
        });
        response.write(json);
        return response.end();
      default:
        response.writeHead(404);
        return response.end;
    }
  };
  /*
    console.log "item: #{item}"
    options =
      host: 'cgroup-mmcgrath3.dev.rhcloud.com'
      port: 80
      path: "/read.php?item=#{item}"
      
    http.get options, (res) ->
      console.log "Status code: #{res.statusCode}"
      if res.statusCode == 200
        body = ''
        res.on 'data', (chunk) ->
          body += chunk
          console.log "body: #{body}"
        res.on 'end', ->
          console.log "end of res"
          response.writeHead 200, 'Content-length' : body.length, 'Content-type' : 'application/json'
          response.write body
          response.end()
      else
        response.writeHead res.statusCode
        response.end ''
  */
  serveFile = function(file, response, contentType) {
    var f;
    if (contentType == null) {
      contentType = 'text/html';
    }
    console.log("Serving file " + file);
    try {
      f = fs.readFileSync(file, 'utf-8');
    } catch (err) {
      console.log("Error reading file " + err);
      f = '';
    }
    console.log("File length " + f.length);
    response.writeHead(200, {
      'Content-length': f.length,
      'Content-type': contentType
    });
    return response.end(f);
  };
  server = http.createServer(function(request, response) {
    var ext, file, item, mime, parsed, path, query;
    parsed = url.parse(request.url, true);
    path = parsed.pathname;
    console.log("path: " + path);
    query = parsed.query;
    switch (path) {
      case '/item':
        item = query.item;
        if (item) {
          console.log('Item found');
          return itemRespond(item, response);
        } else {
          console.log('No item found');
          response.writeHead(200);
          return response.end('');
        }
        break;
      case '/index':
        return serveFile('index.html', response);
      case '/demo':
        return serveFile('demo.html', response);
      default:
        file = path.slice(1);
        ext = path.split('.').pop();
        mime = (function() {
          switch (ext) {
            case 'css':
              return 'text/css';
            case 'js':
              return 'text/javascript';
            case 'png':
              return 'image/png';
            case 'jpg':
              return 'image/jpeg';
            case 'html':
              return 'text/html';
            default:
              return 'text/plain';
          }
        })();
        return serveFile(file, response, mime);
    }
  });
  server.listen(1337);
}).call(this);
