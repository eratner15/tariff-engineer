import React from 'react'
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1d1d1f',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #d2d2d7',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#86868b',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#86868b',
  },
  productText: {
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  gridItem: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: '#86868b',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  opportunityCard: {
    backgroundColor: '#fafafa',
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
    border: '1 solid #e5e5e7',
  },
  opportunityTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  opportunityText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#1d1d1f',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    gap: 5,
  },
  rulingsList: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  rulingText: {
    fontSize: 9,
    color: '#06c',
  },
  savingsSection: {
    backgroundColor: '#f5f5f7',
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  savingsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  savingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  savingsItem: {
    alignItems: 'center',
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34c759',
    marginBottom: 3,
  },
  savingsLabel: {
    fontSize: 9,
    color: '#86868b',
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff9e6',
    borderLeft: '3 solid #ff3b30',
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ff3b30',
  },
  disclaimerText: {
    fontSize: 8,
    lineHeight: 1.4,
    color: '#1d1d1f',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#86868b',
    borderTop: '1 solid #e5e5e7',
    paddingTop: 10,
  },
  link: {
    color: '#06c',
  },
})

interface Opportunity {
  modification: string
  currentHTS: string
  currentRate: string
  newHTS: string
  newRate: string
  reduction: string
  confidence: 'High' | 'Medium' | 'Low'
  rulings: { id: string; url: string }[]
  explanation: string
  savings: {
    perUnit: number
    annual: number
  }
}

interface AnalysisResult {
  product: string
  currentClassification: {
    hts: string
    rate: string
    description: string
  }
  opportunities: Opportunity[]
  totalPotentialSavings: number
}

interface TariffReportProps {
  data: AnalysisResult
}

export const TariffReport: React.FC<TariffReportProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tariff Engineering Analysis</Text>
          <Text style={styles.subtitle}>Generated on {currentDate}</Text>
        </View>

        {/* Product Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Analyzed</Text>
          <Text style={styles.productText}>{data.product}</Text>
        </View>

        {/* Current Classification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Classification</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>HTS Code</Text>
              <Text style={styles.value}>{data.currentClassification.hts}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Duty Rate</Text>
              <Text style={[styles.value, { color: '#ff3b30' }]}>
                {data.currentClassification.rate}
              </Text>
            </View>
          </View>
          <Text style={styles.opportunityText}>
            {data.currentClassification.description}
          </Text>
        </View>

        {/* Engineering Opportunities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Engineering Opportunities ({data.opportunities.length})
          </Text>

          {data.opportunities.map((opp, idx) => (
            <View key={idx} style={styles.opportunityCard} wrap={false}>
              <Text style={styles.opportunityTitle}>
                {idx + 1}. {opp.modification}
              </Text>
              <Text style={styles.opportunityText}>{opp.explanation}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.label}>Current:</Text>
                  <Text style={styles.value}>
                    {opp.currentHTS} @ {opp.currentRate}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.label}>New:</Text>
                  <Text style={[styles.value, { color: '#34c759' }]}>
                    {opp.newHTS} @ {opp.newRate}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.label}>Reduction:</Text>
                  <Text style={[styles.value, { color: '#34c759' }]}>
                    {opp.reduction}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.label}>Confidence:</Text>
                  <Text style={styles.value}>{opp.confidence}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.label}>Annual Savings:</Text>
                  <Text style={[styles.value, { color: '#34c759' }]}>
                    ${opp.savings.annual.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.rulingsList}>
                <Text style={styles.label}>Supporting CBP Rulings:</Text>
                {opp.rulings.map((ruling, rIdx) => (
                  <Link
                    key={rIdx}
                    src={ruling.url}
                    style={styles.rulingText}
                  >
                    {ruling.id}
                  </Link>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Total Savings */}
        <View style={styles.savingsSection} wrap={false}>
          <Text style={styles.savingsTitle}>Total Potential Savings</Text>
          <View style={styles.savingsGrid}>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsValue}>
                ${data.totalPotentialSavings.toLocaleString()}
              </Text>
              <Text style={styles.savingsLabel}>Annual @ 10K Units</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer} wrap={false}>
          <Text style={styles.disclaimerTitle}>IMPORTANT DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>
            This analysis is based on publicly available CBP rulings and is
            provided for informational purposes only. It does not constitute
            legal advice, customs brokerage services, or an official customs
            classification. Actual duty rates may vary based on specific
            product characteristics, country of origin, trade agreements, and
            other factors. All tariff engineering modifications should be
            reviewed by a licensed customs broker and approved by CBP through
            the appropriate binding ruling request process before
            implementation. Past rulings are not guarantees of future
            classifications.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Generated by Tariff Engineer • tariffengineer.vercel.app • Data from CBP CROSS Rulings Database
        </Text>
      </Page>
    </Document>
  )
}
