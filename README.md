# Operation

1. Installera node.js ( http://nodejs.org/download/ )
	1a. Installera node-gyp ( "npm install -g node-gyp" )
2. Installera mongoDB ( http://www.mongodb.org/downloads ) ( http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/ )
	2a. Skapa mappen \data\db genom att köra "md \data\db"
	2b. Starta mongodb genom att skriva "C:\mongodb\bin\mongod.exe" (beroende på var du installerade MongoDB) i CMD 
3. Installera WebStorm ( https://www.jetbrains.com/webstorm/download/ ) ( https://www.jetbrains.com/student/ )
4. Starta WebStorm och välj alternativet "Checkout from version control -> GitHub -> Logga in och välj repo Operation".
5. Öppna CMD/Terminal och gå till mappen där du skapade projektet i föregående steg.
6. Kör "git checkout -b DITTNAMN".
7. Kör "npm install".
8. För att köra servern kör "node keystone"
9. Du når servern på http://127.0.0.1:3000/ 
10. Börja koda!

För att installera ett packet från npm:
"npm install --save PACKAGENAME"
--save gör så att alla andra bara kan köra "npm install" för att få alla paket som behövs för projektet.
--save ska alltså bara användas när paktet är obligatoriskt för att kunna använda projektet.

Alltid bra att köra "npm install" efter en pull då någon kan ha lagt till paket.

# REST

Lite exempel på hur man kan hämta/uppdatera/ta bort data med ajax.

URLer: (biblioteket lägger automatiskt på ett s på modellerna.)
* /api/operations
* /api/Processtegs
* /api/artikels
* /api/Förberedelses
* /api/Kommentars
* /api/Specialitets
* /api/users

* /api/update/:model/:slug

Types:
* GET för att hämta, söka och uppdatera
* POST för att skapa
* DELETE för ta bort

Sök (Operation, Kartotekartikel, Specialitet)
```javascript
$.ajax({
  type: 'GET',
  url: '/api/search/Operation',
  data: {
    text: 'söksträng'
  }
}).done(function( msg ) {
    console.log(JSON.parse(msg));
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  };
```

Hämta
```javascript
$.ajax({
  type: 'GET',
  url: '/api/operations/' + slug,
})
  .done(function( msg ) {
    console.log(JSON.parse(msg));
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  };
```

Skapa
```javascript
$.ajax({
  type: 'POST',
  url: '/api/operations',
  data: {
    title: 'Blindtarmsinflammation',
    tags: 'Appendix borttagning'
    
  }
})
  .done(function( msg ) {
    console.log(JSON.parse(msg)); //Innehåller den skapade modellen
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  };
```

Ändra 

Hämta, tänk på att "slug" kan ändras om du ändrar namn eller titel på vissa modeller
```javascript
$.ajax({
  type: 'GET',
  url: '/api/update/operations/' + slug,
  data: {
    title: 'Ny titel',
    tags: 'Nya tags'
  }
})
  .done(function( msg ) {
    console.log(JSON.parse(msg));
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  };
```
