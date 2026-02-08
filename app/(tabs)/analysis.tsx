import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Zap, Cpu, Battery, Wifi, Volume2, Filter, Search, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ComponentAnalysis {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'faulty';
  confidence: number;
  location: { x: number; y: number };
  specs: string;
}

interface FunctionalBlock {
  id: string;
  name: string;
  components: number;
  status: 'operational' | 'degraded' | 'failed';
  icon: any;
  color: string;
}

export default function AnalysisTab() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ComponentAnalysis | null>(null);

  const mockComponents: ComponentAnalysis[] = [
    {
      id: '1',
      name: 'ATmega328P',
      type: 'Microcontroller',
      status: 'healthy',
      confidence: 98.2,
      location: { x: 45, y: 60 },
      specs: 'TQFP-32, 16MHz, Flash: 32KB'
    },
    {
      id: '2',
      name: 'C1 - 100µF',
      type: 'Capacitor',
      status: 'warning',
      confidence: 76.4,
      location: { x: 25, y: 35 },
      specs: 'Electrolytic, 25V, ESR: High'
    },
    {
      id: '3',
      name: 'R4 - 10kΩ',
      type: 'Resistor',
      status: 'faulty',
      confidence: 94.7,
      location: { x: 70, y: 25 },
      specs: '1206, 5%, Measured: 15.2kΩ'
    },
    {
      id: '4',
      name: 'U2 - LM7805',
      type: 'Voltage Regulator',
      status: 'healthy',
      confidence: 99.1,
      location: { x: 15, y: 80 },
      specs: 'TO-220, 5V, 1A'
    },
  ];

  const functionalBlocks: FunctionalBlock[] = [
    {
      id: '1',
      name: 'Power Supply',
      components: 8,
      status: 'operational',
      icon: Battery,
      color: '#10B981'
    },
    {
      id: '2',
      name: 'Microcontroller',
      components: 12,
      status: 'degraded',
      icon: Cpu,
      color: '#F59E0B'
    },
    {
      id: '3',
      name: 'Communication',
      components: 6,
      status: 'operational',
      icon: Wifi,
      color: '#10B981'
    },
    {
      id: '4',
      name: 'Audio',
      components: 4,
      status: 'failed',
      icon: Volume2,
      color: '#EF4444'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return '#10B981';
      case 'warning':
      case 'degraded':
        return '#F59E0B';
      case 'faulty':
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return CheckCircle2;
      case 'warning':
      case 'degraded':
        return AlertTriangle;
      case 'faulty':
      case 'failed':
        return AlertTriangle;
      default:
        return CheckCircle2;
    }
  };

  const filteredComponents = mockComponents.filter(component => {
    if (selectedFilter === 'all') return true;
    return component.status === selectedFilter;
  });

  const renderPCBVisualization = () => (
    <View style={styles.pcbContainer}>
      <View style={styles.pcbBoard}>
        <Text style={styles.pcbTitle}>Arduino Uno R3 - Component Map</Text>
        {mockComponents.map((component) => {
          const StatusIcon = getStatusIcon(component.status);
          return (
            <TouchableOpacity
              key={component.id}
              style={[
                styles.componentDot,
                {
                  left: `${component.location.x}%`,
                  top: `${component.location.y}%`,
                  backgroundColor: getStatusColor(component.status),
                }
              ]}
              onPress={() => setSelectedAnalysis(component)}
            >
              <StatusIcon size={12} color="#FFFFFF" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderAnalysisDetails = () => {
    if (!selectedAnalysis) return null;

    const StatusIcon = getStatusIcon(selectedAnalysis.status);

    return (
      <View style={styles.analysisDetails}>
        <View style={styles.analysisHeader}>
          <StatusIcon size={20} color={getStatusColor(selectedAnalysis.status)} />
          <Text style={styles.analysisTitle}>{selectedAnalysis.name}</Text>
        </View>
        <Text style={styles.analysisType}>{selectedAnalysis.type}</Text>
        <Text style={styles.analysisSpecs}>{selectedAnalysis.specs}</Text>
        <View style={styles.confidenceBar}>
          <Text style={styles.confidenceLabel}>Confidence: {selectedAnalysis.confidence}%</Text>
          <View style={styles.confidenceTrack}>
            <View 
              style={[
                styles.confidenceFill,
                { width: `${selectedAnalysis.confidence}%` }
              ]} 
            />
          </View>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedAnalysis(null)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#0066CC', '#0052A3']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>PCB Analysis</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Component Diagnostics</Text>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content}>
        {/* Analysis Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.summaryValue}>94.7%</Text>
            <Text style={styles.summaryLabel}>Overall Health</Text>
          </View>
          <View style={styles.summaryCard}>
            <BarChart3 size={24} color="#0066CC" />
            <Text style={styles.summaryValue}>47</Text>
            <Text style={styles.summaryLabel}>Components</Text>
          </View>
          <View style={styles.summaryCard}>
            <AlertTriangle size={24} color="#EF4444" />
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>Issues</Text>
          </View>
        </View>

        {/* PCB Visualization */}
        {renderPCBVisualization()}

        {/* Functional Blocks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Functional Blocks</Text>
          <View style={styles.blocksGrid}>
            {functionalBlocks.map((block) => {
              const IconComponent = block.icon;
              return (
                <View key={block.id} style={styles.blockCard}>
                  <View style={styles.blockHeader}>
                    <IconComponent size={20} color={block.color} />
                    <Text style={styles.blockName}>{block.name}</Text>
                  </View>
                  <Text style={styles.blockComponents}>{block.components} components</Text>
                  <View style={[styles.blockStatus, { backgroundColor: `${block.color}20` }]}>
                    <Text style={[styles.blockStatusText, { color: block.color }]}>
                      {block.status}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Component Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Component Analysis</Text>
          <View style={styles.filterContainer}>
            {['all', 'healthy', 'warning', 'faulty'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Components List */}
        <View style={styles.componentsList}>
          {filteredComponents.map((component) => {
            const StatusIcon = getStatusIcon(component.status);
            return (
              <TouchableOpacity
                key={component.id}
                style={styles.componentCard}
                onPress={() => setSelectedAnalysis(component)}
              >
                <View style={styles.componentHeader}>
                  <StatusIcon size={20} color={getStatusColor(component.status)} />
                  <View style={styles.componentInfo}>
                    <Text style={styles.componentName}>{component.name}</Text>
                    <Text style={styles.componentType}>{component.type}</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceBadgeText}>
                      {component.confidence}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.componentSpecs}>{component.specs}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Analysis Details Modal */}
      {selectedAnalysis && renderAnalysisDetails()}
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
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pcbContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pcbBoard: {
    height: 200,
    backgroundColor: '#1F4A3A',
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pcbTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  componentDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  blocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  blockCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  blockComponents: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  blockStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  blockStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#0066CC',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  componentsList: {
    margin: 16,
    gap: 12,
  },
  componentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  componentType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  confidenceBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  confidenceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  componentSpecs: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 32,
  },
  analysisDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  analysisType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  analysisSpecs: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 16,
  },
  confidenceBar: {
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  confidenceTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#0066CC',
    borderRadius: 2,
  },
  closeButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});