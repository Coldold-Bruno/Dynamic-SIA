import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { Brain, Waves, Network, Target, Eye, Activity, Zap, Radio, Save, ChevronRight, ChevronLeft, BarChart3, Lightbulb, Compass, Play, Pause, CheckCircle, AlertCircle, Download, Maximize2, Clock, TrendingUp, BookOpen, Award, RefreshCw, Settings, Moon, Sun, Cpu, Database, PieChart, BarChart, Users, Layers, Sparkles } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ==================== ÉTAT INITIAL ====================
const initialState = {
  metrics: {
    energyLevel: 75,
    resistance: 42,
    coherence: 68,
    voltage: 50,
    intensity: 1.2,
    frequency: 50,
    phase: 0,
    impedance: 0,
    powerFactor: 0.85
  },
  ui: {
    activeTab: 'dashboard',
    theme: 'dark',
    fullScreen: false,
    notifications: []
  },
  session: {
    projectionActive: false,
    nodes: [],
    selectedUseCase: null,
    exerciseStep: 0,
    selectedDimension: 'action',
    timer: 0,
    timerActive: false,
    sessionStart: null
  },
  data: {
    history: [],
    asiapScores: {
      action: 70,
      savoir: 65,
      intuition: 75,
      ame: 60,
      presence: 80
    }
  }
};

// ==================== REDUCER ====================
function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_METRIC':
      return {
        ...state,
        metrics: { ...state.metrics, [action.metric]: action.value }
      };
    case 'SET_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.tab }
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: state.ui.theme === 'dark' ? 'light' : 'dark' }
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, { id: Date.now(), msg: action.msg }]
        }
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.id)
        }
      };
    case 'TOGGLE_PROJECTION':
      return {
        ...state,
        session: {
          ...state.session,
          projectionActive: !state.session.projectionActive,
          nodes: !state.session.projectionActive ? [] : state.session.nodes
        }
      };
    case 'ADD_NODE':
      return {
        ...state,
        session: {
          ...state.session,
          nodes: [...state.session.nodes, action.node]
        }
      };
    case 'UPDATE_ASIAP':
      return {
        ...state,
        data: {
          ...state.data,
          asiapScores: { ...state.data.asiapScores, [action.dimension]: action.value }
        }
      };
    case 'ADD_HISTORY':
      return {
        ...state,
        data: {
          ...state.data,
          history: [...state.data.history, action.session].slice(-50)
        }
      };
    case 'UPDATE_USE_CASE':
      return {
        ...state,
        session: { ...state.session, selectedUseCase: action.value }
      };
    case 'UPDATE_STEP':
      return {
        ...state,
        session: { ...state.session, exerciseStep: action.value }
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        session: { ...state.session, timer: action.value, timerActive: action.active !== undefined ? action.active : state.session.timerActive }
      };
    case 'START_SESSION':
      return {
        ...state,
        session: { ...state.session, sessionStart: new Date().toISOString() }
      };
    case 'UPDATE_DIMENSION':
      return {
        ...state,
        session: { ...state.session, selectedDimension: action.value }
      };
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        ui: { ...state.ui, fullScreen: !state.ui.fullScreen }
      };
    default:
      return state;
  }
}

// ==================== ALGORITHMES ====================
const AdvancedAlgorithms = {
  calculateImpedance: (R, frequency) => {
    const omega = 2 * Math.PI * frequency;
    const L = 0.1;
    const C = 0.00001;
    const XL = omega * L;
    const XC = 1 / (omega * C);
    const X = XL - XC;
    return Math.sqrt(R * R + X * X);
  },

  calculateWellnessScore: (metrics, asiapScores) => {
    const metricScore = (metrics.energyLevel + metrics.coherence + (100 - metrics.resistance)) / 3;
    const asiapScore = Object.values(asiapScores).reduce((a, b) => a + b, 0) / 5;
    return Math.round((metricScore * 0.6 + asiapScore * 0.4));
  },

  detectAnomalies: (current, history) => {
    if (history.length < 5) return [];
    const anomalies = [];
    const metrics = ['energyLevel', 'coherence', 'resistance'];
    
    metrics.forEach(metric => {
      const values = history.slice(-10).map(h => h[metric]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
      
      if (Math.abs(current[metric] - mean) > 2 * std) {
        anomalies.push({ metric, severity: 'high', value: current[metric], expected: Math.round(mean) });
      }
    });
    
    return anomalies;
  }
};

// ==================== COMPOSANTS ====================
const GlassCard = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ${className}`}
  >
    {children}
  </div>
);

// ==================== COMPOSANT PRINCIPAL ====================
export default function SionohmairPremium() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { metrics, ui, session, data } = state;

  // Calculs avancés
  const advancedMetrics = useMemo(() => {
    const impedance = Math.round(AdvancedAlgorithms.calculateImpedance(metrics.resistance, metrics.frequency));
    const wellnessScore = AdvancedAlgorithms.calculateWellnessScore(metrics, data.asiapScores);
    const anomalies = AdvancedAlgorithms.detectAnomalies(metrics, data.history);
    
    return { impedance, wellnessScore, anomalies };
  }, [metrics, data.asiapScores, data.history]);

  // Données graphiques
  const chartData = useMemo(() => {
    return data.history.slice(-20).map((item, idx) => ({
      session: idx + 1,
      énergie: item.energyLevel,
      cohérence: item.coherence,
      résistance: 100 - item.resistance,
      wellness: AdvancedAlgorithms.calculateWellnessScore(item, item.asiapScores || data.asiapScores)
    }));
  }, [data.history, data.asiapScores]);

  const radarData = useMemo(() => {
    return Object.keys(data.asiapScores).map(key => ({
      dimension: key.charAt(0).toUpperCase() + key.slice(1),
      value: data.asiapScores[key],
      fullMark: 100
    }));
  }, [data.asiapScores]);

  // Effets
  useEffect(() => {
    const saved = localStorage.getItem('sionohmair-premium');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.history) {
          dispatch({ type: 'ADD_HISTORY', session: { history: parsed.history } });
        }
      } catch (e) {
        console.error('Erreur chargement:', e);
      }
    }
  }, []);

  useEffect(() => {
    const toSave = {
      ...metrics,
      asiapScores: data.asiapScores,
      history: data.history,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('sionohmair-premium', JSON.stringify(toSave));
  }, [metrics, data.asiapScores, data.history]);

  useEffect(() => {
    const imp = Math.round(AdvancedAlgorithms.calculateImpedance(metrics.resistance, metrics.frequency));
    dispatch({ type: 'UPDATE_METRIC', metric: 'impedance', value: imp });
  }, [metrics.resistance, metrics.frequency]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_METRIC', metric: 'resistance', value: Math.min(100, Math.round(metrics.voltage / metrics.intensity)) });
  }, [metrics.voltage, metrics.intensity]);

  useEffect(() => {
    if (session.projectionActive) {
      const interval = setInterval(() => {
        dispatch({ type: 'UPDATE_METRIC', metric: 'energyLevel', value: Math.max(20, metrics.energyLevel - 0.3) });
        
        if (session.nodes.length < 20) {
          dispatch({
            type: 'ADD_NODE',
            node: {
              id: session.nodes.length,
              x: Math.random() * 85 + 5,
              y: Math.random() * 85 + 5,
              intensity: Math.random() * 0.8 + 0.2,
              color: `hsl(${180 + Math.random() * 100}, ${60 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
            }
          });
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [session.projectionActive, session.nodes.length, metrics.energyLevel]);

  useEffect(() => {
    let interval;
    if (session.timerActive) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER', value: session.timer + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.timerActive, session.timer]);

  // Callbacks
  const notify = useCallback((msg) => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', msg });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', id });
    }, 3000);
  }, []);

  const saveSession = useCallback(() => {
    const sessionData = {
      date: new Date().toISOString(),
      energyLevel: metrics.energyLevel,
      coherence: metrics.coherence,
      resistance: metrics.resistance,
      asiapScores: { ...data.asiapScores },
      wellnessScore: advancedMetrics.wellnessScore,
      duration: session.sessionStart ? (Date.now() - new Date(session.sessionStart).getTime()) / 1000 : 0
    };
    dispatch({ type: 'ADD_HISTORY', session: sessionData });
    notify('✅ Session sauvegardée avec succès');
  }, [metrics, data.asiapScores, advancedMetrics.wellnessScore, session.sessionStart, notify]);

  const exportData = useCallback((format = 'json') => {
    const exportData = {
      metrics,
      asiapScores: data.asiapScores,
      history: data.history,
      wellnessScore: advancedMetrics.wellnessScore,
      exportDate: new Date().toISOString(),
      version: '3.0-premium'
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sionohmair-premium-${Date.now()}.json`;
      a.click();
    } else if (format === 'csv') {
      const csv = [
        ['Date', 'Énergie', 'Cohérence', 'Résistance', 'Wellness Score'],
        ...data.history.map(h => [
          new Date(h.date).toLocaleDateString(),
          h.energyLevel,
          h.coherence,
          h.resistance,
          h.wellnessScore || 0
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sionohmair-premium-${Date.now()}.csv`;
      a.click();
    }
    
    notify(`📥 Données exportées en ${format.toUpperCase()}`);
  }, [metrics, data, advancedMetrics.wellnessScore, notify]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Données
  const useCases = [
    {
      id: 'pres',
      title: '🎤 Présentation Impactante',
      color: 'from-red-500 to-orange-500',
      description: 'Maîtrisez votre état pour une présentation mémorable',
      duration: 15,
      steps: [
        { name: 'Évaluation Baseline', desc: 'Mesurez vos métriques actuelles et identifiez les zones de tension', duration: 2 },
        { name: 'Visualisation Immersive', desc: 'Créez une image mentale 4D de votre succès', duration: 3 },
        { name: 'Calibrage Énergétique', desc: 'Respiration 4-7-8 pour Flow State optimal', duration: 5 },
        { name: 'Projection Intentionnelle', desc: 'Projetez votre présence avec force', duration: 3 },
        { name: 'Activation Ancrage', desc: 'Créez un trigger neurologique', duration: 2 }
      ]
    },
    {
      id: 'stress',
      title: '🧘 Maîtrise du Stress',
      color: 'from-purple-500 to-pink-500',
      description: 'Transformez le stress en énergie productive',
      duration: 15,
      steps: [
        { name: 'Reconnaissance Somatique', desc: 'Identifiez les manifestations physiques du stress', duration: 2 },
        { name: 'Respiration 4-4-6', desc: 'Activez le système parasympathique', duration: 3 },
        { name: 'Réalignement ASIAP', desc: 'Restaurez l\'équilibre des 5 dimensions', duration: 5 },
        { name: 'Reframe Cognitif', desc: 'Transformez la perception du stress', duration: 3 },
        { name: 'Ancrage Anti-Stress', desc: 'Point d\'accès rapide au calme', duration: 2 }
      ]
    },
    {
      id: 'creat',
      title: '💡 Explosion Créative',
      color: 'from-yellow-500 to-amber-500',
      description: 'Libérez votre génie créatif',
      duration: 21,
      steps: [
        { name: 'État Alpha', desc: 'Entrez dans l\'état cérébral optimal (8-12 Hz)', duration: 3 },
        { name: 'Divergence Totale', desc: 'Quantité maximale sans jugement', duration: 5 },
        { name: 'Connexions Holographiques', desc: 'Pensée latérale avancée', duration: 4 },
        { name: 'Association Forcée', desc: 'Combinez des opposés', duration: 4 },
        { name: 'Cristallisation', desc: 'Affinez les meilleures idées', duration: 3 },
        { name: 'Validation Terrain', desc: 'Testez dans des scénarios réels', duration: 2 }
      ]
    }
  ];

  const asiapDims = [
    { id: 'action', name: 'Action', icon: Target, color: 'from-red-500 to-orange-500' },
    { id: 'savoir', name: 'Savoir', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'intuition', name: 'Intuition', icon: Eye, color: 'from-purple-500 to-pink-500' },
    { id: 'ame', name: 'Âme', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { id: 'presence', name: 'Présence', icon: Radio, color: 'from-yellow-500 to-amber-500' }
  ];

  const isDark = ui.theme === 'dark';
  const bgClass = isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-500 p-4 md:p-6`}>
      {/* Particules */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/30 animate-pulse"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 5}s`
            }}
          />
        ))}
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {ui.notifications.map(n => (
          <GlassCard key={n.id} className="px-4 py-3 animate-slide-in">
            <p className="text-sm font-medium">{n.msg}</p>
          </GlassCard>
        ))}
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header */}
        <GlassCard className="mb-6 p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <Brain className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Sionohmair Insight
                </h1>
                <p className="text-xs md:text-sm text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Premium Edition v3.0 • Neural Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-400">Wellness Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {advancedMetrics.wellnessScore}
                  </span>
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                className="p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <div className="relative group">
                <button className="p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <GlassCard className="p-2">
                    <button onClick={() => exportData('json')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                      Export JSON
                    </button>
                    <button onClick={() => exportData('csv')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                      Export CSV
                    </button>
                  </GlassCard>
                </div>
              </div>

              <button
                onClick={saveSession}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm md:text-base"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Sauvegarder</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Navigation */}
        <GlassCard className="mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { id: 'usecases', icon: Lightbulb, label: 'Protocoles' },
              { id: 'asiap', icon: Compass, label: 'ASIAP' },
              { id: 'network', icon: Network, label: 'Réseau' },
              { id: 'calc', icon: Cpu, label: 'Calculateur' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_T      ],
      metrics: ['Ei: +40%', 'SI: +38%', 'R: -32%', 'Close: +45%']
    },
    {
      id: 'stress',
      title: 'Gestion du Stress',
      icon: '🧘',
      color: 'from-purple-500 to-pink-500',
      duration: '10 min',
      description: 'Protocole rapide pour reduire le stress aigu et retrouver votre equilibre cognitif',
      benefits: [
        'Cortisol reduit de 38%',
        'Retour au calme en 10 minutes',
        'Clarte mentale restauree',
        'Energie stabilisee'
      ],
      steps: [
        { 
          title: 'Reconnaissance du desequilibre', 
          desc: 'Identifiez objectivement votre etat de stress',
          instruction: 'Sans jugement, constatez: Mon SI a chute, ma resistance R a monte. C\'est temporaire et modifiable.',
          action: 'recognize'
        },
        { 
          title: 'Respiration Sionohmairique', 
          desc: 'Synchronisez votre souffle avec les oscillations d\'energie',
          instruction: 'Inspiration 4 temps - Retention 4 temps - Expiration 6 temps. Visualisez l\'energie Ei qui remonte a chaque cycle.',
          action: 'breathe'
        },
        { 
          title: 'Realignement ASIAP', 
          desc: 'Reequilibrez les 5 dimensions (focus sur Ame et Presence)',
          instruction: 'Reconnectez-vous a votre centre (Ame). Ancrez-vous dans le moment present (Presence). Le reste suivra.',
          action: 'realign'
        },
        { 
          title: 'Projection apaisante', 
          desc: 'Emettez des ondes de coherence vers votre reseau proche',
          instruction: 'Imaginez une sphere de calme qui emane de vous. Elle touche votre environnement et revient amplifiee.',
          action: 'project'
        },
        { 
          title: 'Ancrage de stabilite', 
          desc: 'Enregistrez ce nouvel etat dans votre memoire corporelle',
          instruction: 'Pressez pouce et index ensemble. Cet ancrage rappellera cet etat de calme quand vous en aurez besoin.',
          action: 'anchor'
        }
      ],
      metrics: ['Ei: +28%', 'SI: +52%', 'R: -45%', 'Cort: -38%']
    },
    {
      id: 'creativity',
      title: 'Boost Creatif',
      icon: '💡',
      color: 'from-yellow-500 to-amber-500',
      duration: '25 min',
      description: 'Stimulez votre creativite en vous connectant au reseau holographique des idees',
      benefits: [
        'Generation d\'idees +67%',
        'Qualite des solutions +52%',
        'Connexions inattendues',
        'Innovation acceleree'
      ],
      steps: [
        { 
          title: 'Etat de divergence', 
          desc: 'Augmentez votre Ei pour une exploration large',
          instruction: 'Liberez votre esprit des contraintes. Toutes les idees sont bienvenues. Quantite d\'abord, qualite ensuite.',
          action: 'diverge'
        },
        { 
          title: 'Connexion au reseau holographique', 
          desc: 'Captez les idees du champ collectif',
          instruction: 'Imaginez que vous vous branchez sur un reseau infini d\'idees. Qu\'est-ce qui emerge spontanement?',
          action: 'connect'
        },
        { 
          title: 'Association fractale', 
          desc: 'Reliez les concepts via les 12 preceptes',
          instruction: 'Prenez 3 idees apparemment non reliees. Trouvez les patterns communs, les connexions cachees.',
          action: 'associate'
        },
        { 
          title: 'Cristallisation intuitive', 
          desc: 'Laissez emerger les solutions depuis votre intuition',
          instruction: 'Arretez de forcer. Detendez-vous. La solution optimale va apparaitre naturellement.',
          action: 'crystallize'
        },
        { 
          title: 'Validation par projection', 
          desc: 'Testez la pertinence via simulation mentale',
          instruction: 'Projetez votre idee dans le futur. Est-elle viable? Robuste? Si oui, vous le ressentirez.',
          action: 'validate'
        }
      ],
      metrics: ['Ei: +48%', 'SI: +35%', 'Idees: +67%', 'Qual: +52%']
    },
    {
      id: 'conflict',
      title: 'Resolution de Conflit',
      icon: '🤝',
      color: 'from-green-500 to-emerald-500',
      duration: '18 min',
      description: 'Transformez les conflits en opportunites de collaboration par l\'empathie cognitive',
      benefits: [
        'Taux de resolution +73%',
        'Reduction des tensions',
        'Relations preservees',
        'Solutions win-win'
      ],
      steps: [
        { 
          title: 'Neutralite energetique', 
          desc: 'Baissez votre resistance emotionnelle personnelle',
          instruction: 'Respirez. Ce conflit n\'est pas une attaque personnelle. C\'est un probleme a resoudre ensemble.',
          action: 'neutralize'
        },
        { 
          title: 'Cartographie du conflit', 
          desc: 'Identifiez les noeuds de tension dans le reseau',
          instruction: 'Quels sont les vrais enjeux? Souvent, le conflit apparent cache un besoin non exprime.',
          action: 'map'
        },
        { 
          title: 'Empathie cognitive active', 
          desc: 'Captez les perspectives de toutes les parties',
          instruction: 'Mettez-vous veritablement a la place de l\'autre. Que ressent-il? Que craint-il? Que desire-t-il vraiment?',
          action: 'empathize'
        },
        { 
          title: 'Projection mediatrice', 
          desc: 'Emettez des ondes de coherence vers toutes les parties',
          instruction: 'Maintenez une energie calme et centree. Votre stabilite aide les autres a se stabiliser.',
          action: 'mediate'
        },
        { 
          title: 'Co-creation de solution', 
          desc: 'Facilitez l\'emergence d\'un accord via le reseau harmonise',
          instruction: 'Posez la question: "Comment pouvons-nous tous obtenir ce qui compte vraiment pour nous?" Laissez emerger.',
          action: 'cocreate'
        }
      ],
      metrics: ['Ei: +32%', 'SI: +45%', 'R: -50%', 'Resol: +73%']
    },
    {
      id: 'learning',
      title: 'Apprentissage Accelere',
      icon: '📚',
      color: 'from-indigo-500 to-purple-500',
      duration: '30 min',
      description: 'Optimisez votre capacite d\'apprentissage en alignant cognition et memoire holographique',
      benefits: [
        'Retention +65%',
        'Comprehension +58%',
        'Rappel facilite',
        'Integration profonde'
      ],
      steps: [
        { 
          title: 'Preparation cognitive', 
          desc: 'Optimisez Ei et SI pour une receptivite maximale',
          instruction: 'Creez l\'etat optimal d\'apprentissage: curieux, detendu, energise. Votre cerveau est une eponge prete a absorber.',
          action: 'prepare'
        },
        { 
          title: 'Absorption fractale', 
          desc: 'Integrez l\'information selon la structure des 12 preceptes',
          instruction: 'Ne memorisez pas betement. Cherchez les patterns, les structures, les liens avec ce que vous savez deja.',
          action: 'absorb'
        },
        { 
          title: 'Connexion archetypale', 
          desc: 'Reliez le nouveau savoir aux patterns existants',
          instruction: 'Cette nouvelle info ressemble a quoi que vous connaissez deja? Creez des ponts, des metaphores, des analogies.',
          action: 'connect'
        },
        { 
          title: 'Consolidation holographique', 
          desc: 'Distribuez la connaissance dans votre reseau neuronal',
          instruction: 'Expliquez ce que vous venez d\'apprendre a voix haute, comme si vous l\'enseigniez. Cela ancre l\'information.',
          action: 'consolidate'
        },
        { 
          title: 'Test de projection', 
          desc: 'Verifiez votre maitrise en enseignant mentalement',
          instruction: 'Imaginez que vous enseignez ce sujet a quelqu\'un. Pouvez-vous l\'expliquer clairement? Si oui, vous l\'avez integre.',
          action: 'test'
        }
      ],
      metrics: ['Ei: +38%', 'SI: +48%', 'Ret: +65%', 'Comp: +58%']
    }
  ];

  const adjustIndicator = (type, delta) => {
    if (type === 'ei') {
      setEnergyLevel(prev => Math.max(0, Math.min(100, prev + delta)));
    } else if (type === 'resistance') {
      setResistance(prev => Math.max(0, Math.min(100, prev + delta)));
    } else if (type === 'coherence') {
      setCoherence(prev => Math.max(0, Math.min(100, prev + delta)));
    }
  };

  const renderDashboard = () => {
    const eiStatus = getIndicatorStatus(energyLevel, 'ei');
    const rStatus = getIndicatorStatus(resistance, 'resistance');
    const siStatus = getIndicatorStatus(coherence, 'coherence');

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Energie (Ei) - INTERACTIVE */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Energie (Ei)</span>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <button
                  onClick={() => setShowTooltip(showTooltip === 'ei' ? null : 'ei')}
                  className="hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold">{energyLevel}%</div>
            <div className="flex items-center gap-2 mt-2">
              <eiStatus.icon className={`w-4 h-4 ${eiStatus.color}`} />
              <span className={`text-xs ${eiStatus.color}`}>{eiStatus.message}</span>
            </div>
            
            {/* Controles interactifs */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => adjustIndicator('ei', -5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                -5
              </button>
              <button
                onClick={() => adjustIndicator('ei', 5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                +5
              </button>
            </div>

            {/* Tooltip explicatif */}
            {showTooltip === 'ei' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-blue-500 rounded-lg p-4 text-sm z-10 shadow-xl">
                <h4 className="font-bold mb-2">Energie Individuelle (Ei)</h4>
                <p className="text-gray-300 mb-2">Votre capacite actuelle a projeter et maintenir vos pensees dans le reseau cognitif.</p>
                <div className="text-xs text-gray-400">
                  <strong>Comment l'augmenter:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>Repos suffisant (7-9h)</li>
                    <li>Meditation quotidienne</li>
                    <li>Exercice physique</li>
                    <li>Hydratation adequate</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Resistance (R) - INTERACTIVE */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Resistance (R)</span>
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                <button
                  onClick={() => setShowTooltip(showTooltip === 'r' ? null : 'r')}
                  className="hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold">{resistance}Ω</div>
            <div className="flex items-center gap-2 mt-2">
              <rStatus.icon className={`w-4 h-4 ${rStatus.color}`} />
              <span className={`text-xs ${rStatus.color}`}>{rStatus.message}</span>
            </div>

            {/* Controles interactifs */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => adjustIndicator('resistance', -5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                -5
              </button>
              <button
                onClick={() => adjustIndicator('resistance', 5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                +5
              </button>
            </div>

            {/* Tooltip explicatif */}
            {showTooltip === 'r' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-purple-500 rounded-lg p-4 text-sm z-10 shadow-xl">
                <h4 className="font-bold mb-2">Resistance (R)</h4>
                <p className="text-gray-300 mb-2">Opposition que rencontre votre pensee. Plus R est bas, plus vos idees circulent facilement.</p>
                <div className="text-xs text-gray-400">
                  <strong>Comment la reduire:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>Gestion du stress</li>
                    <li>Meditation de pleine conscience</li>
                    <li>Reduction croyances limitantes</li>
                    <li>Communication bienveillante</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Coherence (SI) - INTERACTIVE */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Coherence (SI)</span>
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                <button
                  onClick={() => setShowTooltip(showTooltip === 'si' ? null : 'si')}
                  className="hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold">{coherence}%</div>
            <div className="flex items-center gap-2 mt-2">
              <siStatus.icon className={`w-4 h-4 ${siStatus.color}`} />
              <span className={`text-xs ${siStatus.color}`}>{siStatus.message}</span>
            </div>

            {/* Controles interactifs */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => adjustIndicator('coherence', -5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                -5
              </button>
              <button
                onClick={() => adjustIndicator('coherence', 5)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all"
              >
                +5
              </button>
            </div>

            {/* Tooltip explicatif */}
            {showTooltip === 'si' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-green-500 rounded-lg p-4 text-sm z-10 shadow-xl">
                <h4 className="font-bold mb-2">Sionohmair Insight (SI)</h4>
                <p className="text-gray-300 mb-2">Votre alignement interne entre pensees, emotions et actions.</p>
                <div className="text-xs text-gray-400">
                  <strong>Comment l'augmenter:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>Clarification des valeurs</li>
                    <li>Pratique de l'authenticite</li>
                    <li>Alignement intentions/actions</li>
                    <li>Travail ASIAP</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommandations contextuelles */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Recommandations Personnalisees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {energyLevel < 40 && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">⚠️ Energie Faible</div>
                <p className="text-sm text-gray-300">Votre Ei est bas. Utilisez le protocole "Gestion du Stress" pour vous ressourcer rapidement.</p>
              </div>
            )}
            {resistance > 60 && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">⚠️ Resistance Elevee</div>
                <p className="text-sm text-gray-300">Vos blocages sont importants. Le protocole "Gestion du Stress" peut vous aider.</p>
              </div>
            )}
            {coherence < 50 && (
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                <div className="font-semibold text-yellow-300 mb-2">⚡ Coherence a Ameliorer</div>
                <p className="text-sm text-gray-300
