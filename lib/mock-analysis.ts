// Mock analysis results for demo mode (when API key is not set)
// This allows the app to work immediately without requiring an Anthropic API key

export function getMockAnalysis(description: string) {
  const lowerDesc = description.toLowerCase()

  // Footwear mock
  if (lowerDesc.includes('shoe') || lowerDesc.includes('footwear') || lowerDesc.includes('sneaker')) {
    return {
      currentClassification: {
        hts: '6404.19.90',
        rate: '37.5%',
        description: 'Athletic footwear with outer sole of rubber/plastics and upper of textile materials'
      },
      opportunities: [
        {
          modification: 'Add felt layer (>50% by weight) to the outer sole construction',
          currentHTS: '6404.19.90',
          currentRate: '37.5%',
          newHTS: '6405.20.90',
          newRate: '7.5%',
          reduction: '-30%',
          confidence: 'High',
          rulings: [
            { id: 'NY N293844', url: 'https://rulings.cbp.gov/ruling/N293844' },
            { id: 'NY N315092', url: 'https://rulings.cbp.gov/ruling/N315092' }
          ],
          explanation: 'CBP consistently classifies footwear where felt constitutes the predominant material by weight as 6405.20.90, regardless of the presence of rubber or plastic components. The key is achieving >50% felt by weight in the sole construction.',
          savings: {
            perUnit: 15.0,
            annual: 150000
          }
        },
        {
          modification: 'Separate fitness tracker as standalone component, import separately',
          currentHTS: '6404.19.90',
          currentRate: '37.5%',
          newHTS: '9031.80.80 (tracker) + 6404.19.90 (shoe)',
          newRate: '0% (tracker) + 37.5% (shoe)',
          reduction: '-12% weighted',
          confidence: 'High',
          rulings: [
            { id: 'HQ H301842', url: 'https://rulings.cbp.gov/ruling/H301842' },
            { id: 'NY N287621', url: 'https://rulings.cbp.gov/ruling/N287621' }
          ],
          explanation: 'Fitness tracking devices with sensors and data processing capability classify as measuring/checking instruments under 9031.80.80 (0% duty). Import the tracker separately, integrate post-entry. The footwear itself remains 6404.19.90 but the tracker escapes the footwear duty rate entirely.',
          savings: {
            perUnit: 6.0,
            annual: 60000
          }
        },
        {
          modification: 'Modify upper to use >50% leather instead of synthetic materials',
          currentHTS: '6404.19.90',
          currentRate: '37.5%',
          newHTS: '6403.91.60',
          newRate: '8.5%',
          reduction: '-29%',
          confidence: 'Medium',
          rulings: [
            { id: 'NY N312445', url: 'https://rulings.cbp.gov/ruling/N312445' }
          ],
          explanation: 'Footwear with uppers predominantly leather (>50% external surface area) classifies under 6403. Rate drops to 8.5%. However, leather increases unit cost by ~$8-12, so net savings depends on volume and market positioning.',
          savings: {
            perUnit: 14.5,
            annual: 145000
          }
        }
      ],
      totalPotentialSavings: 355000
    }
  }

  // Electronics mock (earbuds, headphones)
  if (lowerDesc.includes('earbud') || lowerDesc.includes('headphone') || lowerDesc.includes('airpod')) {
    return {
      currentClassification: {
        hts: '8518.30.20',
        rate: '0%',
        description: 'Headphones and earphones with wireless connectivity'
      },
      opportunities: [
        {
          modification: 'Already optimally classified - maintain audio focus over communication features',
          currentHTS: '8518.30.20',
          currentRate: '0%',
          newHTS: '8518.30.20',
          newRate: '0%',
          reduction: '0%',
          confidence: 'High',
          rulings: [
            { id: 'NY N318842', url: 'https://rulings.cbp.gov/ruling/N318842' }
          ],
          explanation: 'Wireless earbuds with charging case are correctly classified as headphones at 0% duty. The key is emphasizing audio reproduction as the principal function. Bluetooth connectivity does not reclassify as communication device.',
          savings: {
            perUnit: 0,
            annual: 0
          }
        },
        {
          modification: 'Import charging case separately as parts/accessories',
          currentHTS: '8518.30.20',
          currentRate: '0%',
          newHTS: '8518.90.40',
          newRate: '0%',
          reduction: '0%',
          confidence: 'Medium',
          rulings: [
            { id: 'HQ H305123', url: 'https://rulings.cbp.gov/ruling/H305123' }
          ],
          explanation: 'Charging cases can be classified as parts of audio equipment (8518.90.40) also at 0% duty. While this doesn\'t reduce duty, it can simplify logistics if cases and earbuds are manufactured in different locations.',
          savings: {
            perUnit: 0,
            annual: 0
          }
        }
      ],
      totalPotentialSavings: 0
    }
  }

  // Bags mock
  if (lowerDesc.includes('bag') || lowerDesc.includes('backpack') || lowerDesc.includes('luggage')) {
    return {
      currentClassification: {
        hts: '4202.92.90',
        rate: '17.6%',
        description: 'Travel, sports and similar bags with outer surface of textile materials'
      },
      opportunities: [
        {
          modification: 'Redesign as rigid protective case rather than soft carrying bag',
          currentHTS: '4202.92.90',
          currentRate: '17.6%',
          newHTS: '3926.90.99',
          newRate: '5.3%',
          reduction: '-12.3%',
          confidence: 'Medium',
          rulings: [
            { id: 'HQ H312890', url: 'https://rulings.cbp.gov/ruling/H312890' }
          ],
          explanation: 'Rigid protective cases with incidental carrying straps can classify as plastic articles (5.3%) rather than bags (17.6%) if protection is the principal function. Requires hard shell construction and design emphasizing protective features.',
          savings: {
            perUnit: 6.2,
            annual: 62000
          }
        },
        {
          modification: 'Avoid specialized sporting design features',
          currentHTS: '4202.92.90',
          currentRate: '17.6%',
          newHTS: '4202.92.90',
          newRate: '17.6%',
          reduction: '0%',
          confidence: 'High',
          rulings: [
            { id: 'NY N304421', url: 'https://rulings.cbp.gov/ruling/N304421' }
          ],
          explanation: 'General-purpose bags (17.6%) have lower duty than specialized sporting bags (20%). Adding laptop/book compartments maintains general-purpose classification. Avoid equipment-specific features.',
          savings: {
            perUnit: 0,
            annual: 0
          }
        }
      ],
      totalPotentialSavings: 62000
    }
  }

  // Wearables/smartwatch mock
  if (lowerDesc.includes('watch') || lowerDesc.includes('wearable') || lowerDesc.includes('fitness') || lowerDesc.includes('tracker')) {
    return {
      currentClassification: {
        hts: '9102.11.95',
        rate: '9.8%',
        description: 'Wristwatches with electronic display'
      },
      opportunities: [
        {
          modification: 'Emphasize communication functions over timekeeping in design and marketing',
          currentHTS: '9102.11.95',
          currentRate: '9.8%',
          newHTS: '8517.69.80',
          newRate: '0%',
          reduction: '-9.8%',
          confidence: 'High',
          rulings: [
            { id: 'NY N308765', url: 'https://rulings.cbp.gov/ruling/N308765' }
          ],
          explanation: 'Smartwatches where communication and data connectivity are principal functions (not timekeeping) can classify as communication apparatus (8517) at 0% instead of watches (9102) at 9.8%. Design should emphasize notifications, apps, and connectivity.',
          savings: {
            perUnit: 4.9,
            annual: 49000
          }
        },
        {
          modification: 'Classify as measuring instrument based on biometric sensors',
          currentHTS: '9102.11.95',
          currentRate: '9.8%',
          newHTS: '9031.80.80',
          newRate: '0%',
          reduction: '-9.8%',
          confidence: 'High',
          rulings: [
            { id: 'HQ H301842', url: 'https://rulings.cbp.gov/ruling/H301842' },
            { id: 'NY N287621', url: 'https://rulings.cbp.gov/ruling/N287621' }
          ],
          explanation: 'Wearables with biometric sensors (heart rate, SpO2, temperature) as principal function classify as measuring instruments (9031.80.80) at 0% duty. Emphasize health/fitness measurement over general smartwatch features.',
          savings: {
            perUnit: 4.9,
            annual: 49000
          }
        },
        {
          modification: 'Use silicone/plastic band instead of textile',
          currentHTS: '9102.11.95',
          currentRate: '9.8%',
          newHTS: '9102.11.95',
          newRate: '9.8%',
          reduction: '0%',
          confidence: 'High',
          rulings: [
            { id: 'HQ H298234', url: 'https://rulings.cbp.gov/ruling/H298234' }
          ],
          explanation: 'While both classify at the same rate for watches, silicone/plastic bands (5.3%) have significantly lower duty than textile bands (14.6%) if sold separately as accessories. Consider unbundling strategy.',
          savings: {
            perUnit: 0,
            annual: 0
          }
        }
      ],
      totalPotentialSavings: 98000
    }
  }

  // Generic fallback
  return {
    currentClassification: {
      hts: 'XXXX.XX.XX',
      rate: 'Variable',
      description: 'Classification depends on specific product characteristics'
    },
    opportunities: [
      {
        modification: 'Analyze material composition thresholds (e.g., >50% of specific materials)',
        currentHTS: 'XXXX.XX.XX',
        currentRate: 'Variable',
        newHTS: 'YYYY.YY.YY',
        newRate: 'Lower',
        reduction: 'Varies',
        confidence: 'Medium',
        rulings: [
          { id: 'See CROSS database', url: 'https://rulings.cbp.gov' }
        ],
        explanation: 'Material composition by weight or surface area often determines classification. Crossing 50% thresholds can shift products to different HTS codes with different duty rates. Requires detailed analysis of your specific product.',
        savings: {
          perUnit: 0,
          annual: 0
        }
      },
      {
        modification: 'Consider component separation strategy',
        currentHTS: 'XXXX.XX.XX',
        currentRate: 'Variable',
        newHTS: 'Multiple codes',
        newRate: 'Weighted average',
        reduction: 'Varies',
        confidence: 'Medium',
        rulings: [
          { id: 'See CROSS database', url: 'https://rulings.cbp.gov' }
        ],
        explanation: 'High-value electronic components often have lower duty rates than consumer goods. Importing components separately and assembling domestically can reduce overall duty burden. Common for electronics with modular designs.',
        savings: {
          perUnit: 0,
          annual: 0
        }
      },
      {
        modification: 'Redefine principal function through design changes',
        currentHTS: 'XXXX.XX.XX',
        currentRate: 'Variable',
        newHTS: 'YYYY.YY.YY',
        newRate: 'Lower',
        reduction: 'Varies',
        confidence: 'Low',
        rulings: [
          { id: 'See CROSS database', url: 'https://rulings.cbp.gov' }
        ],
        explanation: 'Products are classified by their principal use or function. Changing what a product "is" through design modifications can shift classification. Requires careful analysis and customs broker consultation.',
        savings: {
          perUnit: 0,
          annual: 0
        }
      }
    ],
    totalPotentialSavings: 0
  }
}
