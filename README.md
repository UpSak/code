Hello the citation for the image i used for the background is from https://www.amazon.co.uk/Versus-Marvel-Omnibus-Dennis-ONeil/dp/1779523254

The API i used from https://comicvine.gamespot.com/api/

To use the website you need postgrsql installed and copy and paste the database into the postgresql from sql.sql. a reminder the there is not any inserted data in any of theses tables.
if this is your first time using postgresql, then go to file click on the storage you saved it on, select program files ---> PostgreSQL ---> the file number ---> bin then copy the link e.g. C:\Program Files\PostgreSQL\16\bin. open up cmd then enter cd "your link" ---> type psql -U postgres -h localhost then your password that you have set up from downloading postgresql. once you are logged in create database nodelogin then \c nodelogin to connect then copy and paste tthe sql data starting from line 3.

The next step would be go to terminal and click terminal in the bottom of vscode and enter first npm insatll to all the libraries and then finally enter npm start, that should make the server run.
Last step is to open up google chrome and tpye http://localhost:3000/ in your search browser, that should display the website. please let me know if your are struggling to access the website.

Last notice account link doesn't work as it was meant for order history.