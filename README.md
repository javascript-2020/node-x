# node-x
nodejs script launcher

the nodejs script launcher allows easy execution of nodejs scripts

the user supplies the script with a list of directories
when node-x is invoked it scans these directories and sub-directories looking for a script with the given filename
if it finds the script it executes it

this is handy when the node-x is on the system path, therefore any script can be found and executed without the need
to change directories

node-x has a number of utility functions

              node-x <filename> ............... launch filename
              
              node-x -add ..................... adds current directory
              node-x -add <dir> ............... add directory <dir>
              node-x -rem ..................... remove current directory
              node-x -rem <dir> ............... remove directory <dir>, can also be the index number
              node-x -list .................... list directories
              
              node-x -files ................... list all files accessible to node-x
              node-x -find <filename> ......... list files that match
              node-x -glob <pattern> .......... list files by glob pattern search on absolute path to file
              node-x -glob-name <pattern> ..... list files by glob pattern search on filename only
              
              node-x -cat <filename> .......... echo file to console
              node-x -findstr <matchN> ........ list files that contain all match terms, multiple match terms allowed
              
              node-x -alias ................... list current aliases
              node-x -alias <key> <value> ..... create an alias for <filename> or <pattern> parameter
              node-x -alias-rem <key> ......... remove alias <key>, can also be the index number



## installation

npm install -g node-x

this will install the package globally so it can be called from anywhere on the file system


windows powershell users will need to remove the automatically generated ` node-x.ps1 ` because
windows powershell by default does not allow running scripts automatically
the powershell script should be located at

`  C:\Users\<user>\AppData\Roaming\npm\node-x.ps1  `

after this file is removed further calls to node-x will be handled by ` node-x.cmd `

alternatively the node-x package directory can be added to the system path, allowing the included
node-x.bat or node-x.sh scripts to launch the node-x process

Add to the PATH on Windows 10 and Windows 11 https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/

Linux: Add a Directory to PATH https://phoenixnap.com/kb/linux-add-to-path

Add to the PATH on Mac OS X 10.8 Mountain Lion and up https://www.architectryan.com/2012/10/02/add-to-the-path-on-mac-os-x-mountain-lion/



## uninstallation

npm uninstall -g node-x



## example useage

given directory structure

  |--  /
  
    |--  dir1
    
      |--  localhost.js
      
      |--  localhost-2.js
      
    |--  dir2
    
      |--  dir3
      
        |--  server.js
        
      |--  test.js
      
#### ex.1 : add /dir1 to list of directories

pwd  : /

cd dir1

pwd  : /dir1

node-x -add


#### ex.2 : add /dir2 to list of directories

pwd  : /

node-x -add /dir2

#### ex.3 : list directories in use by node-x

node-x -list

/dir1

/dir2

#### ex.4 : list all files accessible by node-x

node-x -files

/dir1/localhost.js
/dir1/localhost-2.js
/dir2/dir3/server.js
/dir2/test.js

#### ex.5 : launch a nodejs script

pwd  : /work/some-further-directory/
node-x localhost.js    //  localhost.js is executed

#### ex.6





