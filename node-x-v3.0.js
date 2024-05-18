


/*

//node-x:d

launch nodejs scripts easily

27-11-22
09-05-24  - v3.0  make ready for npm


*/

        var dirs    = [
        
              '/work/selfedits.dev.internetservicesltd.co.uk/www/code/nodejs/',
              '/work/selfedits.dev.internetservicesltd.co.uk/www/servers/',
              '/work/tmp/node-x/',
              
        ];
        
        var aliases   = {
        };
        
        var config    = {
              launch    : {
                    js        : true,
                    mjs       : true,
                    cjs       : true,
                    
                    bat       : false,
                    exe       : false,
                    
                    sh        : false
              }
        };
        
        
        var fsp         = require('fs').promises;
        var path        = require('path');
        var cp          = require('child_process');
        
        
        var program     = {name:'node-x',version:'v 3.0'};
        
        
        var parse   = {};
        
        
        setTimeout(pre,50);
        
        
        function pre(){
        
              var user    = process.argv[2];
              for(var key in aliases){
              
                    if(user===key){
                          var value   = aliases[key];
                          var parts   = value.split(' ');
                          parts.forEach((str,i)=>process.argv[2+i]    = str);
                    }
                    
              }//for
              
              cmdline();
              
        }//pre
        
        function cmdline(){
        
              var arg2    = process.argv[2];
              
              if(!arg2){
                    help();
                    return;
              }
              
              var cmd     = [
                    {id:['add'],fn:add},
                    {id:['rem'],fn:rem},
                    {id:['list'],fn:list},
                    {id:['cat'],fn:cat},
                    {id:['find'],fn:find},
                    {id:['findstr'],fn:findstr},
                    {id:['glob'],fn:glob},
                    {id:['glob-name'],fn:glob.filename},
                    {id:['files'],fn:files},
                    
                    {id:['alias'],fn:alias},
                    {id:['alias-rem'],fn:alias.rem},
                    
                    {id:['help','h'],fn:help},
                    {id:['v','version'],fn:version}
              ];
              
              var ni    = cmd.length;
              for(var i=0;i<ni;i++){
              
                    var item    = cmd[i];
                    
                    var nj   = item.id.length;
                    for(var j=0;j<nj;j++){
                    
                          if(arg2==='-'+item.id[j] || arg2==='--'+item.id[j]){
                                item.fn();
                                return;
                          }
                          
                    }//for
                    
              }//for
              
              main();
              
        }//cmdline
        
        
        function main(){
        
              var file    = process.argv[2];
              var ext     = fext(file);
              
              if(!ext){
                                                                                console.log('launching files without file extension is disabled');
                    return;
              }
              
              if(!(ext in config.launch)){
                                                                                console.log('unsupported file extension','.'+ext);
                    return;
              }
              
              if(!config.launch[ext]){
                                                                                console.log('.'+ext,'disabled');
                    return;
              }
              
              
              var params    = {
                    filename    : file,
                    args        : process.argv.slice(3)
              }
              start(params);
              
        }//main
        
  //:
  
        function version(){
        
              console.log();
              console.log(program.name,program.version);
              console.log();
              
        }//version
        
        
        function help(){
        
              exit    = true;
              
              console.log('node-x <filename> ........ launch filename');
              console.log();
              console.log('-add ..................... adds current directory');
              console.log('-add <dir> ............... add directory <dir>');
              console.log('-rem ..................... remove current directory');
              console.log('-rem <dir> ............... remove directory <dir>, can also be the index number');
              console.log('-list .................... list directories');
              console.log();
              console.log('-files ................... list all files accessible to node-x');
              console.log('-find <filename> ......... list files that match');
              console.log('-glob <pattern> .......... list files by glob pattern search on absolute path to file');
              console.log('-glob-name <pattern> ..... list files by glob pattern search on filename only');
              console.log();
              console.log('-cat <filename> .......... echo file to console');
              console.log('-findstr <matchN> ........ list files that contain all match terms, multiple match terms allowed');
              console.log();
              console.log('-alias ................... list current aliases');
              console.log('-alias <key> <value> ..... create an alias for <filename> or <pattern> parameter');
              console.log('-alias-rem <key> ......... remove alias <key>, can also be the index number');
              console.log();
              console.log();
              
        }//help
        
  //:
  
  
        function start(params,callback){
        
              params.list     = params.list || [];
              params.ct       = 0;
              params.total    = dirs.length;
              
              dirs.forEach(dir=>readdir(params,dir,null,callback));
              
        }//start
        
        
        async function readdir(params,dir,name,callback){
        
              if(name){
                    dir  += name+'/';
              }
              
              try{
                                                                                //console.log(dir);
                    var files   = await fsp.readdir(dir,{withFileTypes:true});
                    
              }//try
              
              catch(err){
              
                    console.log();
                    console.log('error',dir);
                    console.error(err);
                    console.log();
                    
              }//catch
              
              if(files){
                    files.forEach(file=>{
                    
                          var name    = file.name;
                          var r;
                                                                                //console.log(name);
                          if(file.isFile()){
                                if(chk(name)){
                                      params.list.push({dir,name});
                                }
                          }
                          
                          if(file.isDirectory()){
                                params.total++;
                                readdir(params,dir,name,callback);
                          }
                          
                    });
              }
              
              params.ct++;
              if(params.ct==params.total){
                    complete(params,callback);
              }
              
              
              function chk(name){
              
                    var abs         = dir+name;
                    
                    if(params.filename){
                          if(abs.endsWith(params.filename)){
                                return true;
                          }
                          return false;
                    }
                    
                    
                    var regex   = params.regex;
                    if(params.globmode=='name'){
                          if(regex.test(name)){
                                return true;
                          }
                          return false;
                    }
                    if(regex.test(abs)){
                          return true;
                    }
                    return false;
                    
              }//chk
              
        }//readdir
        
        
        function complete(params,callback){
        
              var file;
              if(params.filename){
                    file    = path.parse(params.filename).base;
              }else{
                    file    = params.glob;
              }
              
              if(params.list.length==0){
                    console.log(file,'not found');
                    return;
              }
              
              if(params.list.length>1){
                    params.list.forEach(item=>{
                    
                          console.log(item.dir+item.name);
                          
                    });
                    return;
              }
              
              var dir     = params.list[0].dir;
              var name    = params.list[0].name;
              
              if(callback){
                    callback(dir,name);
                    return;
              }
              
              var args    = params.args;
              var ext     = fext(file);
              launch[ext](dir,file,args);
              
        }//complete
        
        complete.display=function(dir,filename){
        
              console.log(dir+filename);
              
        }//complete.display
        
        
  //:-
  
  
        function launch(dir,cmd,args){
        
              var opts    = {
                    cwd         : dir,
                    stdio       : 'inherit'
              };
              
              try{
              
                    var child   = cp.spawn(cmd,args,opts);
                                                                                console.log('process ',child.pid);
              }//try
              
              catch(err){
              
                    console.log(err);
                    
              }//catch
              
        }//launch
        
        
        launch.js=function(dir,file,args){
                                                                                console.log(dir);
                                                                                console.log(file);
              args.unshift(file);
              launch(dir,'node',args);
              
        }//js
        
        launch.mjs=launch.js;
        launch.cjs=launch.js;
        
        
        launch.bat=function(dir,file,args){
                                                                                console.log(dir);
                                                                                console.log(file);
              launch(dir,file,args);
              
        }//bat
        
        launch.exe=function(dir,file,args){
                                                                                console.log(dir);
                                                                                console.log(file);
              launch(dir,file,args);
              
        }//exe
        
        
        launch.sh=function(dir,file){
                                                                                console.log(dir);
                                                                                console.log(file);
              launch(dir,file);
              
        }//sh
        
  //:
  
        function add(){
                                                                                console.log('-add');
              exit        = true;
              
              var dir     = process.argv[3];
              if(!dir){
                    dir   = process.cwd();
              }
              dir   = dir.split(path.sep).join(path.posix.sep).replace(/^[a-zA-Z]:/,'');
              if(dir.slice(-1)!=='/'){
                    dir  += '/';
              }
                                                                                console.log(dir);
              var n   = dirs.length;
              for(var i=0;i<n;i++){
              
                    var dir2    = dirs[i];
                    if(dir2===dir){
                          list();
                          return;
                    }
                    
              }//for
              
              dirs.unshift(dir);
              write();
              list();
              
        }//add
        
        
        function rem(){
                                                                                console.log('-rem');
              exit        = true;
              
              var dir     = process.argv[3];
              if(!dir){
                    dir   = process.cwd();
              }
              dir   = dir.split(path.sep).join(path.posix.sep).replace(/^[a-zA-Z]:/,'');
              
              var f   = false;
              
              var n   = parse.int(dir);
              if(n){
                    var index   = n-1;
                    dir         = dirs[index];
                    dirs.splice(index,1);
                    f   = true;
              }else{
                    var n   = dirs.length;
                    for(var i=n-1;i>=0;i--){
                    
                          var dir2    = dirs[i];
                          if(dir2===dir){
                                dirs.splice(i,1);
                                f   = true;
                          }
                          
                    }//for
              }
              
              if(!f){
                    console.log('not found',dir);
              }else{
                    console.log('removed',dir);
                    write();
              }
              list();
              
        }//rem
        
        
        function list(){
        
              console.log();
              console.log(name,' : ',dirs.length);
              
              dirs.forEach((dir,i)=>{
              
                    console.log(i+1,' : ',dir);
                    
              });
              console.log();
              
        }//list
        
  //:
  
        function files(){
        
              var num     = 0;
              var c       = 0;
              var total   = dirs.length;
              
              console.log();
              
              dirs.forEach(dir=>readdir(dir));
              
              async function readdir(dir,name){
              
                    if(name){
                          dir  += name+'/';
                    }
                    
                    try{
                                                                                //console.log(dir);
                          var files   = await fsp.readdir(dir,{withFileTypes:true});
                          
                    }//try
                    
                    catch(err2){
                    
                          var err   = err2;
                          
                    }//catch
                    
                    if(err){
                          return;
                    }
                    
                    files.forEach(file=>{
                    
                          if(file.isDirectory()){
                                total++;
                                readdir(dir,file.name);
                                return;
                          }
                          
                          if(!file.isFile()){
                                return;
                          }
                          
                          var ext   = fext(file.name);
                          
                          if(!(ext in config.launch)){
                                return;
                          }
                          if(!config.launch[ext]){
                                return;
                          }
                          
                          num++;
                          console.log(dir+file.name);
                          
                    });
                    
                    c++;
                    if(c==total){
                          console.log();
                          console.log(num,'files');
                          console.log();
                    }
                    
              }//readdir
              
        }//files
        
  //:
  
        function find(){
        
              var params    = {
                    filename    : process.argv[3],
              };
              start(params,complete.display);
              
        }//find
        
        
        function glob(){
        
              var glob    = process.argv[3];
              var regex   = parse.glob(glob);
              var params    = {
                    glob    : glob,
                    regex   : regex
              };
              start(params,complete.display);
              
        }//glob
        
        
        glob.filename=function(){
        
              var glob    = process.argv[3];
              var regex   = parse.glob(glob);
              var params    = {
                    globmode    : 'name',
                    glob        : glob,
                    regex       : regex
              };
              start(params,complete.display);
              
        }//name
        
  //:
  
        function findstr(){
        
              var args    = process.argv.slice(3);
              var nargs   = args.length;
              var num     = 0;
              var c       = 0;
              var total   = dirs.length;
              
              dirs.forEach(dir=>readdir(dir));
              
              async function readdir(dir,name){
              
                    if(name){
                          dir  += name+'/';
                    }
                    
                    try{
                                                                                //console.log(dir);
                          var files   = await fsp.readdir(dir,{withFileTypes:true});
                          
                    }//try
                    
                    catch(err2){
                    
                          var err   = err2;
                          
                    }//catch
                    
                    if(err){
                          return;
                    }
                    
                    files.forEach(async file=>{
                    
                          if(file.isDirectory()){
                                total++;
                                readdir(dir,file.name);
                                return;
                          }
                          
                          if(!file.isFile()){
                                return;
                          }
                          
                          var ext   = fext(file.name);
                          if(!ext){
                                return;
                          }
                          if(ext.indexOf('js')==-1){
                                return;
                          }
                          
                          var txt   = await fsp.readFile(dir+file.name,'utf8');
                          
                          for(var i=0;i<nargs;i++){
                          
                                if(txt.indexOf(args[i])==-1){
                                      return;
                                }
                                
                          }//for
                          
                          num++;
                          console.log(dir+file.name);
                          
                    });
                    
                    c++;
                    if(c==total){
                          if(num==0){
                                console.log('[ not found ]');
                          }
                    }
                    
              }//readdir
              
        }//findstr
        
        
        function cat(){
        
              var mode;
              if(process.argv.length>=5){
                    var p1    = parseInt(process.argv[4]);
                    if(!isNaN(p1)){
                          mode    = 'one';
                    }
              }
              if(process.argv.length==6){
                    var p2    = parseInt(process.argv[5]);
                    if(!isNaN(p2) && mode=='one'){
                          mode    = 'two';
                    }
              }
              
              var params    = {
                    filename    : process.argv[3],
              };
              start(params,complete);
              
              
              async function complete(dir,filename){
              
                    var txt     = await fsp.readFile(dir+filename,'utf8');
                    var size    = hs(txt.length);
                    
                    try{
                    
                          switch(mode){
                            case 'one'    : txt   = txt.slice(p1);        break;
                            case 'two'    : txt   = txt.slice(p1,p2);     break;
                          }//switch
                          
                    }
                    
                    catch(err){
                    
                          console.error(err);
                          return;
                          
                    }//catch
                    
                    console.log();
                    console.log(dir);
                    console.log(filename);
                    console.log(size);
                    console.log();
                    console.log('< --- >');
                    console.log(txt);
                    console.log('< --- >');
                    console.log();
                    
              }//complete
              
        }//cat
        
  //:
  
        function alias(){
        
              var key   = process.argv[3];
              
              if(!key){
                    alias.list();
                    return;
              }
              
              var n       = process.argv.length;
              var value   = '';
              for(var i=0;i<n;i++){
              
                    value  += process.argv[4+i];
                    if(i<n-1){
                          value  += ' ';
                    }
                    
              }//for
              
              aliases[key]    = value;
              
              write();
              alias.list();
              
        }//alias
        
        
        alias.rem=function(){
        
              var key2    = process.argv[3];
              if(!key2){
                    alias.list();
                    return;
              }
              
              var f       = false;
              
              var n   = parse.int(key);
              if(n){
                    var index   = n-1;
                    var key     = Object.keys(aliases)[index];
                    delete aliases[key];
                    f   = true;
              }else{
                    for(var key in aliases){
                    
                          if(key===key2){
                                delete aliases[key];
                                f   = true;
                          }
                          
                    }//for
              }
              
              if(!f){
                    console.log('alias',key,'not found');
              }else{
                    console.log('alias',key,'removed');
                    write();
              }
              
              alias.list();
              
        }//alias.rem
        
        
        alias.list=function(){
        
              var c   = 0;
              var n   = -1;
              for(var key in aliases){
              
                    c++;
                    if(key.length>n){
                          n   = key.length;
                    }
                    
              }//for
              
              console.log();
              console.log('node-x aliases :',c);
              console.log();
              
              var c   = 0;
              for(var key in aliases){
              
                    c++;
                    console.log(c,':',(key+' ').padEnd(n+6,'.'),aliases[key]);
                    
              }//for
              
              if(c){
                    console.log();
              }
              
        }//alias.list
        
  //:
  
        async function write(){
        
              var txt   = await fsp.readFile(__filename,'utf8');
              txt       = write.dirs(txt);
              txt       = write.alias(txt);
              await fsp.writeFile(__filename,txt);
              
        }//write
        
        write.dirs=function(txt){
        
              var i1        = txt.indexOf('var dirs');
              i1            = txt.indexOf('[',i1);
              var i2        = txt.indexOf(']',i1);
              var indent    = Array(14).join(' ');
              
              var str       = '\n\n';
              dirs.forEach(dir=>{
              
                    str  += indent+"'"+dir+"',\n";
                    
              });
              str  += '\n';
              
              indent      = Array(8).join(' ');
              txt         = txt.slice(0,i1+1)+str+indent+txt.slice(i2);
              return txt;
              
        }//write.dirs
        
        write.alias=function(txt){
        
              var i1        = txt.indexOf('var aliases');
              i1            = txt.indexOf('{',i1);
              var i2        = txt.indexOf('}',i1);
              var indent    = Array(14).join(' ');
              
              var str       = '\n\n';
              for(var key in aliases){
              
                    str  += indent+key+":'"+aliases[key]+"',\n";
                    
              }//for
              str  += '\n';
              
              indent      = Array(8).join(' ');
              txt         = txt.slice(0,i1+1)+str+indent+txt.slice(i2);
              return txt;
              
        }//alias
        
  //:
  
        function fext(file){
        
              var ext   = path.parse(file).ext;
              if(!ext){
                    return;
              }
              return ext.slice(1).toLowerCase();
              
        }//fext
        
        
        function hs(size){
        
              var i   = size==0 ? 0 : Math.floor(Math.log(size)/Math.log(1000));
              var s   = ((size/Math.pow(1000,i)).toFixed(2))*1+' '+['B','kB','MB','GB','TB'][i];
              return s;
              
        }//hs
        
        
        parse.int=function(str){
        
              var n   = Math.floor(Number(str));
              if(n!==Infinity && String(n)===str && n>=0){
                    return n;
              }
              return null;
              
        }//parse.int
        
        
        parse.glob=function(glob, opts) {
                                                                                //  https://github.com/fitzgen/glob-to-regexp/tree/master
              if (typeof glob !== 'string') {
                throw new TypeError('Expected a string');
              }
              
              var str = String(glob);
              
              // The regexp we are building, as a string.
              var reStr = "";
              
              // Whether we are matching so called "extended" globs (like bash) and should
              // support single character matching, matching ranges of characters, group
              // matching, etc.
              var extended = opts ? !!opts.extended : false;
              
              // When globstar is _false_ (default), '/foo/*' is translated a regexp like
              // '^\/foo\/.*$' which will match any string beginning with '/foo/'
              // When globstar is _true_, '/foo/*' is translated to regexp like
              // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
              // which does not have a '/' to the right of it.
              // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
              // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
              // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
              // globstar is _false_
              var globstar = opts ? !!opts.globstar : false;
              
              // If we are doing extended matching, this boolean is true when we are inside
              // a group (eg {*.html,*.js}), and false otherwise.
              var inGroup = false;
              
              // RegExp flags (eg "i" ) to pass in to RegExp constructor.
              var flags = opts && typeof( opts.flags ) === "string" ? opts.flags : "";
              
              var c;
              for (var i = 0, len = str.length; i < len; i++) {
                c = str[i];
                
                switch (c) {
                case "/":
                case "$":
                case "^":
                case "+":
                case ".":
                case "(":
                case ")":
                case "=":
                case "!":
                case "|":
                  reStr += "\\" + c;
                  break;
                  
                case "?":
                  if (extended) {
                    reStr += ".";
            	    break;
                  }
                  
                case "[":
                case "]":
                  if (extended) {
                    reStr += c;
            	    break;
                  }
                  
                case "{":
                  if (extended) {
                    inGroup = true;
            	    reStr += "(";
            	    break;
                  }
                  
                case "}":
                  if (extended) {
                    inGroup = false;
            	    reStr += ")";
            	    break;
                  }
                  
                case ",":
                  if (inGroup) {
                    reStr += "|";
            	    break;
                  }
                  reStr += "\\" + c;
                  break;
                  
                case "*":
                  // Move over all consecutive "*"'s.
                  // Also store the previous and next characters
                  var prevChar = str[i - 1];
                  var starCount = 1;
                  while(str[i + 1] === "*") {
                    starCount++;
                    i++;
                  }
                  var nextChar = str[i + 1];
                  
                  if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    reStr += ".*";
                  } else {
                    // globstar is enabled, so determine if this is a globstar segment
                    var isGlobstar = starCount > 1                      // multiple "*"'s
                      && (prevChar === "/" || prevChar === undefined)   // from the start of the segment
                      && (nextChar === "/" || nextChar === undefined)   // to the end of the segment
                      
                    if (isGlobstar) {
                      // it's a globstar, so match zero or more path segments
                      reStr += "((?:[^/]*(?:\/|$))*)";
                      i++; // move over the "/"
                    } else {
                      // it's not a globstar, so only match one path segment
                      reStr += "([^/]*)";
                    }
                  }
                  break;
                  
                default:
                  reStr += c;
                }
              }
              
              // When regexp 'g' flag is specified don't
              // constrain the regular expression with ^ & $
              if (!flags || !~flags.indexOf('g')) {
                reStr = "^" + reStr + "$";
              }
              
              return new RegExp(reStr, flags);
              
        };
        
        
        
