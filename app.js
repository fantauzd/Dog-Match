/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 9666;
// Popups for client
//var popup = require('popups');                  // now we can use popup.alert to inform client of issues

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

// index
app.get('/index', function(req, res)
    {
        res.render('index');
    }
);

app.get('/', function(req, res)
    {
        res.render('index');
    }
);


// breeds
app.get('/breeds', function(req, res)
    {  
        // get all breeds for the browse Breeds page, breeds.html
        let getBreeds = "SELECT breed_id, name, activity_level, shedding_level, size FROM Breeds ORDER BY breed_id;";

        db.pool.query(getBreeds, function(error, rows, fields){     // Execute the query

            res.render('breeds', {data: rows});                     // Render the breeds.hbs file, and also send the renderer
        })                                                          // an object where 'data' is equal to the 'rows' we
    }
);                                                             // received back from the query

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
    insertBreeds = `INSERT INTO Breeds (name, activity_level, shedding_level, size) VALUES('${data.name}', '${activity_level}', '${shedding_level}', '${data.size}')`;
    db.pool.query(insertBreeds, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Breeds
            getAllBreeds = `SELECT * FROM Breeds;`;
            db.pool.query(getAllBreeds, function(error, rows, fields){

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

app.delete('/breeds', function(req,res,next){
    let data = req.body;
    let breedID = parseInt(data.id);
    let deleteBreedQuery = `DELETE FROM Breeds WHERE breed_id = ?`; 
  
          // Run the 1st query
          db.pool.query(deleteBreedQuery, [breedID], function(error, rows, fields){
              if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              } else {
                res.sendStatus(204);
            }
  })
});

app.put('/breeds', function(req,res,next){
    let data = req.body;

    let breed_id = parseInt(data.breed_id);

    let activity_level = parseInt(data.activity_level);
    if (isNaN(activity_level)){
        activity_level = 'NULL'
    }

    let shedding_level = parseInt(data.shedding_level);
    if (isNaN(shedding_level)){
        shedding_level = 'NULL'
    }

    let updateBreedQuery = `UPDATE Breeds SET name = '${data.name}', activity_level = '${activity_level}', shedding_level = '${shedding_level}', size = '${data.size}' WHERE breed_id = '${breed_id}'`;
    let selectBreed = `SELECT * FROM Breeds WHERE breed_id = '${breed_id}'`

    // Run the 1st query
    db.pool.query(updateBreedQuery,  function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        } else {
            // if no error, we run second query to get data to update the table on the front-end
            db.pool.query(selectBreed,  function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// users

app.get('/users', function(req, res){  
    // get all breeds for the browse Breeds page, breeds.html
    let getUsers = "SELECT * FROM Users ORDER BY is_active DESC, user_id;";

    db.pool.query(getUsers, function(error, rows, fields){     // Execute the query

        res.render('users', {data: rows});                     // Render the breeds.hbs file, and also send the renderer
    })                                                          // an object where 'data' is equal to the 'rows' we
});                                                             // received back from the query


app.post('/users', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    insertUsers = `INSERT INTO Users (username, phone, email, birthdate, home_type, street_address, city, postal_code, state, activity_preference, shedding_preference, training_preference, size_preference, has_children, has_dog, has_cat, is_active) VALUES ('${data.username}', '${data.phone}', '${data.email}', '${data.birthdate}', '${data.home_type}', '${data.street_address}', '${data.city}', '${data.postal_code}', '${data.state}', '${data.activity_preference}', '${data.shedding_preference}', '${data.training_preference}', '${data.size_preference}', '${data.has_children}', '${data.has_dog}', '${data.has_cat}', '${data.is_active}');`;

    db.pool.query(insertUsers, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            console.log('Ensure all required fields are entered')
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Breeds
            getAllUsers = `SELECT * FROM Users;`;
            db.pool.query(getAllUsers, function(error, rows, fields){

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


app.put('/users-deactivate', function(req, res, next){
    let data = req.body;
    let deactivateUser = `UPDATE Users SET is_active = 0 WHERE user_id = ${data.id};`;
    let deactivateMatches = `UPDATE Matches SET is_active = 0 WHERE user_id = ${data.id};`;
    let selectUser = "SELECT * FROM Users ORDER BY is_active DESC, user_id;";
    
    
     // Run the 1st query
    db.pool.query(deactivateMatches, function(error, rows, fields){
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query
            db.pool.query(deactivateUser, function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // still have bug that does not reload the page
                    db.pool.query(selectUser, function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }     
                    })
                }
            })
        }
    })
});


app.put('/users', function(req,res,next){
    let data = req.body;
    
    let user_id = parseInt(data.user_id);
    
    let activity_preference = parseInt(data.activity_preference);
    if (isNaN(activity_preference))
    {
        activity_preference = 'NULL'
    }
    
    let shedding_preference = parseInt(data.shedding_preference);
    if (isNaN(shedding_preference))
    {
        shedding_preference = 'NULL'
    }

    let training_preference = parseInt(data.training_preference);
    if (isNaN(training_preference))
    {
        training_preference = 'NULL'
    }

    let has_children = parseInt(data.has_children);
    if (isNaN(has_children))
    {
        has_children = 'NULL'
    }

    let has_dog = parseInt(data.has_dog);
    if (isNaN(has_dog))
    {
        has_dog = 'NULL'
    }

    let has_cat = parseInt(data.has_cat);
    if (isNaN(has_cat))
    {
        has_cat = 'NULL'
    }
    
    let updateUserQuery = `UPDATE Users SET username = '${data.username}', phone = '${data.phone}', email = '${data.email}', birthdate = '${data.birthdate}', home_type = '${data.home_type}', street_address = '${data.street_address}', city = '${data.city}', postal_code = '${data.postal_code}', state = '${data.state}', activity_preference = '${activity_preference}', shedding_preference = '${shedding_preference}', training_preference = '${training_preference}', size_preference = '${data.size_preference}', has_children = '${has_children}', has_dog = '${has_dog}', has_cat = '${has_cat}', is_active = '${data.is_active}' WHERE user_id = '${user_id}';`;
    let getUsers = `SELECT * FROM Users WHERE user_id = ${user_id} ORDER BY is_active DESC, user_id;`;

    // Run the 1st query
    db.pool.query(updateUserQuery,  function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the 2nd Query
            db.pool.query(getUsers,  function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


// dogs_has_users

app.get('/dogs_has_users', function(req, res)
    {  
        // Define our query
        let getDogs_has_users = "SELECT Dogs_has_users.dogs_has_users_id, Dogs_has_users.source, Dogs_has_users.dogs_dog_id, Dogs.name AS dog_name, Shelters.name AS shelter_name, Dogs_has_users.users_user_id, Users.username FROM Dogs_has_users INNER JOIN Dogs ON Dogs_has_users.dogs_dog_id = Dogs.dog_id INNER JOIN Shelters ON Dogs.shelter_id = Shelters.shelter_id INNER JOIN Users ON Dogs_has_users.users_user_id = Users.user_id ORDER BY Dogs_has_users.dogs_has_users_id;";
        let getUsers = "SELECT user_id, username FROM Users ORDER BY username;";
        let getDogs = "SELECT Dogs.dog_id, Dogs.name, Shelters.name AS shelter_name FROM Dogs INNER JOIN Shelters ON Dogs.shelter_id = Shelters.shelter_id ORDER BY Dogs.name, shelter_name;";

        db.pool.query(getDogs_has_users, function(error, rows, fields){    // Execute the query

            // Save the people
            let dogs_has_users = rows;
        
            // Run the second query
            db.pool.query(getUsers , (error, rows, fields) => {
            
                // Save the users
                let users = rows;

                // Run the third query
                 db.pool.query(getDogs , (error, rows, fields) => {
            
                    // Save the dogs
                    let dogs = rows;
                    return res.render('dogs_has_users', {data: dogs_has_users, users: users, dogs: dogs});
                })
            })
        })
    }
);
            

app.post('/dogs_has_users', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Notify client if source was not selected
    let source = data['input-source'];
    // if (source == "NULL")
    // {
    //     popup.alert({
    //         content: 'Please select a Source to add a "like".'
    //     })
    // }

    // Create the query and run it on the database
    addDogs_has_users = `INSERT INTO Dogs_has_users (dogs_dog_id, users_user_id, source) VALUES ('${data['input-dogs_dog_id']}', '${data['input-users_user_id']}', '${source}')`;

    db.pool.query(addDogs_has_users, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Dogs_has_users;`;
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
                    res.redirect('/dogs_has_users');
                }
            })
        }
    })
});

app.delete('/dogs_has_users', function(req,res,next){
    let data = req.body;
    let likeID = parseInt(data.dogs_has_users_id);
    let deleteLike = `DELETE from Dogs_has_users WHERE dogs_has_users_id = ?`;
    // Run the 1st query
    db.pool.query(deleteLike, [likeID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }else{
            res.sendStatus(204);
        }
    })
});


  
// Dogs
app.get('/dogs', function(req, res) {
    let getDogs = `
        SELECT 
            Dogs.dog_id, Dogs.name, Dogs.birthdate, Dogs.training_level, Dogs.is_family_friendly,
            Dogs.shelter_arrival_date, Dogs.is_active, Dogs.shelter_id, Shelters.name AS shelter_name, 
            Dogs.breed_id, IFNULL(Breeds.name, 'Mutt') AS breed_name
        FROM 
            Dogs 
        LEFT JOIN 
            Shelters ON Dogs.shelter_id = Shelters.shelter_id
        LEFT JOIN 
            Breeds ON Dogs.breed_id = Breeds.breed_id;
    `;

    let getShelters = "SELECT shelter_id, name FROM Shelters";
    let getBreeds = "SELECT breed_id, name FROM Breeds";

    db.pool.query(getDogs, function(error, dogRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
            return;
        }

        db.pool.query(getShelters, function(error, shelterRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                return;
            }

            db.pool.query(getBreeds, function(error, breedRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    return;
                }
                console.log({ dogs: dogRows, shelters: shelterRows, breeds: breedRows});
                res.render('dogs', { 
                    dogs: dogRows, 
                    shelters: shelterRows, 
                    breeds: breedRows 
                });
            });
        });
    });
});

app.post('/add-dog-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    insertDogs = `INSERT INTO Dogs (name, birthdate, training_level, is_family_friendly, shelter_arrival_date, is_active, shelter_id, breed_id) VALUES('${data['input-name']}', '${data['input-birthdate']}', '${data['input-training_level']}', '${data['input-is_family_friendly']}', '${data['input-shelter_arrival_date']}', '${data['input-is_active']}', '${data['input-shelter_id']}','${data['input-breed_id']}');`
    //updateMatches = `UPDATE Matches SET is_active = 0 WHERE dog_id = '${data['input-dog_id']}';`;
   // updateDogs = `UPDATE Dogs SET is_active = 0 Where dog_id = '${data['input-dog_id']}';`;

    db.pool.query(insertDogs, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/dogs');
            /*db.pool.query(updateMatches, function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                } else {
                    db.pool.query(updateDogs, function(error, rows, fields){
                        if (error) {
                            console.log(error)
                            res.sendStatus(400);
                        } else {
                            res.redirect('/adoptions');
                        }
                    })
                }
            })*/
        }
    })
});

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
    let getDogs = `SELECT Dogs.dog_id, Dogs.name, Dogs.birthdate, Dogs.training_level, Dogs.is_family_friendly, Dogs.shelter_arrival_date, Dogs.is_active, Dogs.shelter_id, Shelters.name AS shelter_name, Dogs.breed_id, IFNULL(Breeds.name, 'Mutt') AS breed_name FROM Dogs LEFT JOIN Shelters ON Dogs.shelter_id = Shelters.shelter_id LEFT JOIN  Breeds ON Dogs.breed_id = Breeds.breed_id WHERE Dogs.dog_id = '${dog_id}';`;

        // Run the 1st query
    db.pool.query(updateDogQuery,  function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        } else {
            db.pool.query(getDogs,  function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }   
    });
});

app.put('/dogs-deactivate', function(req,res,next){
    let data = req.body;
    let dogID = parseInt(data.id);
    let deactivateMatches = `UPDATE Matches SET is_active = 0 WHERE dog_id = ?`;
    let deactivateDogs= `UPDATE Dogs SET is_active = 0 WHERE dog_id = ?`;
    
    
    db.pool.query(deactivateDogs, [dogID], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);

        } else {
            db.pool.query(deactivateMatches, [dogID], function(error, rows, fields){
                if (error) {
        
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);

                } else{
                    res.sendStatus(204);
                }
            })
        }
    })
});


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

// Shelters
app.get('/shelters', function(req, res) {  
    let getShelters = "SELECT * FROM Shelters;";               // Define our query

    db.pool.query(getShelters, function(error, rows, fields) {    // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('shelters', {data: rows});              // Render the shelters.hbs file, and also send the renderer
        }                                                      // an object where 'data' is equal to the 'rows' we received back from the query
    });
});

app.post('/add-shelter', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let name = data.name;
    if (!name) {
        name = 'NULL';
    }
    
    let email = data.email;
    if (!email) {
        email = 'NULL';
    }

    let street_address = data.street_address;
    if (!street_address) {
        street_address = 'NULL';
    }

    let city = data.city;
    if (!city) {
        city = 'NULL';
    }

    let postal_code = data.postal_code;
    if (!postal_code) {
        postal_code = 'NULL';
    }

    let state = data.state;
    if (!state) {
        state = 'NULL';
    }

    // Create the query and run it on the database
    let insertShelters = `INSERT INTO Shelters (name, email, street_address, city, postal_code, state) VALUES('${name}', '${email}', '${street_address}', '${city}', '${postal_code}', '${state}')`;
    db.pool.query(insertShelters, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Shelters
            let getAllShelters = `SELECT * FROM Shelters;`;
            db.pool.query(getAllShelters, function(error, rows, fields) {

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
                    // location.reload();
                }
            })
        }
    })
});

app.put('/deactivate-shelter', function(req, res, next) {
    let data = req.body;
    let shelterID = parseInt(data.id);
    let deactivateDogs = `UPDATE Dogs SET is_active = 0 WHERE shelter_id = ?`;
    let deactivateMatches = `UPDATE Matches INNER JOIN Dogs ON Matches.dog_id = Dogs.dog_id SET Matches.is_active = 0 Where Dogs.shelter_id = ?`;

    db.pool.query(deactivateDogs, [shelterID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        
        db.pool.query(deactivateMatches, [shelterID], function(error, rows, fields) {
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
    })
});

app.put('/reactivate-shelter', function(req, res, next) {
    let data = req.body;
    let shelterID = parseInt(data.id);
    let reactivateDogs = `UPDATE Dogs SET is_active = 1 WHERE shelter_id = ?`;
    let reactivateMatches = `UPDATE Matches INNER JOIN Dogs ON Matches.dog_id = Dogs.dog_id SET Matches.is_active = 1 Where Dogs.shelter_id = ?`;

    db.pool.query(reactivateDogs, [shelterID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        
        db.pool.query(reactivateMatches, [shelterID], function(error, rows, fields) {
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
    })
});

app.put('/put-shelter', function(req, res, next){
    let data = req.body;
    
    // let shelter_id = parseInt(data.shelter_id);
    // if (isNaN(shelter_id)) {
    //     res.sendStatus(400);
    //     return;
    // }

    // let name = data.name;
    // if (!name) {
    //     name = 'NULL';
    // }
    
    // let email = data.email;
    // if (!email) {
    //     email = 'NULL';
    // }

    // let street_address = data.street_address;
    // if (!street_address) {
    //     street_address = 'NULL';
    // }

    // let city = data.city;
    // if (!city) {
    //     city = 'NULL';
    // }

    // let postal_code = data.postal_code;
    // if (!postal_code) {
    //     postal_code = 'NULL';
    // }

    // let state = data.state;
    // if (!state) {
    //     state = 'NULL';
    // }

    let updateShelterQuery = `UPDATE Shelters SET name = '${data.name}', email = '${data.email}', street_address = '${data.street_address}', city = '${data.city}', postal_code = '${data.postal_code}', state = '${data.state}' WHERE shelter_id = '${data.shelter_id}'`;
    let getShelters = `SELECT * FROM Shelters WHERE shelter_id = '${data.shelter_id}';`;

    // Run the 1st query
    db.pool.query(updateShelterQuery, function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // if no error, we run second query to get data to update the table on the front-end
            db.pool.query(getShelters,  function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    });
});


// Adoptions


app.get('/adoptions', function(req, res)
    {  
        // Define our query
        let getAdoptions = "SELECT Adoptions.adoption_id, Adoptions.dog_id, Dogs.name AS dog_name, Adoptions.shelter_id, Shelters.name AS shelter_name, Adoptions.user_id, IFNULL(Users.username, 'Non-User') AS adopter, Adoptions.match_id, IFNULL(Matches.date, 'No Match') AS match_date, Adoptions.date AS adoption_date FROM Adoptions INNER JOIN Dogs ON Adoptions.dog_id = Dogs.dog_id INNER JOIN Shelters ON Adoptions.shelter_id = Shelters.shelter_id LEFT JOIN Users ON Adoptions.user_id = Users.user_id LEFT JOIN Matches ON Adoptions.match_id = Matches.match_id ORDER BY adoption_date DESC;";
        let getUsers = "SELECT user_id, username FROM Users ORDER BY username;";
        let getMatches = "SELECT Matches.match_id, Matches.user_id, Matches.dog_id, Users.username AS user_name, Dogs.name AS dog_name FROM Matches INNER JOIN Users ON Matches.user_id = Users.user_id INNER JOIN Dogs ON Matches.dog_id = Dogs.dog_id WHERE Matches.is_active = 1 ORDER BY Users.username;";
        let getDogs = "SELECT Dogs.dog_id, Dogs.name, Shelters.shelter_id, Shelters.name AS shelter_name FROM Dogs INNER JOIN Shelters ON Dogs.shelter_id = Shelters.shelter_id WHERE Dogs.is_active = 1 ORDER BY shelter_name;";
        let getShelters = "SELECT Shelters.shelter_id, Shelters.name FROM Shelters"

        db.pool.query(getAdoptions, function(error, rows, fields){    // Execute the query

            // Save the adoptions
            let adoptions = rows;
        
            // Run the second query
            db.pool.query(getUsers , (error, rows, fields) => {
            
                // Save the users
                let users = rows;

                // Run the third query
                db.pool.query(getMatches , (error, rows, fields) => {
            
                    // Save the matches
                    let matches = rows;
                
                    // Run the last query
                    db.pool.query(getDogs , (error, rows, fields) => {

                        // Save the dogs
                        let dogs = rows;

                        db.pool.query(getShelters , (error, rows, fields) => {

                            // Save the shelters
                            let shelters = rows;

                            return res.render('adoptions', {data: adoptions, users: users, dogs: dogs, matches: matches, shelters: shelters});
                        })
                    })
                })
            })
        })
    }
);


app.post('/add-adoption-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    insertAdoptions = `INSERT INTO Adoptions (date, dog_id, shelter_id, user_id, match_id) VALUES ('${data['input-date']}', '${data['input-dog_id']}', '${data['input-shelter_id']}', ${data['input-user_id']}, ${data['input-match_id']});`;
    updateMatches = `UPDATE Matches SET is_active = 0 WHERE dog_id = '${data['input-dog_id']}';`;
    updateDogs = `UPDATE Dogs SET is_active = 0 Where dog_id = '${data['input-dog_id']}';`;

    db.pool.query(insertAdoptions, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        } else {
            db.pool.query(updateMatches, function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                } else {
                    db.pool.query(updateDogs, function(error, rows, fields){
                        if (error) {
                            console.log(error)
                            res.sendStatus(400);
                        } else {
                            res.redirect('/adoptions');
                        }
                    })
                }
            })
        }
    })
});

// Delete adoption
app.delete('/delete-adoption', function(req, res) {
    let data = req.body;
    let adoptionID = parseInt(data.id);
    let dogID = parseInt(data.dog_id)

    // Query to delete the adoption record
    let deleteAdoption = `DELETE FROM Adoptions WHERE adoption_id = ?`;
    updateMatches = `UPDATE Matches SET is_active = 1 WHERE dog_id = ?`;
    updateDogs = `UPDATE Dogs SET is_active = 1 Where dog_id = ?`;


    db.pool.query(deleteAdoption, [adoptionID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }else{
            db.pool.query(updateDogs, [dogID], function(error, rows, fields){
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }else{
                    db.pool.query(updateMatches, [dogID], function(error, rows, fields){
                        if (error) {
                            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                            console.log(error);
                            res.sendStatus(400);
                        }else{
                            res.sendStatus(204);
                        }
                    })
                }
            })
        }
    })
});

// Matches
app.get('/matches', function(req, res)
    {  
        // Define our query
        let getMatches = "SELECT Matches.match_id, Matches.date, Matches.user_id, Users.username, Matches.dog_id, Dogs.name AS dog_name, Matches.is_active FROM Matches INNER JOIN Users ON Matches.user_id = Users.user_id INNER JOIN Dogs ON Matches.dog_id = Dogs.dog_id ORDER BY Matches.match_id;";
        let getUsers = "SELECT user_id, username FROM Users ORDER BY username;";
        let getDogs = "SELECT Dogs.dog_id, Dogs.name, Shelters.name AS shelter_name FROM Dogs INNER JOIN Shelters ON Dogs.shelter_id = Shelters.shelter_id ORDER BY Dogs.name, shelter_name;";

        db.pool.query(getMatches, function(error, rows, fields){    // Execute the query

            // Save the people
            let matches = rows;
        
            // Run the second query
            db.pool.query(getUsers , (error, rows, fields) => {
            
                // Save the users
                let users = rows;

                // Run the third query
                 db.pool.query(getDogs , (error, rows, fields) => {
            
                    // Save the dogs
                    let dogs = rows;
                    return res.render('matches', {data: matches, users: users, dogs: dogs});
                })
            })
        })
    }
);

app.post('/matches', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    addMatches = `INSERT INTO Matches (date, user_id, dog_id, is_active) VALUES ('${data['input-date']}', '${data['input-user_id']}', '${data['input-dog_id']}', '${data['input-is_active']}')`;

    db.pool.query(addMatches, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Matches;`;
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
                    res.redirect('/matches');
                }
            })
        }
    })
});

app.put('/matches', function(req,res,next){
    let data = req.body;
    let matchID = parseInt(data.match_id);
    let deactivateMatch = `UPDATE Matches SET is_active = 0 WHERE match_id = ?`;
    // Run the 1st query
    db.pool.query(deactivateMatch, [matchID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }else{
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