import React, { useState, useEffect } from 'react';
import { Brain, Waves, Network, Target, Eye, Compass, Activity, Zap, Radio, CircleDot, Info, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const SionohmairApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [energyLevel, setEnergyLevel] = useState(75);
  const [resistance, setResistance] = useState(42);
  const [coherence, setCoherence] = useState(68);
  const [voltage, setVoltage] = useState(50); // U en volts
  const [intensity, setIntensity] = useState(1.2); // I en amperes
  const [projectionActive, setProjectionActive] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [portee, setPortee] = useState(1600); // en metres
  const [frequence, setFrequence] = useState(42.5); // en Hz
  const [selectedDimension, setSelectedDimension] = useState('action');
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionData, setSessionData] = useState({
    preSession: { ei: 0, si: 0, resistance: 0 },
    postSession: { ei: 0, si: 0, resistance: 0 }
  });
  const [showCalculatorHelp, setShowCalculatorHelp] = useState(false);

  // Calculs automatiques
  useEffect(() => {
    // R = U / I (Loi d'Ohm)
    const calculatedR = voltage / intensity;
    setResistance(Math.min(100, Math.round(calculatedR)));
  }, [voltage, intensity]);

  useEffect(() => {
    // La frequence augmente avec la coherence
    const newFreq = 20 + (coherence * 0.5);
    setFrequence(parseFloat(newFreq.toFixed(1)));
  }, [coherence]);

  useEffect(() => {
    // La portee augmente avec l'energie
    const newPortee = 500 + (energyLevel * 20);
    setPortee(Math.round(newPortee));
  }, [energyLevel]);

  useEffect(() => {
    if (projectionActive) {
      const interval = setInterval(() => {
        setEnergyLevel(prev => Math.max(20, prev - 1));
        setNodes(prev => {
          if (prev.length < 8) {
            return [...prev, {
              id: prev.length,
              x: Math.random() * 300 + 50,
              y: Math.random() * 300 + 50,
              intensity: Math.random() * 100
            }];
          }
          return prev;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [projectionActive]);

  const asiapDimensions = [
    { id: 'action', name: 'Action', icon: Target, color: 'from-red-500 to-orange-500' },
    { id: 'savoir', name: 'Savoir', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'intuition', name: 'Intuition', icon: Eye, color: 'from-purple-500 to-pink-500' },
    { id: 'ame', name: 'Ame', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { id: 'presence', name: 'Presence', icon: Radio, color: 'from-yellow-500 to-amber-500' }
  ];

  const depthCircles = ['Visible', 'Personnel', 'Archetypal', 'Holographique'];

  const calculateEi = (si, n) => {
    return si * Math.pow(Math.E, -n * 0.1);
  };

  const getIndicatorStatus = (value, type) => {
    if (type === 'ei') {
      if (value >= 75) return { status: 'optimal', color: 'text-green-400', message: 'Performance maximale', icon: CheckCircle };
      if (value >= 40) return { status: 'modere', color: 'text-yellow-400', message: 'Calibrage recommande', icon: AlertCircle };
      return { status: 'faible', color: 'text-red-400', message: 'Repos necessaire', icon: AlertCircle };
    }
    if (type === 'resistance') {
      if (value <= 30) return { status: 'optimal', color: 'text-green-400', message: 'Fluidite excellente', icon: CheckCircle };
      if (value <= 60) return { status: 'modere', color: 'text-yellow-400', message: 'Ajustement possible', icon: AlertCircle };
      return { status: 'eleve', color: 'text-red-400', message: 'Blocages importants', icon: AlertCircle };
    }
    if (type === 'coherence') {
      if (value >= 80) return { status: 'optimal', color: 'text-green-400', message: 'Alignement parfait', icon: CheckCircle };
      if (value >= 50) return { status: 'correct', color: 'text-yellow-400', message: 'Amelioration possible', icon: AlertCircle };
      return { status: 'faible', color: 'text-red-400', message: 'Travail requis', icon: AlertCircle };
    }
  };

  const useCases = [
    {
      id: 'presentation',
      title: 'Presentation Publique',
      icon: '🎤',
      color: 'from-red-500 to-orange-500',
      duration: '15 min',
      description: 'Preparez-vous mentalement pour une presentation reussie en calibrant votre energie et en reduisant le stress',
      benefits: [
        'Reduction du trac de 56%',
        'Augmentation de la confiance en soi',
        'Amelioration de la clarte du discours',
        'Meilleure connection avec l\'audience'
      ],
      steps: [
        { 
          title: 'Evaluation pre-session', 
          desc: 'Mesurez vos indicateurs actuels pour etablir votre baseline',
          instruction: 'Prenez 2 minutes pour evaluer honnetement votre etat actuel. Ces mesures serviront de point de depart pour mesurer vos progres.',
          action: 'measure'
        },
        { 
          title: 'Visualisation de la cible', 
          desc: 'Imaginez votre audience et l\'environnement de presentation',
          instruction: 'Fermez les yeux. Visualisez la salle, les visages, l\'atmosphere. Ressentez l\'energie positive de votre message.',
          action: 'visualize'
        },
        { 
          title: 'Calibrage energetique', 
          desc: 'Ajustez votre coherence interne selon le modele ASIAP',
          instruction: 'Respirez profondement. Alignez vos intentions (Action), votre savoir (Savoir), votre ressenti (Intuition), votre authenticite (Ame) et votre presence physique.',
          action: 'calibrate'
        },
        { 
          title: 'Projection intentionnelle', 
          desc: 'Simulez mentalement votre discours avec retour du reseau',
          instruction: 'Parcourez mentalement votre presentation. Visualisez les reactions positives, les hochements de tete, l\'engagement de l\'audience.',
          action: 'project'
        },
        { 
          title: 'Ancrage des preceptes', 
          desc: 'Activez les 12 preceptes fractals pour maintenir votre focus',
          instruction: 'Ancrez votre preparation. Repetez mentalement: "Je suis prepare, coherent et authentique. Mon message a de la valeur."',
          action: 'anchor'
        }
      ],
      metrics: ['Ei: +35%', 'SI: +42%', 'R: -28%', 'Conf: +56%']
    },
    {
      id: 'negotiation',
      title: 'Negociation Commerciale',
      icon: '💼',
      color: 'from-blue-500 to-cyan-500',
      duration: '20 min',
      description: 'Optimisez votre strategie de negociation en cartographiant les resistances et en maximisant votre influence',
      benefits: [
        'Taux de closing +45%',
        'Meilleure lecture des interlocuteurs',
        'Reduction des objections',
        'Arguments plus percutants'
      ],
      steps: [
        { 
          title: 'Scan energetique initial', 
          desc: 'Etablissez votre etat de base avant la negociation',
          instruction: 'Evaluez votre niveau d\'energie, de stress et de confiance actuels.',
          action: 'measure'
        },
        { 
          title: 'Cartographie des parties', 
          desc: 'Identifiez les noeuds: decideurs, influenceurs, resistants',
          instruction: 'Listez mentalement les acteurs cles. Qui decide? Qui influence? Quelles sont leurs motivations?',
          action: 'map'
        },
        { 
          title: 'Strategie de projection', 
          desc: 'Definissez vos arguments selon les resistances anticipees',
          instruction: 'Pour chaque objection previsible, preparez une reponse calibree qui reduit la resistance.',
          action: 'strategize'
        },
        { 
          title: 'Simulation interactive', 
          desc: 'Testez mentalement differents scenarios',
          instruction: 'Jouez mentalement la negociation. Testez l\'approche collaborative vs directive. Quelle energie fonctionne mieux?',
          action: 'simulate'
        },
        { 
          title: 'Retroaction adaptative', 
          desc: 'Preparez-vous a ajuster en temps reel',
          instruction: 'Ancrez votre flexibilite: "Je reste a l\'ecoute. J\'adapte mon approche selon les signaux recus."',
          action: 'adapt'
        }
      ],
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
