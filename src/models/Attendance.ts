import Realm from 'realm';

export class Attendance extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  employeeId!: Realm.BSON.ObjectId;
  date!: Date;
  paid!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Attendance',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      employeeId: 'objectId',
      date: 'date',
      paid: 'bool',
    },
  };
}
