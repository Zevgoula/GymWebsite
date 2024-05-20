
exports.Anhkei = function (username, gym_id) {
    this.username = username
    this.gym_id = gym_id
}

exports.Books = function (book_id, day, time, class_id, customer_id) {
    this.book_id = book_id
    this.day = day
    this.time = time
    this.class_id = class_id
    this.customer_id = customer_id
}

exports.Class = function (class_id, name, bookability, day, time, location, room_capacity) {
    this.class_id = class_id
    this.name = name
    this.bookability = bookability
    this.day = day
    this.time = time
    this.location = location
    this.room_capacity = room_capacity
}

exports.Customer = function (customer_id, username, fname, lname, email, phone_number, gender, height, weight, date_joined, date_of_birth) {
    this.customer_id = customer_id
    this.username = username
    this.fname = fname
    this.lname = lname
    this.email = email
    this.phone_number = phone_number
    this.gender = gender
    this.height = height
    this.weight = weight
    this.date_joined = date_joined
    this.date_of_birth = date_of_birth
}

exports.Gym = function (gym_id, phone_number, city, street, street_number) {
    this.gym_id = gym_id
    this.phone_number = phone_number
    this.city = city
    this.street = street
    this.street_number = street_number
}

exports.Includes = function (gym_id, membership_id) {
    this.gym_id = gym_id
    this.membership_id = membership_id
}

exports.Membership = function (membership_id, monthly_cost, description, date_created) {
    this.membership_id = membership_id
    this.monthly_cost = monthly_cost
    this.description = description
    this.date_created = date_created
}

exports.Offers = function (membership_id, class_id) {
    this.membership_id = membership_id
    this.class_id = class_id
}

exports.Selects = function (customer_id, membership_id) {
    this.customer_id = customer_id
    this.membership_id = membership_id
}

exports.Supervises = function (trainer_id, class_id) {
    this.trainer_id = trainer_id
    this.class_id = class_id
}

exports.Trainer = function (trainer_id, date_of_birth, no_of_clients, experience, bookability, fname, lname, email, phone_number) {
    this.trainer_id = trainer_id
    this.date_of_birth = date_of_birth
    this.no_of_clients = no_of_clients
    this.experience = experience
    this.bookability = bookability
    this.fname = fname
    this.lname = lname
    this.email = email
    this.phone_number = phone_number
}

exports.User = function (username, password, role) {
    this.username = username
    this.password = password
    this.role = role
}


