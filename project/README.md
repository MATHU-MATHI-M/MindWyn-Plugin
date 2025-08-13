# MindWyn - Digital Wellness Companion

MindWyn is a cross-platform Progressive Web Application (PWA) designed to help students and digital users maintain emotional well-being and manage stress during their online activities.

## 🌟 Features

### Core Functionality
- **Mood Tracking**: Daily mood, energy, and stress level monitoring
- **Behavioral Analysis**: Local ML-powered detection of usage patterns
- **Smart Interventions**: Breathing exercises, mindfulness prompts, and wellness notifications
- **Privacy-First**: All data processing happens locally on your device
- **Cross-Platform**: Works on web browsers and can be installed as a mobile app

### Technical Features
- Progressive Web App (PWA) with offline support
- Capacitor-ready for native mobile deployment
- Local storage with data export functionality
- Responsive design optimized for mobile and desktop
- Real-time behavioral pattern detection

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with PWA support

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/mindwyn.git
cd mindwyn

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Mobile Deployment with Capacitor
```bash
# Add Capacitor platforms
npm run build
npx cap add android
npx cap add ios

# Sync and open in native IDEs
npx cap sync
npx cap open android
npx cap open ios
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin
- **Mobile**: Capacitor
- **ML**: TensorFlow.js (planned)

### Key Components
- `MoodTracker`: Daily mood and activity logging
- `WellnessDashboard`: Analytics and insights visualization
- `BreathingExercise`: Guided breathing sessions
- `BehavioralTracking`: Usage pattern analysis
- `WellnessNotifications`: Smart intervention system

## 📱 Usage

### Daily Mood Tracking
1. Navigate to the Mood tab
2. Rate your mood, energy, and stress levels (1-5 scale)
3. Select current activities
4. Add optional notes
5. Submit to track your wellness trends

### Breathing Exercises
1. Go to the Breathing tab
2. Click "Start" to begin a guided 4-4-6 breathing exercise
3. Follow the visual cues and instructions
4. Complete 5 cycles for optimal stress relief

### Analytics Dashboard
- View weekly mood trends
- Monitor stress levels and usage patterns
- Get personalized wellness insights
- Track active time and digital wellness metrics

### Settings & Privacy
- Configure intervention triggers and types
- Export your data for backup
- All data remains on your device

## 🔒 Privacy & Security

MindWyn is built with privacy-first principles:
- **Local Data Storage**: All information stays on your device
- **No External Servers**: No data transmission to third parties
- **Behavioral Analysis**: Pattern detection happens locally
- **Data Export**: Full control over your wellness data
- **GDPR Compliant**: No tracking or external analytics

## 🎯 Wellness Interventions

### Trigger Conditions
- High stress levels (configurable threshold)
- Extended periods of inactivity
- Late-night usage patterns
- Rapid tab switching (attention fragmentation)

### Intervention Types
- **Breathing Exercises**: Guided 4-4-6 breathing patterns
- **Mindfulness Prompts**: Quick reflection questions
- **Movement Breaks**: Gentle stretch reminders
- **Sound Therapy**: Optional relaxation audio (coming soon)

## 🚀 Deployment

### Web Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### PWA Installation
Users can install MindWyn directly from their browser:
1. Visit the web app
2. Look for the "Install" prompt or use browser menu
3. Add to home screen for app-like experience

### Mobile App Stores
```bash
# Build for production
npm run build

# Generate native apps
npx cap sync

# Android
npx cap open android
# Build signed APK in Android Studio

# iOS
npx cap open ios
# Build and submit through Xcode
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── App.tsx             # Main application
```

### Key Hooks
- `useLocalStorage`: Persistent local data management
- `useBehavioralTracking`: Real-time usage pattern analysis

### Adding New Features
1. Create component in `src/components/`
2. Add type definitions in `src/types/`
3. Implement hooks for data management
4. Update navigation and routing

## 📊 Behavioral Analysis

MindWyn analyzes these behavioral signals:
- **Tab Switching Frequency**: Indicator of attention fragmentation
- **Active vs. Idle Time**: Work-life balance monitoring
- **Usage Patterns**: Late-night usage detection
- **Click/Scroll Behavior**: Stress level indicators (planned)

## 🎨 Design System

### Color Palette
- Primary: Blue (#3B82F6) - Trust and calm
- Secondary: Teal (#14B8A6) - Growth and balance
- Accent: Purple (#8B5CF6) - Creativity and mindfulness
- Success: Green (#10B981) - Positive outcomes
- Warning: Orange (#F59E0B) - Gentle alerts
- Error: Red (#EF4444) - Important notifications

### Typography
- Font Family: System fonts for optimal performance
- Spacing: 8px grid system
- Line Height: 150% for body text, 120% for headings

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Ensure mobile responsiveness
- Respect privacy-first principles

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review privacy policies

## 🗺️ Roadmap

### Version 1.1
- [ ] Enhanced ML behavioral analysis
- [ ] Sound therapy integration
- [ ] Advanced mood correlations
- [ ] Widget for quick mood logging

### Version 1.2
- [ ] Team/family wellness features
- [ ] Integration with health apps
- [ ] Advanced analytics dashboard
- [ ] Customizable intervention flows

### Version 2.0
- [ ] Browser extension version
- [ ] Wear OS/watchOS support
- [ ] Enhanced accessibility features
- [ ] Multi-language support

---

Built with ❤️ for digital wellness and mental health awareness.