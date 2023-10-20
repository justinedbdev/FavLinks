# FavLinks

**This repository is a simple project created for my Studi courses during a live session with a professional developer.**

## Technologies

This project uses the following technologies:
- HTML 5
- CSS 3 / Bootstrap 5
- Javascript 
- PHP 8.1 / Symfony 6 / API platform 
- MySQL

## Project presentation

The subject of this project was to create a favorite links management application.

**Goals :**
- Learn and practice Javascript and AJAX requests
- Create a CRUD for links with a form to add and modify a link
- Create a search bar
- Add pagination
- Use the Bootstrap graphics framework for forms, modal and cards


**Why did I create this Javascript project with PHP/Symfony?**

Because I easily wanted:
- Create the database with the Doctrine ORM
- Supply the database with Fixtures
- Create my back-end with the API Platform tool

## Utilisation

Project created with Symfony CLI and the -webapp option

To connect the database, this can be found in the .env file. You must add the data relating to BDD and your RDBMS in the DATABASE_URL.

```
DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=8.0.31"
```

Use this command to start a local server :

```
$ symfony serve
```

## View

![Website Screenshot](https://github.com/justinedbdev/FavLinks/assets/124370560/3fffca11-c251-4e2f-8885-fdd2afe2b4d0)
