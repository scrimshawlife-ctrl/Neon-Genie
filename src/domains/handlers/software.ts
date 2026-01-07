import type { Architecture, Component } from '../../types/artifact';

export interface SoftwarePatterns {
  isAPI: boolean;
  isMobile: boolean;
  isWeb: boolean;
  isDesktop: boolean;
  isCLI: boolean;
  needsAuth: boolean;
  needsDatabase: boolean;
  needsRealtime: boolean;
  isAI: boolean;
  isBlockchain: boolean;
}

export class SoftwareDomainHandler {
  detectPatterns(concept: string, constraints: string[]): SoftwarePatterns {
    const text = `${concept} ${constraints.join(' ')}`.toLowerCase();
    return {
      isAPI: text.includes('api'),
      isMobile: text.includes('mobile'),
      isWeb: text.includes('web') || text.includes('browser'),
      isDesktop: text.includes('desktop') || text.includes('electron'),
      isCLI: text.includes('cli') || text.includes('terminal'),
      needsAuth: text.includes('auth') || text.includes('login'),
      needsDatabase: text.includes('database') || text.includes('storage'),
      needsRealtime: text.includes('realtime') || text.includes('stream'),
      isAI: text.includes('ai') || text.includes('machine learning'),
      isBlockchain: text.includes('blockchain') || text.includes('web3')
    };
  }

  selectTechStack(patterns: SoftwarePatterns): string[] {
    const stack = ['TypeScript', 'Node.js'];
    if (patterns.isWeb) {
      stack.push('Next.js', 'React');
    }
    if (patterns.isMobile) {
      stack.push('React Native');
    }
    if (patterns.isDesktop) {
      stack.push('Electron');
    }
    if (patterns.needsDatabase) {
      stack.push('PostgreSQL');
    }
    if (patterns.needsRealtime) {
      stack.push('WebSockets');
    }
    if (patterns.isAI) {
      stack.push('Vector DB');
    }
    if (patterns.isBlockchain) {
      stack.push('Smart Contracts');
    }
    return stack;
  }

  generateComponents(concept: string, constraints: string[]): Component[] {
    const patterns = this.detectPatterns(concept, constraints);
    const stack = this.selectTechStack(patterns);

    return [
      {
        name: 'Product Core',
        function: 'Orchestrates primary workflows and domain logic.',
        owner: 'Platform Engineering',
        integration: 'Connects to data and interface layers.',
        tech: stack,
        features: ['State management', 'Policy enforcement', 'Workflow engine']
      },
      {
        name: 'Interface Gateway',
        function: 'Delivers experiences across devices and channels.',
        owner: 'Experience Engineering',
        integration: 'Syncs with API and analytics layers.',
        tech: patterns.isMobile ? ['React Native', 'Expo'] : ['React', 'Next.js'],
        features: ['Adaptive UI', 'Personalization', 'Accessibility']
      },
      {
        name: 'Intelligence Layer',
        function: 'Provides automation, insights, and recommendation systems.',
        owner: 'AI Systems',
        integration: 'Feeds signals back to core workflows.',
        tech: patterns.isAI ? ['Embeddings', 'Inference Pipeline'] : ['Rules Engine'],
        features: ['Signal scoring', 'Guidance loops', 'Adaptive routing']
      }
    ];
  }

  defineArchitecture(constraints: string[]): Architecture {
    const isPrivacyFocused = constraints.some((item) => item.toLowerCase().includes('privacy'));
    const isOffline = constraints.some((item) => item.toLowerCase().includes('offline'));
    const edgeFirst = constraints.some((item) => item.toLowerCase().includes('edge'));
    const serverless = constraints.some((item) => item.toLowerCase().includes('serverless'));

    return {
      storage: isPrivacyFocused ? 'Encrypted local-first storage' : 'Managed relational store',
      computation: edgeFirst ? 'Edge functions with regional caching' : 'Service mesh orchestration',
      interface: isOffline ? 'Progressive web shell with sync' : 'API-driven experience layer',
      ecosystem_mapping: [
        serverless ? 'Serverless functions' : 'Containerized services',
        'Observability suite',
        'Security posture management'
      ]
    };
  }

  recommendSecurity(patterns: SoftwarePatterns): string[] {
    const strategies = ['Zero trust authentication', 'Encrypted secrets management'];
    if (patterns.needsAuth) {
      strategies.push('MFA and adaptive access policies');
    }
    if (patterns.needsDatabase) {
      strategies.push('Row-level security controls');
    }
    return strategies;
  }

  recommendDeployment(patterns: SoftwarePatterns): string[] {
    const deployments = ['Blue/green deployment', 'Automated rollback'];
    if (patterns.needsRealtime) {
      deployments.push('Edge caching with websocket routing');
    }
    if (patterns.isAI) {
      deployments.push('Model observability and drift detection');
    }
    return deployments;
  }
}
