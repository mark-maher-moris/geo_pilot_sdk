# Landing Test - Geo Pilot SDK Integration

This is a Next.js application that demonstrates the integration of the Geo Pilot SDK with the BlogFullScreen component.

## Real API Testing

This example is configured to test with real API endpoints using the following credentials:

```env
NEXT_PUBLIC_GEO_PILOT_PROJECT_ID=LSZgnu18FMTahov29GNUbipw3AHOVcjq
NEXT_PUBLIC_GEO_PILOT_SECRET_KEY=MAzzczyx9dRRRarhE7fy
```

### Features Demonstrated

- **Real API Integration**: Connects to live backend endpoints
- **BlogFullScreen Component**: Complete blog interface with search, pagination, and post viewing
- **Error Handling**: Graceful fallback to mock data when API is unavailable
- **SEO Optimization**: Built-in SEO features with real metadata

## Features

- **BlogFullScreen Component**: A complete blog interface with search, pagination, and post viewing
- **Geo Pilot SDK**: Advanced geospatial blog and content management system
- **Next.js 16**: Modern React framework with TypeScript support
- **Tailwind CSS**: Utility-first CSS framework for styling

## Installation

The project is already set up with the Geo Pilot SDK installed:

```bash
npm install geo-pilot-sdk
```

## Usage

The application uses the `BlogFullScreen` component from the Geo Pilot SDK, which provides:

- **Blog List View**: Grid layout with search and pagination
- **Individual Post View**: Full post reading experience
- **SEO Optimization**: Built-in SEO features
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized loading and caching

## Configuration

The SDK is configured in two places:

1. **Layout Provider** (`src/app/layout.tsx`): Wraps the entire app with `GEOPilotProvider`
2. **Main Component** (`src/app/page.tsx`): Uses `BlogFullScreen` with custom configuration

## Key Components

- `GEOPilotProvider`: Context provider for SDK configuration
- `BlogFullScreen`: Main blog interface component
- Configuration includes theme, SEO, and geo settings

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## SDK Features Used

- **Blog Management**:** Complete blog post listing and viewing
- **Search & Filtering**: Built-in search functionality
- **SEO**: Automatic SEO optimization
- **Performance**: Lazy loading and caching
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG compliant components

## Configuration Options

The SDK supports extensive configuration through the `config` prop:

- **Theme**: Layout, colors, typography
- **SEO**: Meta tags, structured data, social sharing
- **Geo**: Location-based features and translations
- **Performance**: Caching, lazy loading, optimization

## API Integration

The SDK automatically handles:
- Blog post fetching
- Metadata retrieval
- Search functionality
- Pagination
- Error handling
- Loading states

## Customization

The BlogFullScreen component is highly customizable through the backend dashboard configuration, allowing for:
- Custom themes and layouts
- Branding options
- CTA buttons
- Social sharing
- Analytics integration

## Production Deployment

For production deployment, ensure you have:
- Valid project credentials
- Proper API endpoints configured
- SEO settings optimized
- Performance monitoring enabled

## Support

For SDK documentation and support, visit:
- [NPM Package](https://www.npmjs.com/package/geo-pilot-sdk)
- [GitHub Repository](https://github.com/mark-maher-moris/geo_pilot_sdk)
- [Documentation](https://geopilot.buildagon.com)