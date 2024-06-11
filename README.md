Citations:
In our users.hbs file
Lines 3 to 17 of users.hbs are not our original work. The scripts are used to enable
a jquery plugin named Chosen from Harvest. The link contains details on the plugin: https://harvesthq.github.io/chosen/
This link contains details on teh provider (Harvest): https://www.getharvest.com/--}}
last updated 6/10/2024

In our top-nav.css file:
The css in top-nav.css was inspired by Harvard's Brand and Style Guide.
However the code was orginal and written to use similar methods as
described in the Harvard Business School Navigation Styleguide.
The guide can be viewed here: 
https://www.hbs.edu/marketing/web-development/desktop/navigation.html
last updated 6/10/2024

The following files app.js, 
all the files in the views folder: view/layouts/main.hbs, adoptions.hbs, breed.hbs, dogs.hbs, dogs_has_users.hbs, index.hbs, matches.hbs, shelters.hbs, users.hbs
and all the files in public/js folder: add-breed.js, add_dogs_has_users.js, add_match.js, add_shelter, add_user.js, delete_adoption, delete_breed.js, delete_dog.js, delete_dogs_has_users.js, delete.match.js, delete_shelter.js, delete_user.js, reactivate_shelter.js, update_breed.js, update_dog.js, update_shelter.js and update_user.js
are modules adapted from the CS340 starter code with significant changes for enhanced functionality
The starter code can be found here:
https://github.com/osu-cs340-ecampus/nodejs-starter-app
all files last updated 6/10/2024

Project Outline and Database Outline: 
However, we identified some issues during normalization and made the following changes:
We added a shelter name as an attribute to the shelters entity. This is relevant information we should capture.
We removed the max holding time and kill shelter attributes from the shelters entity. We have decided to no longer display results based on the remaining lifespan of the dog, as this makes the application more dark and may lead to less users
We added an is_active attribute to the users and dogs entity. This will be changed when a user or dog deletes their account so that we can retain their information while stopping that information from continuing to be displayed.
We added a separate primary key for the dogs_has_users entity. This should make queries more efficient.
We added a source attribute to the dogs_has_users interchange table to track who initiated the “like” and ensure that users and dogs do not see dogs or users that they have already liked.
We replaced the location attribute with street_address, postal_code, city, and state attributes in the users and shelters entity. We now plan to use an API to geocode locations as needed.
We changed the phone attribute in the users entity to a varchar(255) data type to meet best practices for storing phone numbers.

Overview
The state of Idaho currently has just over 3000 dogs in its animal shelters. Adopters often struggle to find the best dog for their living situation, and dogs that need a forever home are often adopted and returned. More concerning, shelter capacity is at an all time high while adoption rates have decreased by 12% from pandemic levels. Our database driven website will bring new attention to dogs in Idaho animal shelters and create matches with owners that can meet their needs. 
The success of apps like Tinder and Bumble demonstrate the ability for quick matchmaking sites to increase visibility and lead to meaningful relationships. Why not build a similar site for dogs in need? Our website will provide an interface for the 20,000 potential dog owners in the state of Idaho to learn about pets that are up for adoption. It will provide details about each dog and its needs so that users can make informed decisions before bringing home a new family-member.
Users will create a profile. Each user profile stores the user's preferences and info in the users table. Users will swipe through the profiles of adoptable dogs. While swiping, users will be presented with relevant info about each dog using data stored in the dogs table and the breeds table. Based on this information, users can “like” specific dogs as they swipe. This “like” will be stored in the dogs_has_users table. Once a dog is “liked”, the shelter currently holding the dog will receive the details of the matched user. If an animal shelter worker reciprocates the “like” on behalf of the dog, then this will also be stored in the dogs_has_users table and a match will be created and stored in the matches table. If the shelter approves of the match, they can choose to follow up with the user and begin the adoption process. If the dog is adopted, whether by a user or outside party, then the adoption event is recorded and the dog is removed from the dogs table. This provides shelters with more options for their dogs, so dogs that receive many matches can go to the best homes for their specific needs.




