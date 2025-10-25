import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Allow both structured and simple (multi-line string) addresses
const AddressSchema = new mongoose.Schema({
  full: { type: String }, // ✅ New multi-line address support
  label: { type: String, default: 'Home' },
  fullName: { type: String },
  phone: { type: String },
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String, default: 'India' },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String }, // ✅ added this line
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
