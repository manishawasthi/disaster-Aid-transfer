
#start a rest server at port number 3000
nohup composer-rest-server  -c admin@disaster -p 3000 >disaster-composer.log 2>disaster-composer.err < /dev/null &
