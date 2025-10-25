# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-25

### Added
- Initial release of GeoPilot SDK
- React 18 compatibility with proper SSR support
- BlogFullScreen component for complete blog experience
- GEOPilotProvider for configuration management
- Comprehensive TypeScript support
- SEO optimization features
- Performance optimizations with lazy loading
- Responsive design for all devices
- Accessibility compliance (WCAG 2.1 AA)

### Fixed
- React 18 `createContext` compatibility issues
- SSR hydration mismatch problems
- Import/export compatibility with modern React
- Build configuration for npm publishing

### Changed
- Package name from `@geo-pilot/sdk` to `geo-pilot-sdk` for npm compatibility
- All React imports updated to use named imports instead of namespace imports
- Context creation updated for React 18 compatibility

### Technical Details
- **React**: 18.0.0+ required
- **Next.js**: 12.0.0+ supported
- **TypeScript**: Full type definitions included
- **Build**: Rollup with CommonJS and ESM outputs
- **Size**: ~417KB gzipped
