import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Calculator, Ruler, Zap, FileText, Download, Upload, Share2, ChartBar as BarChart3, ChartPie as PieChart, Cpu, Battery, Thermometer, Activity, PenTool as Tool, Clipboard } from 'lucide-react-native';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
}

export default function ToolsTab() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');

  const tools: ToolItem[] = [
    {
      id: 'resistance-calculator',
      name: 'Resistance Calculator',
      description: 'Calculate resistance, voltage, and current using Ohm\'s law',
      icon: Calculator,
      color: '#10B981',
      category: 'Calculators'
    },
    {
      id: 'pcb-tracer',
      name: 'PCB Trace Analyzer',
      description: 'Analyze and document PCB trace patterns',
      icon: Activity,
      color: '#0066CC',
      category: 'Analysis'
    },
    {
      id: 'component-finder',
      name: 'Component Cross-Reference',
      description: 'Find equivalent components and alternatives',
      icon: Cpu,
      color: '#F59E0B',
      category: 'Reference'
    },
    {
      id: 'power-calculator',
      name: 'Power Calculator',
      description: 'Calculate power consumption and efficiency',
      icon: Battery,
      color: '#EF4444',
      category: 'Calculators'
    },
    {
      id: 'gerber-viewer',
      name: 'Gerber File Viewer',
      description: 'View and analyze Gerber manufacturing files',
      icon: FileText,
      color: '#8B5CF6',
      category: 'Files'
    },
    {
      id: 'bom-generator',
      name: 'BOM Generator',
      description: 'Generate Bill of Materials from PCB analysis',
      icon: Clipboard,
      color: '#06B6D4',
      category: 'Documentation'
    },
    {
      id: 'thermal-analyzer',
      name: 'Thermal Analysis',
      description: 'Analyze heat distribution and thermal performance',
      icon: Thermometer,
      color: '#F97316',
      category: 'Analysis'
    },
    {
      id: 'signal-integrity',
      name: 'Signal Integrity Check',
      description: 'Analyze signal quality and interference',
      icon: BarChart3,
      color: '#84CC16',
      category: 'Analysis'
    },
    {
      id: 'export-tools',
      name: 'Export Tools',
      description: 'Export analysis results and documentation',
      icon: Share2,
      color: '#6366F1',
      category: 'Export'
    }
  ];

  const categories = ['All', 'Calculators', 'Analysis', 'Reference', 'Files', 'Documentation', 'Export'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = tools.filter(tool => 
    selectedCategory === 'All' || tool.category === selectedCategory
  );

  const handleResistanceCalculation = () => {
    try {
      // Simple Ohm's law calculation
      const input = calculatorInput.toLowerCase();
      let result = '';
      
      if (input.includes('v=') && input.includes('i=')) {
        // Calculate resistance: R = V / I
        const voltage = parseFloat(input.match(/v=([0-9.]+)/)?.[1] || '0');
        const current = parseFloat(input.match(/i=([0-9.]+)/)?.[1] || '0');
        if (current !== 0) {
          const resistance = voltage / current;
          result = `Resistance: ${resistance.toFixed(2)} Ω`;
        }
      } else if (input.includes('v=') && input.includes('r=')) {
        // Calculate current: I = V / R
        const voltage = parseFloat(input.match(/v=([0-9.]+)/)?.[1] || '0');
        const resistance = parseFloat(input.match(/r=([0-9.]+)/)?.[1] || '0');
        if (resistance !== 0) {
          const current = voltage / resistance;
          result = `Current: ${current.toFixed(3)} A`;
        }
      } else if (input.includes('i=') && input.includes('r=')) {
        // Calculate voltage: V = I * R
        const current = parseFloat(input.match(/i=([0-9.]+)/)?.[1] || '0');
        const resistance = parseFloat(input.match(/r=([0-9.]+)/)?.[1] || '0');
        const voltage = current * resistance;
        result = `Voltage: ${voltage.toFixed(2)} V`;
      }
      
      setCalculatorResult(result || 'Invalid input format');
    } catch (error) {
      setCalculatorResult('Calculation error');
    }
  };

  const renderToolCard = (tool: ToolItem) => {
    const IconComponent = tool.icon;
    
    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolCard}
        onPress={() => setSelectedTool(tool.id)}
      >
        <View style={[styles.toolIcon, { backgroundColor: tool.color }]}>
          <IconComponent size={24} color="#FFFFFF" />
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolName}>{tool.name}</Text>
          <Text style={styles.toolDescription}>{tool.description}</Text>
        </View>
        <View style={styles.toolArrow}>
          <Text style={styles.toolArrowText}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderToolDetail = () => {
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return null;

    return (
      <View style={styles.toolDetailContainer}>
        <View style={styles.toolDetailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedTool(null)}
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.toolDetailTitle}>{tool.name}</Text>
        </View>

        <ScrollView style={styles.toolDetailContent}>
          {tool.id === 'resistance-calculator' && (
            <View style={styles.calculatorContainer}>
              <Text style={styles.calculatorTitle}>Ohm's Law Calculator</Text>
              <Text style={styles.calculatorInstructions}>
                Enter two values to calculate the third. Use format: V=5 I=0.1 or V=5 R=100
              </Text>
              
              <TextInput
                style={styles.calculatorInput}
                placeholder="e.g., V=5 I=0.1"
                value={calculatorInput}
                onChangeText={setCalculatorInput}
                placeholderTextColor="#9CA3AF"
              />
              
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleResistanceCalculation}
              >
                <Text style={styles.calculateButtonText}>Calculate</Text>
              </TouchableOpacity>
              
              {calculatorResult ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>{calculatorResult}</Text>
                </View>
              ) : null}
              
              <View style={styles.formulaContainer}>
                <Text style={styles.formulaTitle}>Ohm's Law Formulas:</Text>
                <Text style={styles.formulaText}>• V = I × R (Voltage)</Text>
                <Text style={styles.formulaText}>• I = V ÷ R (Current)</Text>
                <Text style={styles.formulaText}>• R = V ÷ I (Resistance)</Text>
                <Text style={styles.formulaText}>• P = V × I (Power)</Text>
              </View>
            </View>
          )}

          {tool.id === 'pcb-tracer' && (
            <View style={styles.toolContainer}>
              <Text style={styles.toolTitle}>PCB Trace Analyzer</Text>
              <Text style={styles.toolDescription}>
                Analyze PCB trace patterns and generate routing documentation.
              </Text>
              
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• Automatic trace width measurement</Text>
                <Text style={styles.featureItem}>• Via detection and classification</Text>
                <Text style={styles.featureItem}>• Layer separation analysis</Text>
                <Text style={styles.featureItem}>• Impedance calculation</Text>
                <Text style={styles.featureItem}>• Export to CAD formats</Text>
              </View>
              
              <TouchableOpacity style={styles.toolButton}>
                <Upload size={16} color="#FFFFFF" />
                <Text style={styles.toolButtonText}>Upload PCB Image</Text>
              </TouchableOpacity>
            </View>
          )}

          {tool.id === 'component-finder' && (
            <View style={styles.toolContainer}>
              <Text style={styles.toolTitle}>Component Cross-Reference</Text>
              <Text style={styles.toolDescription}>
                Find equivalent components and suitable alternatives.
              </Text>
              
              <TextInput
                style={styles.toolInput}
                placeholder="Enter component part number..."
                placeholderTextColor="#9CA3AF"
              />
              
              <TouchableOpacity style={styles.toolButton}>
                <Text style={styles.toolButtonText}>Search Alternatives</Text>
              </TouchableOpacity>
              
              <View style={styles.recentSearches}>
                <Text style={styles.recentTitle}>Recent Searches:</Text>
                <Text style={styles.recentItem}>ATmega328P-PU</Text>
                <Text style={styles.recentItem}>LM7805CT</Text>
                <Text style={styles.recentItem}>ESP32-WROOM-32</Text>
              </View>
            </View>
          )}

          {tool.id === 'bom-generator' && (
            <View style={styles.toolContainer}>
              <Text style={styles.toolTitle}>BOM Generator</Text>
              <Text style={styles.toolDescription}>
                Generate comprehensive Bill of Materials from PCB analysis.
              </Text>
              
              <View style={styles.bomStats}>
                <View style={styles.bomStat}>
                  <Text style={styles.bomStatValue}>47</Text>
                  <Text style={styles.bomStatLabel}>Components</Text>
                </View>
                <View style={styles.bomStat}>
                  <Text style={styles.bomStatValue}>12</Text>
                  <Text style={styles.bomStatLabel}>Unique Parts</Text>
                </View>
                <View style={styles.bomStat}>
                  <Text style={styles.bomStatValue}>$23.45</Text>
                  <Text style={styles.bomStatLabel}>Est. Cost</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.toolButton}>
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.toolButtonText}>Export BOM</Text>
              </TouchableOpacity>
            </View>
          )}

          {!['resistance-calculator', 'pcb-tracer', 'component-finder', 'bom-generator'].includes(tool.id) && (
            <View style={styles.toolContainer}>
              <Text style={styles.toolTitle}>{tool.name}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
              
              <View style={styles.comingSoonContainer}>
                <Tool size={48} color="#6B7280" />
                <Text style={styles.comingSoonText}>Coming Soon</Text>
                <Text style={styles.comingSoonDescription}>
                  This tool is currently under development and will be available in a future update.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
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
          <Text style={styles.headerTitle}>Professional Tools</Text>
          <Text style={styles.headerSubtitle}>Advanced PCB Analysis & Utilities</Text>
        </LinearGradient>
      </View>

      {selectedTool ? (
        renderToolDetail()
      ) : (
        <>
          {/* Category Filter */}
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
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tools Grid */}
          <ScrollView style={styles.content}>
            <View style={styles.toolsGrid}>
              {filteredTools.map(renderToolCard)}
            </View>
          </ScrollView>
        </>
      )}
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
  categoryFilter: {
    marginHorizontal: 16,
    marginVertical: 16,
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
  content: {
    flex: 1,
  },
  toolsGrid: {
    padding: 16,
    gap: 12,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flex: 1,
    marginLeft: 16,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  toolDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  toolArrow: {
    marginLeft: 8,
  },
  toolArrowText: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  toolDetailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toolDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: '#0066CC',
    fontWeight: '600',
  },
  toolDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  toolDetailContent: {
    flex: 1,
    padding: 20,
  },
  calculatorContainer: {},
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  calculatorInstructions: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  calculatorInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  calculateButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  formulaContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  toolContainer: {},
  toolTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  toolButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toolInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  recentSearches: {
    marginTop: 20,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recentItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bomStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bomStat: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  bomStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bomStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});