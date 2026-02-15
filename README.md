# smart_bookmark_app
A simple and secure bookmark management application where users can sign in, create, edit, delete, and view bookmarks.
The app supports authentication, row-level security, and real-time updates across multiple tabs.

# Tech Stack

Frontend: Next.js, React, TypeScript

Backend / Auth / Database: Supabase

Styling: Tailwind CSS

Deployment: Vercel


# Project Setup
## Clone the repository
git clone https://github.com/prabhjeet13/smart_bookmark_app.git

cd smart_bookmark_app

cd frontend

## Install Dependencies

npm install

## Setup Environment Variables

NEXT_PUBLIC_SUPABASE_URL= --Your supabase project url--

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY= -- your supabase project key --

## Run your project

npm run dev

## Challenges faced

Handling authentication and real-time updates together.

I learned important Supabase concepts like sessions (to know if a user is logged in), 

auth state changes (to sync login/logout across tabs), 

and real-time channels (to update data instantly without refreshing).



# BOOKMARK MANAGER APP PHOTOS: 
## 1. SIGN IN
<img width="1899" height="955" alt="image" src="https://github.com/user-attachments/assets/68bb1617-c3ef-487a-a4e2-7736ba02aa8f" />

## 2. DASHBOARD
<img width="1899" height="905" alt="image" src="https://github.com/user-attachments/assets/bcb68481-3dd5-46e7-b7c4-ee824baa8bb0" />
