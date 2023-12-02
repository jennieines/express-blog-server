// require express
const express = require('express');
//require cors
const cors = require('cors');

//create express app
const app = express();

//middleware: intermediate functions that we want 
//to run in between the request and the response.

//enable CORS requests
app.use(cors());

//middleware: logging the request
app.use((req, res, next) => {
    //Examples: req.method: get, post, put, delete, req.url: /api/users
    console.log(`${req.method} ${req.url}`);
    //next() is a function that we call to move on to the next middleware
    next();
})

//middleware: parsing JSON request body
//next() is built in because this is a built in express middleware
app.use(express.json());

//memory array to simulate database functionality
let blogPosts = [
{ id: 1, title: "First Post", content: "This is my first post", comments: []},
{ id: 2, title: "Second Post", content: "This is my second post", comments: []},
{ id: 3, title: "Third Post", content: "This is my third post", comments: []}
]

//CRUD functionality: Create, Read, Update, Delete

//Read: GET request for home route to send back text
//"Welcome to My Blog"
app.get('/', (req, res) => {
    res.send("Welcome to My Blog");
})


//Read: GET request route handler to return all blog posts
app.get('/posts', (req, res) => {
    //attaches the blogPosts array to the response object as a JSON object
    res.json(blogPosts)
}) 

//Create: POST request route handler to create a new blog post
app.post('/posts', (req, res) => {
    //create new blog post object
    //id is current time when request is recieved, ...req.body is the request
    //contain the content of the blog post
    const newPost = { ...req.body };
    //add new blog post to the blogPosts array
    blogPosts.push(newPost);
    //send back the new blog post as a JSON object
    //along with a status code indicating that the request was successful
     res.status(201).json(newPost);
})

//Update: PUT request route handler to update a blog post
//use : in route to indicate a variable (route parameter) eg: /posts/27
app.put('/posts/:id', (req, res) => {
//extract id from request params object using destructuring 
const { id } = req.params;
//find the index of the blog post in the blogPosts array with matching id
let index = blogPosts.findIndex(post => post.id === Number(id));
//if findIndex doesn't find what you're looking for, it returns -1
if (index !== -1) {
    //update the blog post at that index with the new information
    //the blog post at the index should be updated to be a new
    //object that has all of the same data as the original blog post,
    //but with whatever data was sent in the request overwriting old data
    blogPosts[index] = {...blogPosts[index], ...req.body};
    //send back the new, updated blog post
    res.json(blogPosts[index]);
} else {
    //if blog post with matching id not found
    //send 404 status
    res.status(404).send("Post not found");
}
});

//Delete: DELETE request route handler to delete a blog post
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params; 
    //use filter method, if blog posts id does NOT match id param,
    // it stays. if it does, it gets removed (filtered out) of the array
    blogPosts = blogPosts.filter(post => post.id !== Number(id));
    res.status(204).send();
})

//start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}.`);
})