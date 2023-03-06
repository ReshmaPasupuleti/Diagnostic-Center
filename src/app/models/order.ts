import { Test } from "./test";
import { Employee, Patient } from "./user";

export class Order {
    totalAmount!: Number;
    testSlots!: TestSlot[];
    payment!: Payment;
    patient!: Patient
}

export class TestSlot {
    status!: String;
    time!: Date;
    test!: Test;
    employee?: Employee;
    reportSent!: boolean;
}

export class Payment {
    cardOwner!: String;
    cardNumber!: String;
    expiry!: String;
}