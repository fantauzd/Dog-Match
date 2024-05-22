/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 9861;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
// breeds
app.get('/breeds', function(req, res)
    {  
        // get all breeds for the browse Breeds page, breeds.html
        let getBreeds = "SELECT breed_id, name, activity_level, shedding_level, size FROM Breeds ORDER BY breed_id;";

        db.pool.query(getBreeds, function(error, rows, fields){     // Execute the query

            res.render('breeds', {data: rows});                     // Render the breeds.hbs file, and also send the renderer
        })                                                          // an object where 'data' is equal to the 'rows' we
    });                                                             // received back from the query
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});