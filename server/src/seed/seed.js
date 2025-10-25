import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Food from '../models/Food.js';
import User from '../models/User.js';

dotenv.config();
await connectDB();

await User.deleteMany({});
await Food.deleteMany({});

await User.create({
  name:'Admin',
  email:'admin@eats.local',
  password:'admin123',
  role:'admin'
});

await Food.insertMany([
  { name:'Margherita Pizza', description:'Classic cheese & tomato', price:299, image:'/pizza1.jpg', category:'Pizza' },
  { name:'Veg Burger', description:'Crispy patty with lettuce', price:149, image:'/burger1.jpg', category:'Burger' },
  { name:'Paneer Wrap', description:'Spiced paneer & veggies', price:199, image:'/Wrap' },
  { name:'Masala Dosa', description:'South Indian special', price:159, image:'/dosa.jpg', category:'South Indian' },
  { name:'Gulab Jamun', description:'Sweet dessert', price:99, image:'/gulab.jpg', category:'Dessert' }
]);

console.log('Seed complete');
process.exit(0);
