import Realm from "realm";

export class Employee extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  phone!: string;
  dailyWage!: number;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Employee',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      phone: 'string',
      dailyWage: 'int',
      createdAt: 'date',
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
  paymentId?: Realm.BSON.ObjectId;

  static schema = {
    name: "Attendance",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      employeeId: "objectId",
      date: "date",
      checkInTime: "date",
      checkOutTime: { type: "date", optional: true },
      paid: { type: "bool", default: false } as Realm.PropertySchema,
      paymentId: { type: "objectId", optional: true },
    } as const,
  };
}

export class Payment extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  employeeId!: Realm.BSON.ObjectId;
  amount!: number;
  date!: Date;
  note?: string;
  type!: string;
  attendanceIds?: Realm.BSON.ObjectId[];

  static schema = {
    name: "Payment",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      employeeId: "objectId",
      amount: "double",
      date: "date",
      note: { type: "string", optional: true },
      type: "string",
      attendanceIds: { type: "list", objectType: "objectId", optional: true },
    } as const,
  };
}

export const RealmConfig: Realm.Configuration = {
  schema: [Employee, Attendance, Payment],
  schemaVersion: 3,
  onMigration: (oldRealm: Realm, newRealm: Realm) => {
    if (oldRealm.schemaVersion < 3) {
      const oldAttendances = oldRealm.objects<Attendance>('Attendance');
      const newAttendances = newRealm.objects<Attendance>('Attendance');
      
      // Add new fields to existing attendance records
      for (const oldAttendance of oldAttendances) {
        const newAttendance = newAttendances.find((a: Attendance) => a._id === oldAttendance._id);
        if (newAttendance) {
          newAttendance.paymentId = undefined;
        }
      }

      const oldPayments = oldRealm.objects<Payment>('Payment');
      const newPayments = newRealm.objects<Payment>('Payment');
      
      // Add new fields to existing payment records
      for (const oldPayment of oldPayments) {
        const newPayment = newPayments.find((p: Payment) => p._id === oldPayment._id);
        if (newPayment) {
          newPayment.type = 'manual';
          newPayment.attendanceIds = [];
        }
      }
    }
  },
};
