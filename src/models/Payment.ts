import Realm from 'realm';

export class Payment extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  employeeId!: Realm.BSON.ObjectId;
  amount!: number;
  date!: Date;
  note?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Payment',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      employeeId: 'objectId',
      amount: 'int',
      date: 'date',
      note: 'string?',
    },
  };
}
