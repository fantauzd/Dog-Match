// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 64236;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
// app.js
// index
app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/dogs', function(req, res)
    {  
        let getDogs = "SELECT * FROM Dogs;";               // Define our query

        db.pool.query(getDogs, function(error, rows, fields){    // Execute the query
            rows.map(row => {
                console.log(row)
                row.birthdate = row.birthdate.toISOString().slice(0,10)
                row.shelter_arrival_date = row.shelter_arrival_date.toISOString().slice(0,10)
            })
            res.render('dogs', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

    app.post('/add-dog', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        let training_level = parseInt(data.training_level);
        if (isNaN(training_level))
        {
            training_level = 'NULL'
        }
        
        let is_family_friendly = parseInt(data.is_family_friendly);
        if (isNaN(is_family_friendly))
        {
            is_family_friendly = 'NULL'
        }

        let shelter_arrival_date = data.shelter_arrival_date;
        if (!shelter_arrival_date) 
        {
            shelter_arrival_date = 'NULL';
        }

        let is_active = parseInt(data.is_active);
        if (isNaN(is_active))
        {
            is_active = 'NULL'
        }

        let shelter_id = parseInt(data.shelter_id);
        if (isNaN(shelter_id))
        {
            shelter_id = 'NULL'
        }

        let breed_id = parseInt(data.breed_id);
        if (isNaN(breed_id))
        {
            breed_id = 'NULL'
        }

        // Create the query and run it on the database
        insertDogs = `INSERT INTO Dogs (name, birthdate, training_level, is_family_friendly, shelter_arrival_date, is_active, shelter_id, breed_id) VALUES('${data.name}', '${data.birthdate}', '${training_level}', '${is_family_friendly}', '${shelter_arrival_date}', '${is_active}', '${shelter_id}', '${breed_id}')`;
        db.pool.query(insertDogs, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Breeds
                getAllDogs = `SELECT * FROM Dogs;`;
                db.pool.query(getAllDogs, function(error, rows, fields){
    
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
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});