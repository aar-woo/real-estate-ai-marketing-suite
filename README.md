# Real Estate AI Marketing Suite

A Next.js 14 project with TypeScript and TailwindCSS configured, including API routes support.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **TailwindCSS** for styling
- ✅ **API Routes** support
- ✅ **ESLint** configuration
- ✅ **Turbopack** for fast development

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd real-estate-ai-marketing-suite
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   └── hello/     # Example API endpoint
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components (create as needed)
└── lib/              # Utility functions (create as needed)
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

The project includes API routes support. Example API endpoints:

- **GET** `/api/hello` - Returns a greeting message
- **POST** `/api/hello` - Accepts JSON data and returns it with metadata
- **POST** `/api/generate-content` - Generates property descriptions and PDFs using AI

### Testing the API

You can test the API using curl or your browser:

```bash
# GET request
curl http://localhost:3000/api/hello

# POST request
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "message": "Hello!"}'

# Generate property content
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "propertyDetails": {
      "address": "123 Main St, City, State",
      "price": "$450,000",
      "bedrooms": 3,
      "bathrooms": 2,
      "sqft": 1800,
      "features": ["Updated kitchen", "Hardwood floors", "Fenced yard"]
    },
    "generatePDF": true
  }'
```

## Technologies Used

- **Next.js 15.4.6** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **ESLint** - Code linting
- **OpenAI** - AI content generation
- **Supabase** - Authentication and database
- **PDF-lib** - PDF generation
- **Stripe** - Payment processing

## Environment Setup

Copy the environment template and configure your API keys:

```bash
cp env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

## Development

### Adding New API Routes

Create new API routes in the `src/app/api/` directory:

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ users: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "User created", data: body });
}
```

### Adding New Pages

Create new pages in the `src/app/` directory:

```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4">This is the about page.</p>
    </div>
  );
}
```

## Deployment

This project can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
