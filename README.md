# Velo

A task management app that helps you organize and schedule your tasks efficiently.

## Setup

1. Clone the repository
2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase and OpenAI credentials:
   ```bash
   # Frontend (Supabase)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Backend (LLM Integration)
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional: Redis for rate limiting
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

## Development

To start the development server:
```bash
npx expo start
```

## Environment Variables

The following environment variables are required:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

Get these credentials from your Supabase project dashboard.

# Expo Router Example

Use [`expo-router`](https://docs.expo.dev/router/introduction/) to build native navigation using files in the `app/` directory.

## 🚀 How to use

```sh
npx create-expo-app -e with-router
```

## 📝 Notes

- [Expo Router: Docs](https://docs.expo.dev/router/introduction/)
