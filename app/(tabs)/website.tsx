import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Camera, Database, Cpu, Search, Shield, TrendingUp, Users, Award, CircleCheck as CheckCircle, ArrowRight, Play, Star, Globe, Mail, Phone, MapPin, ChevronDown, Menu, X, ExternalLink, Monitor, Smartphone, Download, Wrench, Microscope, ChartBar as BarChart3, Clock, Target, CircleCheck as CheckCircle2, User, Lock, Eye, EyeOff, CreditCard, Package, Truck, CircleCheck as Check, CircleAlert as AlertCircle, Euro } from 'lucide-react-native';
import AnimatedCounter from '@/components/AnimatedCounter';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProgressBar from '@/components/ProgressBar';
import { useResponsiveDimensions } from '@/hooks/useResponsiveDimensions';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { isDesktop, isWindows, platformSelect } from '@/utils/platform';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  price: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
}

export default function WebsiteTab() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  });
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    description: '',
    urgency: 'normal'
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const { width, height, isDesktop: isDesktopScreen, isMobile } = useResponsiveDimensions();

  // Keyboard shortcuts for desktop navigation
  useKeyboardShortcuts([
    {
      key: 'h',
      altKey: true,
      callback: () => scrollToSection('hero'),
    },
    {
      key: 's',
      altKey: true,
      callback: () => scrollToSection('services'),
    },
    {
      key: 'p',
      altKey: true,
      callback: () => scrollToSection('pricing'),
    },
    {
      key: 'c',
      altKey: true,
      callback: () => scrollToSection('contact'),
    },
    {
      key: 'l',
      ctrlKey: true,
      callback: () => {
        if (!isLoggedIn) setShowLoginModal(true);
      },
    },
  ]);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
  };

  const features: Feature[] = [
    {
      id: 'ai-diagnostics',
      title: 'AI-Powered PCB Diagnostics',
      description: 'Advanced machine learning algorithms analyze PCB layouts, component placement, and trace routing to identify potential issues and optimization opportunities.',
      icon: Cpu,
      color: '#0066CC'
    },
    {
      id: 'component-analysis',
      title: 'Component Analysis & Sourcing',
      description: 'Comprehensive component identification, cross-referencing, and sourcing solutions with real-time availability and pricing from global suppliers.',
      icon: Search,
      color: '#10B981'
    },
    {
      id: 'repair-solutions',
      title: 'Professional Repair Services',
      description: 'Expert PCB repair and refurbishment services using state-of-the-art equipment and proven methodologies for maximum reliability.',
      icon: Wrench,
      color: '#F59E0B'
    },
    {
      id: 'reverse-engineering',
      title: 'Reverse Engineering',
      description: 'Complete PCB reverse engineering services including schematic recreation, BOM generation, and manufacturing documentation.',
      icon: Microscope,
      color: '#EF4444'
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance & Testing',
      description: 'Comprehensive testing protocols including functional testing, environmental stress testing, and compliance verification.',
      icon: Shield,
      color: '#8B5CF6'
    },
    {
      id: 'data-analytics',
      title: 'Performance Analytics',
      description: 'Detailed performance metrics, failure analysis reports, and predictive maintenance recommendations based on historical data.',
      icon: BarChart3,
      color: '#06B6D4'
    }
  ];

  const services: Service[] = [
    {
      id: 'pcb-repair',
      title: 'PCB Repair & Refurbishment',
      description: 'Professional repair services for damaged or faulty PCBs with guaranteed quality and fast turnaround times.',
      icon: Wrench,
      color: '#0066CC',
      price: 'From €45',
      features: [
        'Component-level repair',
        'Trace reconstruction',
        'Via repair and replacement',
        'Conformal coating removal/application',
        'BGA rework and reballing',
        'Quality testing and validation'
      ]
    },
    {
      id: 'ai-analysis',
      title: 'AI-Powered Analysis',
      description: 'Cutting-edge artificial intelligence solutions for automated PCB inspection and fault detection.',
      icon: Cpu,
      color: '#10B981',
      price: 'From €25',
      features: [
        'Automated component identification',
        'Defect detection and classification',
        'Predictive failure analysis',
        'Performance optimization recommendations',
        'Real-time monitoring solutions',
        'Custom AI model development'
      ]
    },
    {
      id: 'reverse-engineering',
      title: 'Reverse Engineering',
      description: 'Complete reverse engineering services for legacy PCBs and electronic systems.',
      icon: Microscope,
      color: '#F59E0B',
      price: 'From €150',
      features: [
        'Schematic recreation',
        'BOM generation',
        'Gerber file creation',
        'Component cross-referencing',
        'Documentation creation',
        'Manufacturing support'
      ]
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '€99',
      period: '/month',
      description: 'Perfect for small businesses and individual projects',
      features: [
        'Up to 10 PCB analyses per month',
        'Basic AI diagnostics',
        'Email support',
        'Standard turnaround (48h)',
        'Basic reporting',
        'Component identification',
        'Mobile app access'
      ],
      color: '#6B7280'
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '€299',
      period: '/month',
      description: 'Ideal for growing companies and regular projects',
      features: [
        'Up to 50 PCB analyses per month',
        'Advanced AI diagnostics',
        'Priority support',
        'Fast turnaround (24h)',
        'Detailed reporting',
        'Component sourcing assistance',
        'API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: true,
      color: '#0066CC'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '€799',
      period: '/month',
      description: 'For large organizations with high-volume needs',
      features: [
        'Unlimited PCB analyses',
        'Full AI suite access',
        '24/7 premium support',
        'Express turnaround (12h)',
        'Advanced analytics',
        'Custom AI model training',
        'On-site consultation',
        'White-label solutions',
        'SLA guarantees',
        'Bulk pricing discounts'
      ],
      color: '#10B981'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Marko Petrović',
      role: 'Lead Electronics Engineer',
      company: 'TechSolutions Sarajevo',
      content: 'AI-Electronics Lab transformed our repair process. Their AI diagnostics identified issues we missed for months. Exceptional service and expertise.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Ana Kovačević',
      role: 'Production Manager',
      company: 'ElektroServis BiH',
      content: 'The reverse engineering service helped us reproduce critical legacy boards. Professional team with deep technical knowledge.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Stefan Nikolić',
      role: 'R&D Director',
      company: 'Innovation Labs Belgrade',
      content: 'Outstanding quality and attention to detail. Their AI-powered analysis saved us weeks of manual inspection work.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const stats = [
    { label: 'PCBs Analyzed', value: '10K+' },
    { label: 'Success Rate', value: '98.5%' },
    { label: 'Avg. Turnaround', value: '24h' },
    { label: 'Happy Clients', value: '200+' }
  ];

  // Authentication functions
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setCurrentUser({
        id: '1',
        email: loginForm.email,
        name: 'John Doe',
        company: 'Tech Solutions'
      });
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      Alert.alert('Success', 'Welcome back!');
    }, 1500);
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setCurrentUser({
        id: '2',
        email: registerForm.email,
        name: registerForm.name,
        company: registerForm.company,
        phone: registerForm.phone
      });
      setShowRegisterModal(false);
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: ''
      });
      Alert.alert('Success', 'Account created successfully!');
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    Alert.alert('Success', 'Logged out successfully');
  };

  const handlePlanSelection = (plan: PricingPlan) => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please login to subscribe to a plan');
      setShowLoginModal(true);
      return;
    }
    setSelectedPlan(plan);
    setShowPricingModal(true);
  };

  const handleSubscription = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setShowPricingModal(false);
      Alert.alert('Success', `Successfully subscribed to ${selectedPlan.name}!`);
    }, 2000);
  };

  const handleQuoteSubmit = async () => {
    if (!quoteForm.name || !quoteForm.email || !quoteForm.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    // Simulate quote submission
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Quote request submitted! We\'ll contact you within 24 hours.');
      setQuoteForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        description: '',
        urgency: 'normal'
      });
    }, 1500);
  };

  const handleContactPress = () => {
    const url = 'mailto:info@electronicslab.eu';
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handlePhonePress = (phone: string) => {
    const url = `tel:${phone}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleWebsitePress = () => {
    const url = 'https://electronicslab.eu';
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <View style={styles.navContent}>
        <View style={styles.navBrand}>
          <Zap size={32} color="#0066CC" />
          <Text style={styles.navBrandText}>AI-Electronics Lab</Text>
        </View>
        
        {isDesktopScreen ? (
          <View style={styles.navLinks}>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Contact</Text>
            </TouchableOpacity>
            
            {isLoggedIn ? (
              <View style={styles.userMenu}>
                <Text style={styles.welcomeText}>Welcome, {currentUser?.name}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.loginButton} onPress={() => setShowLoginModal(true)}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => setShowRegisterModal(true)}>
                  <Text style={styles.navButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.mobileMenuButton}
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} color="#1F2937" />
            ) : (
              <Menu size={24} color="#1F2937" />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {mobileMenuOpen && !isDesktopScreen && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text style={styles.mobileMenuText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text style={styles.mobileMenuText}>Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text style={styles.mobileMenuText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text style={styles.mobileMenuText}>Contact</Text>
          </TouchableOpacity>
          
          {isLoggedIn ? (
            <>
              <Text style={styles.mobileWelcome}>Welcome, {currentUser?.name}</Text>
              <TouchableOpacity style={styles.mobileMenuButton} onPress={handleLogout}>
                <Text style={styles.mobileMenuButtonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.mobileMenuItem} onPress={() => setShowLoginModal(true)}>
                <Text style={styles.mobileMenuText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileMenuButton} onPress={() => setShowRegisterModal(true)}>
                <Text style={styles.mobileMenuButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );

  const renderLoginModal = () => (
    <Modal visible={showLoginModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Login to Your Account</Text>
            <TouchableOpacity onPress={() => setShowLoginModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={loginForm.email}
                onChangeText={(text) => setLoginForm({...loginForm, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChangeText={(text) => setLoginForm({...loginForm, password: text})}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner size={20} color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}>
              <Text style={styles.switchModalText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderRegisterModal = () => (
    <Modal visible={showRegisterModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.modalScrollContent}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Your Account</Text>
              <TouchableOpacity onPress={() => setShowRegisterModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={registerForm.name}
                  onChangeText={(text) => setRegisterForm({...registerForm, name: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your company name"
                  value={registerForm.company}
                  onChangeText={(text) => setRegisterForm({...registerForm, company: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  value={registerForm.phone}
                  onChangeText={(text) => setRegisterForm({...registerForm, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    value={registerForm.password}
                    onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  value={registerForm.confirmPassword}
                  onChangeText={(text) => setRegisterForm({...registerForm, confirmPassword: text})}
                  secureTextEntry={true}
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner size={20} color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}>
                <Text style={styles.switchModalText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderPricingModal = () => (
    <Modal visible={showPricingModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Subscribe to {selectedPlan?.name}</Text>
            <TouchableOpacity onPress={() => setShowPricingModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {selectedPlan && (
            <View style={styles.subscriptionContainer}>
              <View style={styles.planSummary}>
                <Text style={styles.planSummaryTitle}>{selectedPlan.name}</Text>
                <Text style={styles.planSummaryPrice}>{selectedPlan.price}{selectedPlan.period}</Text>
                <Text style={styles.planSummaryDescription}>{selectedPlan.description}</Text>
              </View>
              
              <View style={styles.paymentSection}>
                <Text style={styles.paymentTitle}>Payment Information</Text>
                <View style={styles.paymentMethod}>
                  <CreditCard size={20} color="#0066CC" />
                  <Text style={styles.paymentMethodText}>Credit Card (Secure Payment)</Text>
                </View>
                <Text style={styles.paymentNote}>
                  Your subscription will be processed securely. You can cancel anytime.
                </Text>
              </View>
              
              <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscription} disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner size={20} color="#FFFFFF" />
                ) : (
                  <>
                    <Euro size={20} color="#FFFFFF" />
                    <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <LinearGradient
        colors={['#0066CC', '#0052A3', '#003D7A']}
        style={styles.heroGradient}
      >
        <View style={[styles.heroContent, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
          <View style={[styles.heroText, { maxWidth: isDesktopScreen ? '55%' : '100%' }]}>
            <Text style={[styles.heroTitle, { fontSize: isDesktopScreen ? 48 : 32 }]}>
              Professional PCB Repair & AI Diagnostics
            </Text>
            <Text style={[styles.heroSubtitle, { fontSize: isDesktopScreen ? 20 : 16 }]}>
              Leading PCB repair laboratory in Bosnia and Herzegovina, specializing in advanced AI-powered diagnostics, 
              component-level repair, and reverse engineering services for industrial and consumer electronics.
            </Text>
            
            <View style={styles.credentialsBadges}>
              <View style={styles.credentialBadge}>
                <MapPin size={16} color="#10B981" />
                <Text style={styles.credentialText}>Sarajevo, BiH</Text>
              </View>
              <View style={styles.credentialBadge}>
                <Award size={16} color="#10B981" />
                <Text style={styles.credentialText}>ISO Certified</Text>
              </View>
              <View style={styles.credentialBadge}>
                <Clock size={16} color="#10B981" />
                <Text style={styles.credentialText}>24h Turnaround</Text>
              </View>
            </View>
            
            <View style={[styles.heroButtons, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => scrollToSection('quote')}>
                <Target size={20} color="#0066CC" />
                <Text style={styles.primaryButtonText}>Get Free Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handlePhonePress('+38760308000')}>
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.heroFeatures, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
              <View style={styles.heroFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>AI-Powered Analysis</Text>
              </View>
              <View style={styles.heroFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>Expert Technicians</Text>
              </View>
              <View style={styles.heroFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>Quality Guarantee</Text>
              </View>
            </View>

            {isDesktop && (
              <Text style={styles.keyboardHints}>
                Keyboard shortcuts: Alt+H (Home) • Alt+S (Services) • Alt+P (Pricing) • Alt+C (Contact) • Ctrl+L (Login)
              </Text>
            )}
          </View>
          
          <View style={[styles.heroImage, { maxWidth: isDesktopScreen ? '40%' : '100%' }]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' }}
              style={[styles.heroImageStyle, { height: isDesktopScreen ? 400 : 250 }]}
              resizeMode="cover"
            />
            <View style={styles.heroImageOverlay}>
              <View style={styles.scanningAnimation}>
                <LinearGradient
                  colors={['transparent', '#00FF88', 'transparent']}
                  style={styles.scanLine}
                />
              </View>
              <View style={styles.analysisOverlay}>
                <View style={styles.analysisBox}>
                  <Text style={styles.analysisText}>AI Analysis Active</Text>
                  <ProgressBar progress={92} height={4} />
                  <Text style={styles.analysisSubtext}>Component identification: 92%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <AnimatedCounter value={stat.value} style={styles.statValue} />
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderServicesSection = () => (
    <View style={styles.servicesSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontSize: isDesktopScreen ? 36 : 28 }]}>
          Our Services
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: isDesktopScreen ? 18 : 16 }]}>
          Comprehensive PCB solutions from diagnosis to repair and beyond
        </Text>
      </View>
      <View style={styles.servicesGrid}>
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <View 
              key={service.id} 
              style={[
                styles.serviceCard,
                { width: isDesktopScreen ? 380 : width - 40 }
              ]}
            >
              <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                <IconComponent size={32} color="#FFFFFF" />
              </View>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceFeatures}>
                {service.features.map((feature, idx) => (
                  <View key={idx} style={styles.serviceFeature}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <Text style={styles.serviceFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.serviceButton}>
                <Text style={styles.serviceButtonText}>Request Service</Text>
                <ArrowRight size={16} color={service.color} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderPricingSection = () => (
    <View style={styles.pricingSection}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF']}
        style={styles.pricingGradient}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: isDesktopScreen ? 36 : 28 }]}>
            Subscription Plans
          </Text>
          <Text style={[styles.sectionSubtitle, { fontSize: isDesktopScreen ? 18 : 16 }]}>
            Choose the perfect plan for your PCB analysis needs
          </Text>
        </View>
        <View style={[styles.pricingGrid, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
          {pricingPlans.map((plan) => (
            <View 
              key={plan.id} 
              style={[
                styles.pricingCard,
                plan.popular && styles.pricingCardPopular,
                isDesktopScreen && plan.popular && { transform: [{ scale: 1.05 }] }
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planPrice}>
                <Text style={styles.planPriceText}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
              <Text style={styles.planDescription}>{plan.description}</Text>
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeature}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={[
                  styles.planButton,
                  plan.popular && styles.planButtonPopular
                ]}
                onPress={() => handlePlanSelection(plan)}
              >
                <Text style={[
                  styles.planButtonText,
                  plan.popular && styles.planButtonTextPopular
                ]}>
                  Subscribe Now
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.pricingNote}>
          <Text style={styles.pricingNoteText}>
            All plans include 14-day free trial • No setup fees • Cancel anytime • EU VAT included
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderQuoteSection = () => (
    <View style={styles.quoteSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontSize: isDesktopScreen ? 36 : 28 }]}>
          Request a Quote
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: isDesktopScreen ? 18 : 16 }]}>
          Get a personalized quote for your PCB repair or analysis project
        </Text>
      </View>
      
      <View style={[styles.quoteContainer, { maxWidth: isDesktopScreen ? 600 : '100%' }]}>
        <View style={styles.quoteForm}>
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Your full name"
                value={quoteForm.name}
                onChangeText={(text) => setQuoteForm({...quoteForm, name: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="your@email.com"
                value={quoteForm.email}
                onChangeText={(text) => setQuoteForm({...quoteForm, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Company</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Company name"
                value={quoteForm.company}
                onChangeText={(text) => setQuoteForm({...quoteForm, company: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Phone number"
                value={quoteForm.phone}
                onChangeText={(text) => setQuoteForm({...quoteForm, phone: text})}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Type</Text>
            <View style={styles.serviceSelector}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceSelectorItem,
                    quoteForm.service === service.id && styles.serviceSelectorItemActive
                  ]}
                  onPress={() => setQuoteForm({...quoteForm, service: service.id})}
                >
                  <Text style={[
                    styles.serviceSelectorText,
                    quoteForm.service === service.id && styles.serviceSelectorTextActive
                  ]}>
                    {service.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Project Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your PCB repair or analysis requirements..."
              value={quoteForm.description}
              onChangeText={(text) => setQuoteForm({...quoteForm, description: text})}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Urgency</Text>
            <View style={styles.urgencySelector}>
              {[
                { id: 'normal', label: 'Normal (3-5 days)', color: '#10B981' },
                { id: 'urgent', label: 'Urgent (1-2 days)', color: '#F59E0B' },
                { id: 'emergency', label: 'Emergency (24h)', color: '#EF4444' }
              ].map((urgency) => (
                <TouchableOpacity
                  key={urgency.id}
                  style={[
                    styles.urgencyItem,
                    quoteForm.urgency === urgency.id && { borderColor: urgency.color }
                  ]}
                  onPress={() => setQuoteForm({...quoteForm, urgency: urgency.id})}
                >
                  <View style={[
                    styles.urgencyIndicator,
                    { backgroundColor: urgency.color },
                    quoteForm.urgency === urgency.id && styles.urgencyIndicatorActive
                  ]} />
                  <Text style={styles.urgencyLabel}>{urgency.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.quoteSubmitButton} onPress={handleQuoteSubmit} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size={20} color="#FFFFFF" />
            ) : (
              <>
                <Target size={20} color="#FFFFFF" />
                <Text style={styles.quoteSubmitButtonText}>Submit Quote Request</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTestimonialsSection = () => (
    <View style={styles.testimonialsSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontSize: isDesktopScreen ? 36 : 28 }]}>
          Client Testimonials
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: isDesktopScreen ? 18 : 16 }]}>
          Trusted by leading companies across the Balkans
        </Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.testimonialsScroll}
        contentContainerStyle={styles.testimonialsContent}
      >
        {testimonials.map((testimonial) => (
          <View 
            key={testimonial.id} 
            style={[
              styles.testimonialCard,
              { width: isDesktopScreen ? 400 : 300 }
            ]}
          >
            <View style={styles.testimonialRating}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.testimonialContent}>"{testimonial.content}"</Text>
            <View style={styles.testimonialAuthor}>
              <Image
                source={{ uri: testimonial.avatar }}
                style={styles.testimonialAvatar}
              />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                <Text style={styles.testimonialCompany}>{testimonial.company}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAppDownloadSection = () => (
    <View style={styles.appSection}>
      <LinearGradient
        colors={['#0066CC', '#0052A3']}
        style={styles.appGradient}
      >
        <View style={[styles.appContent, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
          <View style={styles.appInfo}>
            <Text style={[styles.appTitle, { fontSize: isDesktopScreen ? 32 : 24 }]}>
              AI-Electronics Lab Mobile App
            </Text>
            <Text style={styles.appSubtitle}>
              Take our AI-powered PCB diagnostics with you. Scan, analyze, and get instant results on your mobile device.
            </Text>
            <View style={styles.appFeatures}>
              <View style={styles.appFeature}>
                <Camera size={20} color="#E5E7EB" />
                <Text style={styles.appFeatureText}>Real-time PCB scanning</Text>
              </View>
              <View style={styles.appFeature}>
                <Cpu size={20} color="#E5E7EB" />
                <Text style={styles.appFeatureText}>AI-powered analysis</Text>
              </View>
              <View style={styles.appFeature}>
                <Database size={20} color="#E5E7EB" />
                <Text style={styles.appFeatureText}>Offline component database</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={20} color="#0066CC" />
              <Text style={styles.downloadButtonText}>Download Android App</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.appImage, { width: isDesktopScreen ? 300 : '100%' }]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop' }}
              style={[styles.appImageStyle, { height: isDesktopScreen ? 300 : 200 }]}
              resizeMode="cover"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderContactSection = () => (
    <View style={styles.contactSection}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.contactGradient}
      >
        <View style={[styles.contactContent, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactTitle, { fontSize: isDesktopScreen ? 36 : 28 }]}>
              Get In Touch
            </Text>
            <Text style={styles.contactSubtitle}>
              Ready to repair your PCBs or need a consultation? Contact our expert team today.
            </Text>
            <View style={styles.contactDetails}>
              <TouchableOpacity style={styles.contactItem} onPress={handleContactPress}>
                <Mail size={20} color="#FFFFFF" />
                <Text style={styles.contactItemText}>info@electronicslab.eu</Text>
                <ExternalLink size={16} color="#E5E7EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={() => handlePhonePress('+12534106997')}>
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.contactItemText}>+1 253 410 6997</Text>
                <ExternalLink size={16} color="#E5E7EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={() => handlePhonePress('+38760308000')}>
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.contactItemText}>+387 60 308 0000</Text>
                <ExternalLink size={16} color="#E5E7EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
                <Globe size={20} color="#FFFFFF" />
                <Text style={styles.contactItemText}>electronicslab.eu</Text>
                <ExternalLink size={16} color="#E5E7EB" />
              </TouchableOpacity>
              <View style={styles.contactItem}>
                <MapPin size={20} color="#FFFFFF" />
                <View style={styles.addressContainer}>
                  <Text style={styles.contactItemText}>Marsala Tita 8</Text>
                  <Text style={styles.contactItemText}>71000 Sarajevo</Text>
                  <Text style={styles.contactItemText}>Bosnia and Herzegovina</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.contactForm, { width: isDesktopScreen ? 400 : '100%' }]}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => scrollToSection('quote')}>
              <Text style={styles.ctaButtonText}>Request Quote</Text>
              <ArrowRight size={20} color="#0066CC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaButtonSecondary} onPress={() => handlePhonePress('+38760308000')}>
              <Text style={styles.ctaButtonSecondaryText}>Call for Emergency Repair</Text>
            </TouchableOpacity>
            <Text style={styles.ctaNote}>
              Free consultation • 24h emergency service • Quality guarantee
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={[styles.footerContent, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
        <View style={styles.footerSection}>
          <View style={styles.footerBrand}>
            <Zap size={32} color="#0066CC" />
            <Text style={styles.footerTitle}>AI-Electronics Lab</Text>
          </View>
          <Text style={styles.footerDescription}>
            Leading PCB repair and diagnostics laboratory in Bosnia and Herzegovina. 
            Specializing in AI-powered analysis, component-level repair, and reverse engineering.
          </Text>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactText}>Marsala Tita 8, 71000 Sarajevo</Text>
            <Text style={styles.footerContactText}>Bosnia and Herzegovina</Text>
          </View>
        </View>
        
        <View style={styles.footerSection}>
          <Text style={styles.footerSectionTitle}>Services</Text>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLink}>PCB Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLink}>AI Diagnostics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLink}>Reverse Engineering</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton}>
            <Text style={styles.footerLink}>Component Sourcing</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footerSection}>
          <Text style={styles.footerSectionTitle}>Account</Text>
          {isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.footerLinkButton}>
                <Text style={styles.footerLink}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLinkButton}>
                <Text style={styles.footerLink}>My Projects</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLinkButton}>
                <Text style={styles.footerLink}>Billing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLinkButton} onPress={handleLogout}>
                <Text style={styles.footerLink}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.footerLinkButton} onPress={() => setShowLoginModal(true)}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLinkButton} onPress={() => setShowRegisterModal(true)}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <View style={styles.footerSection}>
          <Text style={styles.footerSectionTitle}>Contact</Text>
          <TouchableOpacity style={styles.footerLinkButton} onPress={handleContactPress}>
            <Text style={styles.footerLink}>info@electronicslab.eu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton} onPress={() => handlePhonePress('+12534106997')}>
            <Text style={styles.footerLink}>+1 253 410 6997</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton} onPress={() => handlePhonePress('+38760308000')}>
            <Text style={styles.footerLink}>+387 60 308 0000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLinkButton} onPress={handleWebsitePress}>
            <Text style={styles.footerLink}>electronicslab.eu</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.footerBottom, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
        <Text style={styles.footerCopyright}>
          © 2024 AI-Electronics Lab. All rights reserved. VAT: BA123456789
        </Text>
        <View style={[styles.footerLegal, { flexDirection: isDesktopScreen ? 'row' : 'column' }]}>
          <TouchableOpacity>
            <Text style={styles.footerLegalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLegalLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLegalLink}>Quality Guarantee</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderNavigation()}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        {renderStatsSection()}
        {renderServicesSection()}
        {renderPricingSection()}
        {renderQuoteSection()}
        {renderTestimonialsSection()}
        {renderAppDownloadSection()}
        {renderContactSection()}
        {renderFooter()}
      </ScrollView>
      
      {/* Modals */}
      {renderLoginModal()}
      {renderRegisterModal()}
      {renderPricingModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  
  // Navigation
  navigation: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBrandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  navButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#374151',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  logoutButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  mobileMenuButton: {
    padding: 8,
  },
  mobileMenu: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
  },
  mobileMenuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  mobileMenuText: {
    fontSize: 16,
    color: '#6B7280',
  },
  mobileWelcome: {
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  mobileMenuButton: {
    backgroundColor: '#0066CC',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileMenuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formContainer: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModalText: {
    textAlign: 'center',
    color: '#0066CC',
    fontSize: 14,
    marginTop: 16,
  },

  // Subscription Modal
  subscriptionContainer: {
    gap: 20,
  },
  planSummary: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  planSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planSummaryPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066CC',
    marginVertical: 8,
  },
  planSummaryDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  paymentSection: {
    gap: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  paymentNote: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Hero Section
  heroSection: {
    minHeight: platformSelect({ desktop: 600, mobile: 500, default: 500 }),
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: platformSelect({ desktop: 56, mobile: 40, default: 40 }),
    marginBottom: 20,
  },
  heroSubtitle: {
    color: '#E5E7EB',
    lineHeight: platformSelect({ desktop: 30, mobile: 24, default: 24 }),
    marginBottom: 24,
  },
  credentialsBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  credentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  credentialText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroButtons: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroFeatures: {
    gap: 16,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroFeatureText: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  keyboardHints: {
    fontSize: 12,
    color: '#B3D4FC',
    marginTop: 16,
    fontStyle: 'italic',
  },
  heroImage: {
    flex: 1,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroImageStyle: {
    width: '100%',
    borderRadius: 20,
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
  },
  scanningAnimation: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
  },
  scanLine: {
    flex: 1,
    borderRadius: 2,
  },
  analysisOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  analysisBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  analysisText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisSubtext: {
    color: '#E5E7EB',
    fontSize: 10,
    marginTop: 4,
  },

  // Stats Section
  statsSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    minWidth: platformSelect({ desktop: 150, mobile: 120, default: 120 }),
  },
  statValue: {
    fontSize: platformSelect({ desktop: 48, mobile: 36, default: 36 }),
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Section Headers
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },

  // Services Section
  servicesSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  serviceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  serviceFeatures: {
    marginBottom: 24,
    gap: 8,
  },
  serviceFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceFeatureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  serviceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },

  // Pricing Section
  pricingSection: {
    paddingVertical: 80,
  },
  pricingGradient: {
    paddingHorizontal: 20,
  },
  pricingGrid: {
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    flex: platformSelect({ desktop: 1, mobile: undefined, default: undefined }),
    maxWidth: platformSelect({ desktop: 350, mobile: undefined, default: undefined }),
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  pricingCardPopular: {
    borderColor: '#0066CC',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 32,
    right: 32,
    backgroundColor: '#0066CC',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  planPriceText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  planPeriod: {
    fontSize: 16,
    color: '#6B7280',
  },
  planDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  planFeatures: {
    marginBottom: 32,
    gap: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planFeatureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  planButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonPopular: {
    backgroundColor: '#0066CC',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  planButtonTextPopular: {
    color: '#FFFFFF',
  },
  pricingNote: {
    alignItems: 'center',
  },
  pricingNoteText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Quote Section
  quoteSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  quoteContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  quoteForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  serviceSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceSelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  serviceSelectorItemActive: {
    borderColor: '#0066CC',
    backgroundColor: '#EBF8FF',
  },
  serviceSelectorText: {
    fontSize: 14,
    color: '#6B7280',
  },
  serviceSelectorTextActive: {
    color: '#0066CC',
    fontWeight: '600',
  },
  urgencySelector: {
    gap: 12,
  },
  urgencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  urgencyIndicatorActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  urgencyLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  quoteSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  quoteSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Testimonials Section
  testimonialsSection: {
    paddingVertical: 80,
    backgroundColor: '#FFFFFF',
  },
  testimonialsScroll: {
    paddingLeft: 20,
  },
  testimonialsContent: {
    paddingRight: 20,
  },
  testimonialCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
    marginRight: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  testimonialRating: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  testimonialContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  testimonialRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  testimonialCompany: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },

  // App Download Section
  appSection: {
    paddingVertical: 80,
  },
  appGradient: {
    paddingHorizontal: 20,
  },
  appContent: {
    alignItems: 'center',
    gap: 40,
  },
  appInfo: {
    flex: 1,
  },
  appTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 28,
    marginBottom: 24,
  },
  appFeatures: {
    marginBottom: 32,
    gap: 12,
  },
  appFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appFeatureText: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },
  appImage: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  appImageStyle: {
    width: '100%',
    borderRadius: 20,
  },

  // Contact Section
  contactSection: {
    paddingVertical: 80,
  },
  contactGradient: {
    paddingHorizontal: 20,
  },
  contactContent: {
    alignItems: 'flex-start',
    gap: 40,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  contactSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 28,
    marginBottom: 32,
  },
  contactDetails: {
    gap: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  addressContainer: {
    flex: 1,
  },
  contactForm: {
    gap: 16,
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  ctaButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ctaNote: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },

  // Footer
  footer: {
    backgroundColor: '#1F2937',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  footerContent: {
    justifyContent: 'space-between',
    gap: 40,
    marginBottom: 40,
  },
  footerSection: {
    flex: 1,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
    marginBottom: 20,
  },
  footerContact: {
    gap: 4,
  },
  footerContactText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footerSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  footerLinkButton: {
    paddingVertical: 4,
  },
  footerLink: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  footerCopyright: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footerLegal: {
    gap: 24,
  },
  footerLegalLink: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});