# Manager Moudir

A React Native mobile application built with Expo for managing employees and their daily wages. Designed for business owners and managers to efficiently track workforce and wages.

## Features

- **Employee Management**
  - Add, edit, and archive employees
  - Store personal and contact information
  - Manage salary rates and payment history

- **Wage Tracking**
  - Calculate daily wages
  - Track payments
  - View payment history

- **User Experience**
  - Intuitive interface
  - Dark/Light theme support
  - Multi-language support
  - Customizable views

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- iOS Simulator (for iOS) or Android Studio (for Android)
- Expo Go app (optional, for testing on physical devices)
- Git for version control

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd manager-moudir
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:

```bash
npx expo start
```

## Development Guide

### Project Structure
```
/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # Home screen (Employees)
│   │   └── settings.tsx   # App settings
│   ├── modals/            # Modal screens
│   ├── _layout.tsx        # Root layout configuration
│   └── index.tsx          # Entry point
├── assets/                # Static assets
├── components/            # Reusable UI components
│   ├── employee/         # Employee-related components
│   ├── forms/            # Form components
│   └── ui/               # Generic UI components
├── constants/             # App constants and configuration
├── hooks/                # Custom React hooks
├── models/               # Realm database models
├── services/             # Business logic and API services
└── utils/                # Helper functions
```

### Key Technologies

- **Expo**: Framework and platform for React Native
- **React Navigation**: Navigation library
- **Realm**: Local database for offline-first functionality
- **TypeScript**: Type-safe JavaScript
- **date-fns**: Date utility library

### Development Workflow

1. **Branch Naming Convention**
   - Features: `feature/employee-list`
   - Bugfixes: `fix/wage-calculation`
   - Hotfixes: `hotfix/crash-on-save`

2. **Commit Messages**
   Follow conventional commits:
   ```
   feat(employees): add search and filter functionality
   fix(wages): correct overtime calculation
   docs(readme): update installation steps
   ```

3. **Pull Request Process**
   - Create branch from `main`
   - Update relevant documentation
   - Add/update tests
   - Submit PR with clear description
   - Request review from team members

### Common Commands

```bash
# Start development server
npx expo start

# Platform specific
npx expo start --ios
npx expo start --android
npx expo start --web

# Testing
npm test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run typecheck

# Build for production
eas build --platform ios
eas build --platform android
```

### Environment Setup

1. **iOS Development**
   - Install Xcode 14 or later
   - Set up iOS Simulator
   - Install CocoaPods
   ```bash
   sudo gem install cocoapods
   ```

2. **Android Development**
   - Install Android Studio
   - Set up Android Emulator (API 31+)
   - Configure ANDROID_HOME
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   ```

### Testing

- **Unit Tests**: Jest and React Native Testing Library
- **Integration Tests**: Detox
- **Component Tests**: Storybook
- Run tests with: `npm test`

### Style Guide

- Use TypeScript for all new code
- Follow ESLint and Prettier configuration
- Use functional components and React hooks
- Follow atomic design principles for components
- Document complex functions and components

### Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Realm Documentation](https://www.mongodb.com/docs/realm/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Navigation Documentation](https://reactnavigation.org/)

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support:
1. Check [Common Issues](docs/TROUBLESHOOTING.md)
2. Search existing GitHub issues
3. Create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/logs
4. Contact the maintainers
