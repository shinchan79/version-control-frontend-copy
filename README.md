# Content Version System Frontend

A Next.js frontend application for managing content versions with features like version control, tagging, and preview functionality.

## Features

- Create and manage content versions
- Version comparison and diff view
- Tag management system
- Preview versions in modal or new tab
- Publish/Unpublish versions
- Revert to previous versions
- Responsive design with modern UI

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **HTTP Client**: Native fetch API
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd content-version-system/version-control-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE=https://content-version-system.sycu-lee.workers.dev/
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── PreviewModal.tsx  # Version preview component
│   └── VersionControl.tsx # Main version control component
├── lib/                  # Utilities and API functions
├── types/                # TypeScript type definitions
└── config.ts            # Application configuration
```

## API Integration

The frontend communicates with a Cloudflare Workers backend API. Key endpoints:

- `GET /content/default/versions` - List all versions
- `POST /content` - Create new version
- `GET /content/default/versions/:id` - Get specific version
- `POST /content/default/versions/:id/publish` - Publish version
- `POST /content/default/revert` - Revert to previous version

## Deployment

This application is deployed on Cloudflare Pages.

### Deployment Configuration

1. Build command: `npm run build`
2. Build output directory: `.next`
3. Environment variables:
   - `NODE_VERSION`: 18
   - `NEXT_PUBLIC_API_BASE`: API endpoint URL

### Manual Deployment Steps

1. Push changes to the main branch
2. Cloudflare Pages will automatically build and deploy
3. Monitor deployment status in Cloudflare Dashboard

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request