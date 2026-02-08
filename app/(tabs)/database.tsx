import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Database, Search, Filter, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock, Cpu, Zap, Shield, Wifi, BookOpen, FileText, ChartBar as BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PCBRecord {
  id: string;
  model: string;
  manufacturer: string;
  category: string;
  commonFaults: number;
  successRate: number;
  lastUpdated: string;
  description: string;
  status: 'active' | 'archived' | 'priority';
}

interface FaultPattern {
  id: string;
  title: string;
  pcbModel: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  solution: string;
}

export default function DatabaseTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedView, setSelectedView] = useState('pcbs');

  const pcbRecords: PCBRecord[] = [
    {
      id: '1',
      model: 'Arduino Uno R3',
      manufacturer: 'Arduino',
      category: 'Development Board',
      commonFaults: 12,
      successRate: 94.2,
      lastUpdated: '2024-01-15',
      description: 'Popular microcontroller development board based on ATmega328P',
      status: 'active'
    },
    {
      id: '2',
      model: 'Raspberry Pi 4B',
      manufacturer: 'Raspberry Pi Foundation',
      category: 'Single Board Computer',
      commonFaults: 8,
      successRate: 97.8,
      lastUpdated: '2024-01-14',
      description: 'High-performance single-board computer with ARM Cortex-A72',
      status: 'priority'
    },
    {
      id: '3',
      model: 'ESP32-DevKitC',
      manufacturer: 'Espressif',
      category: 'WiFi Module',
      commonFaults: 15,
      successRate: 89.6,
      lastUpdated: '2024-01-13',
      description: 'Wi-Fi and Bluetooth development board',
      status: 'active'
    },
    {
      id: '4',
      model: 'STM32F407G-DISC1',
      manufacturer: 'STMicroelectronics',
      category: 'Discovery Board',
      commonFaults: 6,
      successRate: 96.4,
      lastUpdated: '2024-01-12',
      description: 'ARM Cortex-M4 based discovery board',
      status: 'archived'
    },
  ];

  const faultPatterns: FaultPattern[] = [
    {
      id: '1',
      title: 'Power Regulator Failure',
      pcbModel: 'Arduino Uno R3',
      frequency: 23,
      severity: 'high',
      symptoms: ['No power LED', '5V rail missing', 'USB not recognized'],
      solution: 'Replace LM7805 voltage regulator and check input capacitors'
    },
    {
      id: '2',
      title: 'Crystal Oscillator Issue',
      pcbModel: 'ESP32-DevKitC',
      frequency: 18,
      severity: 'medium',
      symptoms: ['Boot loop', 'WiFi connection fails', 'Unstable operation'],
      solution: 'Check 40MHz crystal and load capacitors, verify grounding'
    },
    {
      id: '3',
      title: 'USB Controller Malfunction',
      pcbModel: 'Arduino Uno R3',
      frequency: 15,
      severity: 'medium',
      symptoms: ['Computer not recognizing device', 'Upload failures'],
      solution: 'Replace ATmega16U2 USB controller, check USB connector'
    },
    {
      id: '4',
      title: 'SD Card Slot Corruption',
      pcbModel: 'Raspberry Pi 4B',
      frequency: 12,
      severity: 'critical',
      symptoms: ['Boot failure', 'File system errors', 'Card not detected'],
      solution: 'Clean SD slot contacts, check power supply stability'
    },
  ];

  const categories = ['all', 'Development Board', 'Single Board Computer', 'WiFi Module', 'Discovery Board'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'priority': return '#F59E0B';
      case 'archived': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#991B1B';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Development Board': return Cpu;
      case 'Single Board Computer': return Shield;
      case 'WiFi Module': return Wifi;
      case 'Discovery Board': return Zap;
      default: return Database;
    }
  };

  const filteredPCBs = pcbRecords.filter(pcb => {
    const matchesSearch = pcb.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pcb.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pcb.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFaults = faultPatterns.filter(fault =>
    fault.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fault.pcbModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPCBCard = (pcb: PCBRecord) => {
    const IconComponent = getCategoryIcon(pcb.category);
    
    return (
      <TouchableOpacity key={pcb.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <IconComponent size={20} color="#0066CC" />
            <View style={styles.cardTitleText}>
              <Text style={styles.cardTitle}>{pcb.model}</Text>
              <Text style={styles.cardSubtitle}>{pcb.manufacturer}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pcb.status) }]}>
            <Text style={styles.statusText}>
              {pcb.status.charAt(0).toUpperCase() + pcb.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription}>{pcb.description}</Text>
        
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <AlertCircle size={16} color="#EF4444" />
            <Text style={styles.statValue}>{pcb.commonFaults}</Text>
            <Text style={styles.statLabel}>Faults</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.statValue}>{pcb.successRate}%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.statValue}>{pcb.lastUpdated}</Text>
            <Text style={styles.statLabel}>Updated</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFaultCard = (fault: FaultPattern) => (
    <TouchableOpacity key={fault.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <AlertCircle size={20} color={getSeverityColor(fault.severity)} />
          <View style={styles.cardTitleText}>
            <Text style={styles.cardTitle}>{fault.title}</Text>
            <Text style={styles.cardSubtitle}>{fault.pcbModel}</Text>
          </View>
        </View>
        <View style={styles.frequencyContainer}>
          <Text style={styles.frequencyValue}>{fault.frequency}</Text>
          <Text style={styles.frequencyLabel}>cases</Text>
        </View>
      </View>
      
      <View style={styles.severityContainer}>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(fault.severity) }]}>
          <Text style={styles.severityText}>
            {fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)} Severity
          </Text>
        </View>
      </View>

      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsTitle}>Common Symptoms:</Text>
        {fault.symptoms.map((symptom, index) => (
          <Text key={index} style={styles.symptomItem}>• {symptom}</Text>
        ))}
      </View>

      <View style={styles.solutionContainer}>
        <Text style={styles.solutionTitle}>Recommended Solution:</Text>
        <Text style={styles.solutionText}>{fault.solution}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#0066CC', '#0052A3']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>PCB Database</Text>
          <Text style={styles.headerSubtitle}>EDGAR - Electronic Data Gathering & Retrieval</Text>
        </LinearGradient>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search PCBs, faults, or models..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedView === 'pcbs' && styles.toggleButtonActive]}
          onPress={() => setSelectedView('pcbs')}
        >
          <Database size={16} color={selectedView === 'pcbs' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.toggleButtonText,
            selectedView === 'pcbs' && styles.toggleButtonTextActive
          ]}>
            PCB Records
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedView === 'faults' && styles.toggleButtonActive]}
          onPress={() => setSelectedView('faults')}
        >
          <AlertCircle size={16} color={selectedView === 'faults' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.toggleButtonText,
            selectedView === 'faults' && styles.toggleButtonTextActive
          ]}>
            Fault Patterns
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter (only for PCBs) */}
      {selectedView === 'pcbs' && (
        <ScrollView 
          horizontal 
          style={styles.categoryFilter}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category === 'all' ? 'All Categories' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FileText size={20} color="#0066CC" />
          <Text style={styles.statCardValue}>{pcbRecords.length}</Text>
          <Text style={styles.statCardLabel}>PCB Models</Text>
        </View>
        <View style={styles.statCard}>
          <AlertCircle size={20} color="#EF4444" />
          <Text style={styles.statCardValue}>{faultPatterns.length}</Text>
          <Text style={styles.statCardLabel}>Fault Patterns</Text>
        </View>
        <View style={styles.statCard}>
          <BarChart3 size={20} color="#10B981" />
          <Text style={styles.statCardValue}>94.1%</Text>
          <Text style={styles.statCardLabel}>Avg Success</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedView === 'pcbs' ? (
          <View style={styles.cardContainer}>
            {filteredPCBs.map(renderPCBCard)}
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {filteredFaults.map(renderFaultCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 80,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 2,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#0066CC',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryFilter: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  statCardLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  frequencyContainer: {
    alignItems: 'center',
  },
  frequencyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  frequencyLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  severityContainer: {
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  symptomsContainer: {
    marginBottom: 12,
  },
  symptomsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  symptomItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  solutionContainer: {},
  solutionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  solutionText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});