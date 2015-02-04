# Operation

1. Installera node.js ( http://nodejs.org/download/ )
2. Installera mongoDB ( http://www.mongodb.org/downloads ) ( http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/ )
	2a. Skapa mappen \data\db genom att köra "md \data\db"
	2b. Starta mongodb genom att skriva "C:\mongodb\bin\mongod.exe" (beroende på var du installerade MongoDB) i CMD 
3. Installera WebStorm ( https://www.jetbrains.com/webstorm/download/ ) ( https://www.jetbrains.com/student/ )
4. Starta WebStorm och välj alternativet "Checkout from version control -> GitHub -> Logga in och välj repo Operation".
5. Öppna CMD/Terminal och gå till mappen där du skapade projektet i föregående steg.
6. Kör "git checkout -b DITTNAMN".
7. Kör "npm install".
8. För att köra servern kör "node keystone"
9. Du når servern på http://127.0.0.1.xip.io:3000/ ( Provar xip.io för att AJAX ska fungera lokalt också, men egentligen fungerar http://127.0.0.1:3000 lika bra )
9. Börja koda!

