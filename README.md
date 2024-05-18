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



installation

npm install node-x


add the node-x directory to the system path environment variable

      windows   :

      linux     :

      mac       :






