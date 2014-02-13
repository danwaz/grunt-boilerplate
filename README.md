#Grunt Boilerplate
###HTML5 Boilerplate infused with Grunt, Compass, and RequireJS!

Grunt boilerplates is a custom build of HTML5 Boilerplate to help you better manage development and deployment tasks.

##Getting Started

Install Grunt CLI:

    npm install -g grunt-cli

Install Node Modules:

    npm install

Install Compass & Compass Gems

    gem install compass
    gem install susy
    gem install sass-globbing

You are ready to go!

##Grunt Tasks

Grunt tasks available in `Gruntfile.js`:
- `grunt` -- watches project for changes in .scss and compiles them on save
- `grunt compile` -- run a compilation once on .scss and .js
- `grunt build` -- outputs project into a build folder ( minifies and concats css/js, image optim, remove dev files )
- `grunt dist` -- builds project and SFTP build to server

##Deploying with Grunt
The deployment tasks of Grunt BP commented out initially and are totally optional.  If you want to take advantage of using grunt to deploy your project via SFTP, you just need to follow this initial setup.

Create a `secret.json` file with following lines:

    {
        "path" : "path/to/project/root",
        "tmp" : "path/to/project/tmp/folder",
        "host" : "your host",
        "username" : "your username",
        "password" : "your password"
    }

Then, open your `Gruntfile.js` and uncomment line 6:

    secret: grunt.file.readJSON('secret.json'),

To deploy the project:

    grunt dist
    
Grunt Boilerplate also let's you deploy a subset of files and folders.  These commands come in handy if you need to make a quick update without pushing the entire project. They include:

    grunt dist_base
    grunt dist_img
    grunt dist_css
    grunt dist_js

Grunt Boilerplate will initially SFTP all your files to a temporary folder ( ex : `/var/tmp` ) and then copy that folder to your project directory ( ex : `/var/www` ).  This is to ensure that your site does not experience any downtime during the SFTP process.

** NOTE : do not commit `secret.json` to version control! **

##Links
Reference and further documentation

- [HTML5 Boilerplate](http://html5boilerplate.com/)
- [Grunt](http://gruntjs.com/)
- [Compass](http://compass-style.org/)
- [RequireJS](http://requirejs.org/)

Grunt plugins:

- [watch](https://github.com/gruntjs/grunt-contrib-watch)
- [compass](https://github.com/gruntjs/grunt-contrib-compass)
- [requirejs](https://github.com/gruntjs/grunt-contrib-requirejs)
- [copy](https://github.com/gruntjs/grunt-contrib-copy)
- [clean](https://github.com/gruntjs/grunt-contrib-clean)
- [imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
- [ssh](https://github.com/andrewrjones/grunt-ssh)
- [html-build](https://github.com/spatools/grunt-html-build)