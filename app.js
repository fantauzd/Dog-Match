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

app.delete('/delete-dog/', function(req,res,next){
    let data = req.body;
    let dogID = parseInt(data.id);
    let deleteDogs_has_users = `DELETE FROM Dogs_has_users WHERE dogs_dog_id = ?`;
    let deleteAdoptions = `DELETE FROM Adoptions WHERE dog_id = ?`;
    let deleteMatches = `DELETE FROM Matches WHERE dog_id = ?`;
    let deleteDogs= `DELETE FROM Dogs WHERE dog_id = ?`;
    
    
    db.pool.query(deleteDogs_has_users, [dogID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        db.pool.query(deleteAdoptions, [dogID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            db.pool.query(deleteMatches, [dogID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
        
                else
                {
                    db.pool.query(deleteDogs, [dogID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
            })    
        }) 
    })});

app.put('/put-dog', function(req,res,next){
    let data = req.body;
    
    let dog_id = parseInt(data.dog_id);

    let birthdate = data.birthdate;
    if (!birthdate) 
    {
        birthdate = 'NULL';
    }
    
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
    
    let updateDogQuery = `UPDATE Dogs SET name = '${data.name}', birthdate = '${birthdate}', training_level = '${training_level}', is_family_friendly = '${data.is_family_friendly}', shelter_arrival_date = '${data.shelter_arrival_date}', is_active = '${data.is_active}', shelter_id = '${data.shelter_id}', breed_id = '${data.breed_id}' WHERE dog_id = '${dog_id}'`;
    
        // Run the 1st query
        db.pool.query(updateDogQuery,  function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});