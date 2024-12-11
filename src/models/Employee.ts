import Realm from "realm";

export class Employee extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  phone!: string;
  dailyWage!: number;
  createdAt!: Date;

  static schema = {
    name: "Employee",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      phone: "string",
      dailyWage: "int",
      createdAt: "date",
    },
  };
}

export class Attendance extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  employeeId!: Realm.BSON.ObjectId;
  date!: Date;
  checkInTime!: Date;
  checkOutTime?: Date;
  paid!: boolean;

  static schema = {
    name: "Attendance",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      employeeId: "objectId",
      date: "date",
      checkInTime: "date",
      checkOutTime: "date?",
      paid: { type: "bool", default: false },
    },
  };
}

export const RealmConfig = {
  schema: [Employee, Attendance],
  schemaVersion: 1,
};
