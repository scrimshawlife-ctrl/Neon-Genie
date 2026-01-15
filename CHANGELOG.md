# Changelog

All notable changes to Neon Genie will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.1-enhanced] - 2025-01-15

### Added

#### Abraxas Integration
- **AbraxasClient**: Full-featured API client for symbolic computation
  - Numerology analysis with vibrational scoring
  - Ephemeris data with planetary alignment calculation
  - Gematria value and resonance computation
  - Archetypal pattern recognition with shadow/integration guidance
  - Sigil generation with geometric styles
  - Tarot readings with multiple spreads
  - I-Ching consultation with hexagram interpretation
  - Optimal timing window calculation
  - Runic encoding with divination
- **SymbolicResonanceScorer**: 6th quality dimension scorer
  - Combines numerology, timing, gematria, and archetypes
  - Sub-score breakdown for detailed analysis
  - Symbolic insights with recommendations
- **EnhancedQualityScorer**: 6-dimension quality scoring
  - Extends base scorer with symbolic resonance (35% weight)
  - Adjusted weights for Abraxas mode (20/20/15/10/5/35)
  - Higher quality threshold (0.6 vs 0.5)
  - Enhanced breakdown with symbolic insights
- **Mock Mode**: Complete mock implementations for offline development
  - All Abraxas API methods work deterministically
  - Automatic fallback when API unavailable
  - Ready for seamless integration when API becomes available

#### Enhanced Domain Handlers
- **SoftwareDomainHandler**: Pattern detection and tech stack selection
  - 10+ pattern detections (API, mobile, web, real-time, AI, etc.)
  - Smart tech stack recommendations
  - Architecture with constraint handling (privacy, offline, serverless, edge)
  - Component generation with features and tech arrays
- **BrandsDomainHandler**: Aesthetic generation and brand systems
  - Industry/personality/price point analysis
  - Aesthetic direction with color palette and typography
  - 4-component brand system (visual, voice, experience, guidelines)
  - Industry-specific customization

#### Semantic Search
- **SemanticSearch**: Vector-based similarity search
  - @xenova/transformers integration (all-MiniLM-L6-v2)
  - 384-dimensional embeddings
  - Cosine similarity calculation
  - Duplicate detection with configurable threshold
  - Batch indexing capability
  - Graceful fallback to mock embeddings

#### Deployment
- **Orin Nano Docker Package**: Edge deployment configuration
  - Multi-arch Dockerfile (ARM64 + x86_64)
  - Docker Compose with resource limits
  - Automated deployment script
  - Health checks and logging
  - Deployment documentation

#### Testing
- Comprehensive Abraxas client test suite
  - All API methods covered
  - Mock mode validation
  - Data structure verification
  - Error handling tests

### Changed
- Quality scoring weights rebalanced for Abraxas mode
  - Symbolic resonance gets highest weight (35%)
  - Other dimensions adjusted to accommodate
- Quality threshold raised to 0.6 in Abraxas mode
- Component generation enhanced for software/brands domains
- Index exports expanded to include all new modules

### Fixed
- None (new features only, no breaking changes)

### Documentation
- README updated with Abraxas integration guide
- Quality scoring sections for both modes
- Docker deployment instructions
- API examples for all new features
- Deployment README for Orin Nano

## [3.7.0] - 2025-01-07

### Added
- Initial release with core ideation engine
- 5-dimension quality scoring
- 10 ideation domains
- Provenance tracking
- Corpus storage
- Web playground (optional)
- Enhanced demo examples

### Features
- Standalone mode with deterministic generation
- Enhanced mode with domain-specific handlers
- Semantic search capabilities
- Evolution with lineage tracking
- Export to JSON/Markdown

## Version Numbers

- **3.7.1-enhanced**: Current version with Abraxas integration
- **3.7.0**: Baseline release with core features
