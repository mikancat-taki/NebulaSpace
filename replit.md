# Overview

This is a modern full-stack web application built with React (client) and Express.js (server) that provides a comprehensive communication and productivity platform. The application features real-time chat with WebSocket connections, voice/video calling capabilities, memo management, and a virtual keyboard. It uses a Japanese-themed UI with a nature-inspired glassmorphism design and supports both desktop and mobile interfaces.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and glassmorphism effects
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket client for chat and WebRTC for voice/video calls

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Features**: WebSocket server for chat messaging and user presence
- **Development**: Hot module replacement with Vite middleware in development
- **Session Management**: PostgreSQL-based session storage

## Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle with schema-first approach
- **Schema Design**: 
  - Users table with online status tracking
  - Messages table with channel support
  - Memos table for personal note-taking
- **In-Memory Fallback**: Memory storage implementation for development/testing

## Authentication and Authorization
- **Session-based Authentication**: Uses connect-pg-simple for PostgreSQL session storage
- **User Management**: Username/password system with unique constraints
- **Online Status**: Real-time tracking of user presence via WebSocket connections

## External Dependencies
- **Database Provider**: Neon Database (PostgreSQL as a service)
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom theme configuration
- **Development Tools**: 
  - Replit integration for cloud development
  - ESBuild for server bundling
  - TypeScript for type safety
- **WebRTC**: Browser-native APIs for voice/video communication
- **Font**: Google Fonts (Noto Sans JP) for Japanese character support

The application follows a monorepo structure with shared schema definitions and type-safe API communication between client and server components.