//define customer class and define a constructor inside the class for customer's objects
class Customer {
    constructor(firstName, lastName, address, city, province, postal, ID) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.city = city;
      this.province = province;
      this.postal = postal;
      this.ID = ID;
    }
  
    //retun all the customer's info by using the following objects
    getFullInfo() {
      return `${this.firstName} ${this.lastName} ${this.address} ${this.city} 
      ${this.province} ${this.postal}`;
    }
  
    //return all the info by using the following objects and  the customer id
    getFullInfoWithID() {
      return `${this.firstName} ${this.lastName}
      ${this.address} ${this.city} ${this.province} ${this.postal} #${this.ID}`;
    }
  }
  
  module.exports = Customer;