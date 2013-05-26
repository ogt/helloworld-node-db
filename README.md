Simplest possible hello world heroku node.js app that uses express and mongodb to provide a basic login/register functionality

- Here is the github repo : https://github.com/ogt/helloworld-node-db
- Here is the heroku app : http://helloworld-node-db.herokuapp.com  (20+ sec delay at first fetch)
- Here is the blog post about this : http://otdump.blogspot.com/2013/03/worknotes-helloworld-with-db.html

Run locally as
```
> brew install hub heroku mongodb
> repo=helloworld-node-db
> hub fork ogt/$repo
> hub clone $repo
> cd $repo
> cat >.env_dev 
PORT=5000
HOST=http://localhost:5000
MONGOLAB_URI=localhost/local
^D
> foreman start -e .env_dev -f Procfile_dev
> open http://localhost:5000
```
Run on heroku as

```
> # assumes in $repo folder, local changes commited, already done the run local above
> heroku login
> heroku create $repo
> heroku addons:add mongolab
> git push heroku master
> heroku open
```

Previous iteration of this app is https://github.com/ogt/helloworld-node-cookies
