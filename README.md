# ItemsArtGenerator

ItemsArtGenerator is an app which generates according to the choice of the user a subway map, a word cloud or a picture since a form.

It was built with [Meteor](http://meteor.com). See the [Documentation](http://docs.meteor.com/#/full/) for any helps.

# How to install

    1/ Install Meteor
        $ curl https://install.meteor.com | sh 
        // This will install the meteor executable onto your system and have you ready to use Meteor.

    2/ Install Meteorite
        $ npm install -g meteorite

        If you may need root permission to install Meteorite:
        $ sudo -H npm install -g meteorite

    2/ Install phantomjs
        $ npm install -g phantomjs

        If you may need root permission to install phantomjs:
        $ sudo -H npm install -g phantomjs

    4/ Run the project
        $ cd /path/to/repository
        /!\ Foundation package is not compatible with Meteor 1.0. You need execute this command
        $ mrt add zurb-foundation
        $ meteor

# API

## Errors ##

 * 400 if parameter is missing (in headers or data)
 * 404 if project or user not found
 * 405 if method is not found
 * 409 if creating a user that already exists

## Routes ##

###Give a project details###

 * Method: GET
 * Route: /api/1.0/projects/:_id
 * Example: http://itemsartgenerator/api/1.0/projects/8489a5d7f060ac7e3b6d8654

```json
    {
        'id'  : 2465,
        'name' : 'Jour de l\'an',
        'createdAt' : '12-09-2014 00:00:03',
        'updatedAt' : '12-09-2014 13:40:55',
        'type' : 'text-cloud',
        'author' : 'gerard.menard@wanadoo.fr',
        'description' : 'Jour de l\'an 2014 chez la famille Delarue',
        'votes' : 45,
        'sales' : 25,
        'tags' : ['city'],
        'visual-link' : 'http://item-art-generator.com/api/1.0./projects/2465
    }
```

###List all projects###

 * Method: GET
 * Route: /api/1.0/projects'
 * Options: tags, authors, types, sort_field, sort_order (ASC by default), offset (0 by default), limit
 * Example 1: http://itemsartgenerator/api/1.0/projects?tags[]=Metro&tags[]=Paris&sort_field=createdAt&sort_order=DESC
 * Example 2: http://itemsartgenerator/api/1.0/projects?offset=1&limit=10

###Render a project###

 * Method: GET
 * Route: /api/1.0/projects/:_id/render
 * Options: mode (base64), format (png, jpeg, jpg, pdf, gif)
 * Example: http://itemsartgenerator/api/1.0/projects/eaac6808cbdb9cc54c0ab450/render?mode=base64&format=png

###Vote for a project###

 * Method: POST
 * Route: /api/1.0/projects/:_id/vote
 * Data: userId
 * Example: http://itemsartgenerator/api/1.0/projects/eaac6808cbdb9cc54c0ab450/vote

###Update the number of sales for a project###

 * Method: PUT
 * Route: /api/1.0/projects/:_id/sales
 * Data: sales
 * Example: http://itemsartgenerator/api/1.0/projects/eaac6808cbdb9cc54c0ab450/sales

###Create a user###

 * Method: POST
 * Route: /api/1.0/users
 * Data: mail
 * Example: http://itemsartgenerator/api/1.0/users
