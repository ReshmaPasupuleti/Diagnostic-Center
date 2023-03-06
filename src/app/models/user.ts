export class Patient {
    name!: String;
    email!: String;
    password!: String;
    mobileNumber!: Number;
    address!: Address[];
}
export class Employee {
    name!: String;
    email!: String;
    password!: String;
    mobileNumber!: Number;
    address!: Address;
}

export class Address {
    firstLine!: String;
    secondLine!: String;
    city!: String;
    state!: String;
    country!: String;
    zip!: Number;
}