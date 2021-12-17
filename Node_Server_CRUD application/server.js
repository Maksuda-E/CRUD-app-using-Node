//Require express
const { json } = require("body-parser");
var express = require("express");
//Requite fs to create file
const fs = require('fs');
//Require Customer class
var Customer = require("./customer");

//Create global customer's array
let customersArray = [];
//defie app variable to create the customer application
var app = express();
//parse application
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

//node will use 3000 port to run the server
var port = process.env.PORT || 3000;

//define the entry point for the web app
//Render the existing index.html page using the server
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

//handle a POST request to search for customers
app.post("/api/findCustomerByID", (request, response) => {
	//set a default result or message
	var result = "Customer Id not found, please search with a valid id: " + request.body.ID;
    var found = false;
    /*use if statement to check the existence of added customer's json file and find info accoding
    to the id */
	if (doesUserExists(request.body.ID)) {
		found = true;
		const fs = require('fs')
		const path = './data/' + request.body.ID + '.txt'
		fs.readFile(path, 'utf8', function (err, data) {
			if (err) throw err;
			response.json(data);
			console.log(data)
		});

    }
    //if not found 
	if (!found) {
		response.status(404).json(result);
		return;
	}
	
});

//handle a POST request to add the customers info
app.post("/api/addCustomer", (request, response) => {
	//create an object based on customer class
	var myCustomer = new Customer(
		request.body.firstName,
		request.body.lastName,
		request.body.address,
		request.body.city,
		request.body.province,
		request.body.postal,
		request.body.ID
	);

	//before adding customer check that it is not already into the array.
	let found = false;
	for (var i = 0; i < customersArray.length; i++) {
		if (customersArray[i].ID == request.body.ID) {
			found = true;
			result = customersArray[i];
			break;
		}
	}
	if (doesUserExists(request.body.ID)) {
		found = true;
	}
	if (found) {
		response.json("Customers already exists with this id, please use new id!");
		return;
	}

	//if the above conditions are fulfilled then new customer info can be added
	customersArray.push(myCustomer);
	response.json("Customer information is added successfully!");
	let myCustomerObj = {
		firstName: myCustomer.firstName,
		lastName: myCustomer.lastName,
		address: myCustomer.address,
		city: myCustomer.city,
		province: myCustomer.province,
		postal: myCustomer.postal,
		ID: myCustomer.ID

    }
    //create json.txt file for the new customer using id
	let fileName = './data/' + myCustomerObj.ID + '.txt'
	createFile(fileName, myCustomerObj)

});

// Create a function to build the json file to store the customer's data
function createFile(fileName, data) {
	const fs = require('fs');
	console.log(data)
	var jsonObj = data;
	console.log(jsonObj);
	var jsonContent = JSON.stringify(jsonObj);

	fs.writeFile(fileName, jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

	});
}
//handle a POST request to update the customers info
app.post("/api/updateCustomer", (request, response) => {
	var myCustomer = new Customer(
		request.body.firstName,
		request.body.lastName,
		request.body.address,
		request.body.city,
		request.body.province,
		request.body.postal,
		request.body.ID
	);

	//before adding customer make sure it not already inside the array.
	let found = false;
	response.json("Updated customer information successfully!");
	let myCustomerObj = {
		firstName: request.body.firstName,
		lastName: request.body.lastName,
		address: request.body.address,
		city: request.body.city,
		province: request.body.province,
		postal: request.body.postal,
		ID: request.body.ID
    }
    /* update json.txt file for the new customer using id*/
	let fileName = './data/' + myCustomerObj.ID + '.txt' 
	createFile(fileName, myCustomerObj) //call createFile function
});

app.get("/tst", (request, response) => {
	response.json("searching for customer by id is working");
});

//handle a POST request to delete the customers info
app.post("/api/deleteCustomer/", (request, response) => {
	var fs = require('fs');
	let customerId = request.body.customerID;
    let fileName = './data/' + customerId + '.txt';
    //delete customer info if no error found
	try {
		fs.unlinkSync(fileName);
        response.json("Customer information has been deleted successfully!");
        //if error found
	} catch (err) {
		console.error(err)
		response.json("Failed to delete customer information!");
	}


});

/*create this function to check the json.txt file is created for the exist customer or not
If file is already created new file will not create for the same id and catch error*/
function doesUserExists(customerId) {
	const fs = require('fs')
	const path = './data/' + customerId + '.txt'

	try {
		if (fs.existsSync(path)) {
			return true;
		}
	} catch (err) {
		return false;
	}
}
app.listen(port);
console.log("listening on port: ", port);