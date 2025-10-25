import mongoose from 'mongoose';

const AddressSnapshotSchema = new mongoose.Schema({
  label: String,
  fullName: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        foodName: { type: String, required: true }, // ✅ added
        price: { type: Number, required: true },    // ✅ added
        qty: { type: Number, default: 1, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'delivering', 'completed', 'cancelled'],
      default: 'pending',
    },
    address: { type: AddressSnapshotSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
