/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
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

app.post('/breeds', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let activity_level = parseInt(data.activity_level);
    if (isNaN(activity_level))
    {
        activity_level = 'NULL'
    }

    let shedding_level = parseInt(data.shedding_level);
    if (isNaN(shedding_level))
    {
        shedding_level = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Breeds (name, activity_level, shedding_level, size) VALUES('${data.name}', '${activity_level}', '${shedding_level}', '${data.size}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Breeds
            query2 = `SELECT * FROM Breeds;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});





/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});