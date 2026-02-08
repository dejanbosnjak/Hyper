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
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Search, Filter, ExternalLink, Star, TrendingUp, DollarSign, Truck, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, MapPin, Phone, Globe } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Component {
  id: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  category: string;
  package: string;
  specifications: string[];
  datasheet?: string;
  image?: string;
}

interface Supplier {
  id: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  leadTime: string;
  minimumOrder: number;
  rating: number;
  verified: boolean;
  location: string;
  website: string;
}

interface ComponentListing {
  component: Component;
  suppliers: Supplier[];
}

export default function ComponentsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState<ComponentListing | null>(null);
  const [sortBy, setSortBy] = useState('price');

  const mockComponents: ComponentListing[] = [
    {
      component: {
        id: '1',
        partNumber: 'ATmega328P-PU',
        description: '8-bit AVR Microcontroller, 32KB Flash, 28-pin PDIP',
        manufacturer: 'Microchip Technology',
        category: 'Microcontrollers',
        package: 'PDIP-28',
        specifications: [
          'Flash Memory: 32KB',
          'SRAM: 2KB',
          'EEPROM: 1KB',
          'Operating Voltage: 1.8-5.5V',
          'Max Frequency: 20MHz'
        ],
        datasheet: 'https://example.com/atmega328p-datasheet.pdf'
      },
      suppliers: [
        {
          id: '1',
          name: 'Digi-Key Electronics',
          price: 2.45,
          currency: 'USD',
          stock: 15420,
          leadTime: '1-2 days',
          minimumOrder: 1,
          rating: 4.9,
          verified: true,
          location: 'USA',
          website: 'https://digikey.com'
        },
        {
          id: '2',
          name: 'Mouser Electronics',
          price: 2.38,
          currency: 'USD',
          stock: 8750,
          leadTime: '1-3 days',
          minimumOrder: 1,
          rating: 4.8,
          verified: true,
          location: 'USA',
          website: 'https://mouser.com'
        },
        {
          id: '3',
          name: 'Arrow Electronics',
          price: 2.52,
          currency: 'USD',
          stock: 12300,
          leadTime: '2-4 days',
          minimumOrder: 10,
          rating: 4.7,
          verified: true,
          location: 'Global',
          website: 'https://arrow.com'
        }
      ]
    },
    {
      component: {
        id: '2',
        partNumber: 'LM7805CT',
        description: '5V Positive Voltage Regulator, 1A, TO-220',
        manufacturer: 'STMicroelectronics',
        category: 'Voltage Regulators',
        package: 'TO-220',
        specifications: [
          'Output Voltage: 5V',
          'Output Current: 1A',
          'Input Voltage: 7-25V',
          'Line Regulation: 4mV',
          'Load Regulation: 25mV'
        ]
      },
      suppliers: [
        {
          id: '4',
          name: 'Newark',
          price: 0.89,
          currency: 'USD',
          stock: 25600,
          leadTime: '1-2 days',
          minimumOrder: 1,
          rating: 4.6,
          verified: true,
          location: 'USA',
          website: 'https://newark.com'
        },
        {
          id: '5',
          name: 'RS Components',
          price: 0.92,
          currency: 'USD',
          stock: 18900,
          leadTime: '2-3 days',
          minimumOrder: 5,
          rating: 4.5,
          verified: true,
          location: 'UK',
          website: 'https://rs-online.com'
        }
      ]
    },
    {
      component: {
        id: '3',
        partNumber: 'ESP32-WROOM-32',
        description: 'WiFi + Bluetooth Module, PCB Antenna',
        manufacturer: 'Espressif Systems',
        category: 'RF Modules',
        package: 'SMD',
        specifications: [
          'CPU: Dual-core Xtensa 32-bit',
          'Flash: 4MB',
          'SRAM: 520KB',
          'WiFi: 802.11 b/g/n',
          'Bluetooth: v4.2 BR/EDR and BLE'
        ]
      },
      suppliers: [
        {
          id: '6',
          name: 'Adafruit',
          price: 3.95,
          currency: 'USD',
          stock: 890,
          leadTime: '3-5 days',
          minimumOrder: 1,
          rating: 4.8,
          verified: true,
          location: 'USA',
          website: 'https://adafruit.com'
        },
        {
          id: '7',
          name: 'SparkFun',
          price: 4.25,
          currency: 'USD',
          stock: 1240,
          leadTime: '2-4 days',
          minimumOrder: 1,
          rating: 4.7,
          verified: true,
          location: 'USA',
          website: 'https://sparkfun.com'
        }
      ]
    }
  ];

  const categories = ['all', 'Microcontrollers', 'Voltage Regulators', 'RF Modules', 'Capacitors', 'Resistors'];

  const filteredComponents = mockComponents.filter(item => {
    const component = item.component;
    const matchesSearch = 
      component.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortSuppliers = (suppliers: Supplier[]) => {
    return [...suppliers].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'rating':
          return b.rating - a.rating;
        case 'leadTime':
          return a.leadTime.localeCompare(b.leadTime);
        default:
          return 0;
      }
    });
  };

  const handleSupplierContact = (supplier: Supplier) => {
    Linking.openURL(supplier.website);
  };

  const renderComponentCard = (listing: ComponentListing) => {
    const { component, suppliers } = listing;
    const bestPrice = Math.min(...suppliers.map(s => s.price));
    const totalStock = suppliers.reduce((sum, s) => sum + s.stock, 0);
    
    return (
      <TouchableOpacity
        key={component.id}
        style={styles.componentCard}
        onPress={() => setSelectedComponent(listing)}
      >
        <View style={styles.componentHeader}>
          <Package size={20} color="#0066CC" />
          <View style={styles.componentInfo}>
            <Text style={styles.componentPartNumber}>{component.partNumber}</Text>
            <Text style={styles.componentManufacturer}>{component.manufacturer}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.priceValue}>${bestPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.componentDescription}>{component.description}</Text>
        
        <View style={styles.componentDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Package:</Text>
            <Text style={styles.detailValue}>{component.package}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{component.category}</Text>
          </View>
        </View>
        
        <View style={styles.componentFooter}>
          <View style={styles.supplierCount}>
            <Text style={styles.supplierCountText}>
              {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.stockInfo}>
            <Text style={styles.stockValue}>{totalStock.toLocaleString()}</Text>
            <Text style={styles.stockLabel}>in stock</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSupplierDetail = () => {
    if (!selectedComponent) return null;

    const { component, suppliers } = selectedComponent;
    const sortedSuppliers = sortSuppliers(suppliers);

    return (
      <View style={styles.detailContainer}>
        <ScrollView style={styles.detailScroll}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{component.partNumber}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedComponent(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.detailDescription}>{component.description}</Text>
          
          <View style={styles.specificationsContainer}>
            <Text style={styles.specificationsTitle}>Specifications:</Text>
            {component.specifications.map((spec, index) => (
              <Text key={index} style={styles.specificationItem}>• {spec}</Text>
            ))}
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <View style={styles.sortButtons}>
              {['price', 'stock', 'rating', 'leadTime'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortButton,
                    sortBy === option && styles.sortButtonActive
                  ]}
                  onPress={() => setSortBy(option)}
                >
                  <Text style={[
                    styles.sortButtonText,
                    sortBy === option && styles.sortButtonTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.suppliersContainer}>
            <Text style={styles.suppliersTitle}>Available Suppliers:</Text>
            {sortedSuppliers.map((supplier) => (
              <View key={supplier.id} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierNameContainer}>
                    <Text style={styles.supplierName}>{supplier.name}</Text>
                    {supplier.verified && (
                      <CheckCircle size={14} color="#10B981" />
                    )}
                  </View>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{supplier.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.supplierDetails}>
                  <View style={styles.supplierDetailRow}>
                    <DollarSign size={14} color="#10B981" />
                    <Text style={styles.supplierPrice}>
                      ${supplier.price.toFixed(2)} {supplier.currency}
                    </Text>
                  </View>
                  
                  <View style={styles.supplierDetailRow}>
                    <Package size={14} color="#0066CC" />
                    <Text style={styles.supplierStock}>
                      {supplier.stock.toLocaleString()} in stock
                    </Text>
                  </View>
                  
                  <View style={styles.supplierDetailRow}>
                    <Truck size={14} color="#6B7280" />
                    <Text style={styles.supplierLeadTime}>
                      {supplier.leadTime} delivery
                    </Text>
                  </View>
                  
                  <View style={styles.supplierDetailRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.supplierLocation}>
                      Ships from {supplier.location}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.supplierFooter}>
                  <Text style={styles.minimumOrder}>
                    Min order: {supplier.minimumOrder}
                  </Text>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleSupplierContact(supplier)}
                  >
                    <ExternalLink size={14} color="#FFFFFF" />
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
          <Text style={styles.headerTitle}>Component Sourcing</Text>
          <Text style={styles.headerSubtitle}>Find & Compare Electronic Components</Text>
        </LinearGradient>
      </View>

      {selectedComponent ? (
        renderSupplierDetail()
      ) : (
        <>
          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search part numbers, descriptions..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Categories */}
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

          {/* Results Count */}
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          {/* Components List */}
          <ScrollView style={styles.content}>
            <View style={styles.componentsList}>
              {filteredComponents.map(renderComponentCard)}
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
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  componentsList: {
    padding: 16,
    gap: 16,
  },
  componentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  componentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  componentPartNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  componentManufacturer: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  componentDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  componentDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 70,
  },
  detailValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  componentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supplierCount: {},
  supplierCountText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  stockLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailScroll: {
    flex: 1,
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 24,
  },
  specificationsContainer: {
    marginBottom: 24,
  },
  specificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  specificationItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  sortContainer: {
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  sortButtonActive: {
    backgroundColor: '#0066CC',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  suppliersContainer: {},
  suppliersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  supplierCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  supplierNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  supplierDetails: {
    marginBottom: 12,
    gap: 6,
  },
  supplierDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supplierPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  supplierStock: {
    fontSize: 14,
    color: '#374151',
  },
  supplierLeadTime: {
    fontSize: 14,
    color: '#374151',
  },
  supplierLocation: {
    fontSize: 14,
    color: '#374151',
  },
  supplierFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimumOrder: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});