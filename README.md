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
- **POST** `/api/generate-listing` - Generates property listings using AI
- **POST** `/api/generate-neighborhood-guide` - Generates neighborhood guides using AI
- **GET** `/api/places` - Search for nearby restaurants, parks, landmarks, and other points of interest

### Google Places API Integration

The project includes a Google Places API integration for finding nearby amenities and attractions based on location.

#### Setup

1. **Get a Google Maps API Key**:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Places API
     - Geocoding API
   - Create credentials (API Key)
   - Restrict the API key to only the necessary APIs and your domain for security

2. **Environment Variables**:
   Add your Google Maps API key to your `.env.local` file:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

#### Usage

**GET** `/api/places` - Search for nearby places using query parameters.

**URL Parameters**:

- `location` (required): Address, zip code, or neighborhood name
- `radius` (optional): Search radius in meters (default: 5000)
- `types` (optional): Comma-separated list of place types (default: "restaurant,park,tourist_attraction")

**Example Request**:

```bash
GET /api/places?location=Manhattan&radius=10000&types=restaurant,museum
```

**Response**:

```json
{
  "success": true,
  "location": {
    "address": "Manhattan, New York, NY, USA",
    "coordinates": {
      "lat": 40.7831,
      "lng": -73.9712
    }
  },
  "places": [
    {
      "id": "place_id_here",
      "name": "Restaurant Name",
      "type": "restaurant",
      "rating": 4.5,
      "user_ratings_total": 150,
      "vicinity": "123 Main St, New York",
      "geometry": {
        "location": {
          "lat": 40.7831,
          "lng": -73.9712
        }
      },
      "photos": [...],
      "price_level": 2,
      "opening_hours": true,
      "types": ["restaurant", "food", "establishment"]
    }
  ],
  "total_count": 25,
  "radius_meters": 10000,
  "search_types": ["restaurant", "museum"]
}
```

**Available Place Types**:

- `restaurant` - Restaurants and food establishments
- `park` - Parks and recreational areas
- `tourist_attraction` - Landmarks and tourist destinations

**Testing with cURL**:

```bash
# Search for restaurants near a zip code
curl "http://localhost:3000/api/places?location=10001&types=restaurant&radius=3000"

# Search for parks and landmarks in a neighborhood
curl "http://localhost:3000/api/places?location=Brooklyn%20Heights&types=park,tourist_attraction&radius=5000"
```

**Why GET Method?**
This API follows REST principles by using **GET** for data retrieval:

- **GET**: Retrieve/search data (read-only operations)
- **POST**: Create new resources
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources

Since we're searching and retrieving place data (not creating, updating, or deleting anything), GET is the appropriate HTTP method.

### Zillow Listing Scraper

The project includes two API routes for scraping Zillow property listings:

#### 1. Basic Scraping (`/api/scrape-zillow`)

- **Purpose**: Basic web scraping using fetch and regex patterns
- **Features**:
  - No external dependencies required
  - Works immediately without setup
  - Limited data extraction capabilities
  - May be blocked by Zillow's anti-bot measures

#### 2. Advanced Scraping with Apify (`/api/scrape-zillow-apify`)

- **Purpose**: Advanced web scraping using Apify's web scraping tools
- **Features**:
  - Better data extraction with proper HTML parsing
  - Proxy rotation to avoid blocking
  - More reliable and comprehensive data
  - Falls back to basic scraping if Apify fails

#### Setup for Apify Scraping

1. Sign up at [Apify.com](https://apify.com)
2. Get your API token from Account Settings → Integrations → API tokens
3. Create or use a custom Zillow scraper actor
4. Add the following to your `.env.local` file:
   ```env
   APIFY_API_TOKEN=your_apify_api_token
   APIFY_ZILLOW_ACTOR_ID=your_zillow_scraper_actor_id
   ```

#### Usage Example

```bash
curl -X POST http://localhost:3000/api/scrape-zillow-apify \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.zillow.com/homedetails/7126-Naakea-St-Honolulu-HI-96825/622192_zpid/"}'
```

#### React Component

A ready-to-use React component is included at `src/components/ZillowScraper.tsx`:

```tsx
import ZillowScraper from "@/components/ZillowScraper";

export default function Page() {
  return <ZillowScraper />;
}
```

### Testing the API

You can test the API using curl or your browser:

```bash
# GET request
curl http://localhost:3000/api/hello

# POST request
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "message": "Hello!"}'
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
- **Apify** - Web scraping and automation (optional)

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
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key for Places API integration

Optional environment variables:

- `APIFY_API_TOKEN` - Your Apify API token for advanced Zillow scraping
- `APIFY_ZILLOW_ACTOR_ID` - Your custom Zillow scraper actor ID

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
