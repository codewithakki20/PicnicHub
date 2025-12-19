
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './src/models/Blog.js';
import User from './src/models/User.js';

dotenv.config();

const blogs = [
    {
        title: "The Ultimate Picnic Guide for 2025",
        subtitle: "Everything you need for a perfect day out 🧺",
        excerpt: "Discover the best spots, essential gear, and delicious recipes for your next outdoor adventure.",
        content: `
# The Ultimate Picnic Guide for 2025

Picnicking is an art form. It's about finding that perfect balance between nature, food, and company. In this guide, we'll walk you through...

## 1. Choosing the Right Spot
Location is key. Look for:
- Shade coverage (very important!)
- Flat ground for comfortable seating
- Proximity to restrooms (but not too close!)

## 2. Essential Gear
Don't forget:
- A waterproof blanket
- Reusable cutlery
- Sunscreen and bug spray

## 3. The Menu
Keep it simple. Finger foods, fresh fruits, and refreshing drinks are your best friends.
        `,
        image: "https://images.unsplash.com/photo-1596707328601-26c79a49c669?q=80&w=2670&auto=format&fit=crop",
        category: "Guides",
        readTime: "5 min"
    },
    {
        title: "Top 10 Hidden Gem Spots in Bangalore",
        subtitle: "Escape the city noise without leaving it 🌳",
        excerpt: "Bangalore has more to offer than just Cubbon Park. Check out these secret serene locations.",
        content: "Content coming soon...",
        image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2670&auto=format&fit=crop",
        category: "Locations",
        readTime: "3 min"
    },
    {
        title: "5 Easy Sandwiches for Your Next Outing",
        subtitle: "Delicious, portable, and mess-free 🥪",
        excerpt: "Tired of soggy sandwiches? Here are 5 recipes that stay fresh and taste amazing outdoors.",
        content: "Content coming soon...",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2673&auto=format&fit=crop",
        category: "Food",
        readTime: "4 min"
    }
];

const seedBlogs = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is undefined. Check .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a real user to be the author
        const author = await User.findOne({});
        if (!author) {
            console.error('No users found. Please register a user first.');
            process.exit(1);
        }

        console.log(`Assigning blogs to author: ${author.name} (${author._id})`);

        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        const blogsWithAuthor = blogs.map(b => ({
            ...b,
            authorId: author._id,
            coverImage: b.image
        }));

        // Use loop to trigger pre('save') hooks for slug generation
        for (const blogData of blogsWithAuthor) {
            // Manual slug generation fallback
            const slug = blogData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const blog = new Blog({
                ...blogData,
                slug
            });
            await blog.save();
        }

        console.log('Seeded blogs successfully');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
};

seedBlogs();
