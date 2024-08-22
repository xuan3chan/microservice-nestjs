import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Admins extends Document {
  [x: string]: any;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  nameAdmin: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  userName: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], required: true })
  roleId: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  isBlock: boolean;

  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  adminId: string;
}

export type AdminsDocument = HydratedDocument<Admins>;

export const AdminsSchema = SchemaFactory.createForClass(Admins);

// Middleware to generate unique code before saving
AdminsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const model = this.constructor as mongoose.Model<AdminsDocument>;
    let count = await model.countDocuments();
    let newAdminId;
    let isUnique = false;

    while (!isUnique) {
      newAdminId = `NV${(count + 1).toString().padStart(2, '0')}`;
      const existingAdmin = await model.findOne({ adminId: newAdminId });
      if (!existingAdmin) {
        isUnique = true;
      } else {
        count++;
      }
    }

    this.adminId = newAdminId as string;
  }
  next();
});