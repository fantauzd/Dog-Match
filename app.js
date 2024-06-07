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
    insertUsers = `INSERT INTO USERS (username, phone, email, birthdate, home_type, street_address, city, postal_code,
        state, activity_preference, shedding_preference, training_preference, size_preference, has_children,
        has_dog, has_cat, is_active) VALUES ('${data.username}', '${data.phone}', '${data.email}', '${data.birthdate}', '${data.home_type}',
        '${data.street_address}', '${data.city}', '${data.postal_code}', '${data.state}', '${data.activity_preference}',
        '${data.shedding_preference}', '${data.training_preference}', '${data.size_preference}', '${data.has_children}',
        '${data.has_dog}', '${data.has_cat}', '${data.is_active}')`;

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


app.delete('/users', function(req,res,next){
    let data = req.body;
    let userID = parseInt(data.user_id);
    let deactivateUser = `UPDATE Users SET is_active = 0 WHERE user_id = '${userID}';`;
    let deactivateMatches = `UPDATE Matches SET is active = 0 WHERE user_id = '${userID}';`;
    
    
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
                    res.sendStatus(204);
                }
            })
        }
    })
});


app.put('/breeds', function(req,res,next){
    let data = req.body;
    
    let user_id = parseInt(data.user_id);
    
    let home_type = parseInt(data.home_type);
    if (isNaN(home_type))
    {
        home_type = 'NULL'
    }

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

    let size_preference = parseInt(data.size_preference);
    if (isNaN(size_preference))
    {
        size_preference = 'NULL'
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
    
    let updateUserQuery = `UPDATE Users SET username = '${data.username}', phone = '${data.phone}', email = '${data.email}', 
    birthdate = '${data.birthdate}', home_type = '${home_type}', street_address = '${data.street_address}', 
    city = '${data.city}', postal_code = '${data.postal_code}', state = '${data.state}', 
    activity_preference = '${activity_preference}', shedding_preference = '${shedding_preference}', 
    training_preference = '${training_preference}', size_preference = '${size_preference}', has_children = '${has_children}', 
    has_dog = '${has_dog}', has_cat = '${has_cat}' WHERE user_id = '${data.user_id}';`;

    // Run the 1st query
    db.pool.query(updateUserQuery,  function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
             res.sendStatus(204);
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
    let source = parse(data.source);
    // if (source == "NULL")
    // {
    //     popup.alert({
    //         content: 'Please select a Source to add a "like".'
    //     })
    // }

    // Create the query and run it on the database
    addDogs_has_users = `INSERT INTO Dogs_has_users (dogs_dog_id, users_user_id, source) VALUES ('${data.dogs_dog_id}', '${data.users_user_id}', '${source}')`;

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
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/dogs_has_users', function(req,res,next){
    let data = req.body;
    let dogs_has_usersID = parseInt(data.dogs_has_users_id);
    let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
    let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteBsg_People, [personID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});


  
// Dogs
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
                }
            })
        }
    })
});

app.delete('/delete-shelter/', function(req, res, next) {
    let data = req.body;
    let shelterID = parseInt(data.id);
    let deleteAdoptions = `DELETE FROM Adoptions WHERE shelter_id = ?`;
    let deleteShelter = `DELETE FROM Shelters WHERE shelter_id = ?`;

    db.pool.query(deleteAdoptions, [shelterID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        
        db.pool.query(deleteShelter, [shelterID], function(error, rows, fields) {
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
    
    let shelter_id = parseInt(data.shelter_id);
    if (isNaN(shelter_id)) {
        res.sendStatus(400);
        return;
    }

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

    let updateShelterQuery = `UPDATE Shelters SET name = '${name}', email = '${email}', street_address = '${street_address}', city = '${city}', postal_code = '${postal_code}', state = '${state}' WHERE shelter_id = '${shelter_id}'`;
    
    // Run the query
    db.pool.query(updateShelterQuery, function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});