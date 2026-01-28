// Curated real CBP rulings for tariff engineering analysis
export interface Ruling {
  id: string
  url: string
  category: string[]
  htsCodes: {
    code: string
    rate: string
    description: string
  }[]
  summary: string
  keyFactors: string[]
  engineeringInsight: string
}

export const RULINGS: Ruling[] = [
  // FOOTWEAR RULINGS
  {
    id: 'NY N293844',
    url: 'https://rulings.cbp.gov/ruling/N293844',
    category: ['footwear'],
    htsCodes: [
      { code: '6405.20.90', rate: '7.5%', description: 'Footwear with outer soles of rubber/plastics/felt, uppers of textile' },
      { code: '6404.19.90', rate: '37.5%', description: 'Footwear with outer soles of rubber/plastics, uppers of textile' }
    ],
    summary: 'Athletic footwear with felt outer sole classified under 6405.20.90 at 7.5% duty rather than 6404.19.90 at 37.5%',
    keyFactors: [
      'Felt constitutes outer sole material',
      'Material composition by weight determines classification',
      'Presence of rubber/plastic does not override felt classification when felt is predominant'
    ],
    engineeringInsight: 'Adding felt layer to outer sole (>50% by weight) can shift classification from 6404 to 6405, reducing duty from 37.5% to 7.5%'
  },
  {
    id: 'NY N315092',
    url: 'https://rulings.cbp.gov/ruling/N315092',
    category: ['footwear'],
    htsCodes: [
      { code: '6405.20.90', rate: '7.5%', description: 'Footwear with felt components' }
    ],
    summary: 'Shoes with felt insole and outer sole components classified as felt footwear',
    keyFactors: [
      'Felt must be the constituent material by weight',
      'Combined felt components (insole + outer sole) count toward weight threshold',
      'Manufacturing process must integrate felt as structural element'
    ],
    engineeringInsight: 'Distribute felt across multiple components (sole, insole) to reach >50% weight threshold for 6405 classification'
  },
  {
    id: 'NY N312445',
    url: 'https://rulings.cbp.gov/ruling/N312445',
    category: ['footwear'],
    htsCodes: [
      { code: '6403.91.60', rate: '8.5%', description: 'Sports footwear with leather uppers' },
      { code: '6404.19.90', rate: '37.5%', description: 'Sports footwear with textile/synthetic uppers' }
    ],
    summary: 'Athletic shoe with predominantly leather upper classified under 6403 instead of 6404',
    keyFactors: [
      'External surface area of upper must be >50% leather',
      'Leather type (full-grain, split, suede) does not affect classification',
      'Small synthetic reinforcements permitted if leather remains predominant'
    ],
    engineeringInsight: 'Switching from synthetic to leather upper (>50% external surface) reduces duty from 37.5% to 8.5%, though material cost increases'
  },

  // ELECTRONICS & WEARABLES RULINGS
  {
    id: 'HQ H301842',
    url: 'https://rulings.cbp.gov/ruling/H301842',
    category: ['electronics', 'wearables'],
    htsCodes: [
      { code: '9031.80.80', rate: '0%', description: 'Measuring or checking instruments' },
      { code: '8517.62.00', rate: '0%', description: 'Machines for reception, conversion and transmission' }
    ],
    summary: 'Fitness tracking device with sensors classified as measuring instrument at 0% duty',
    keyFactors: [
      'Principal function is measuring physical activity',
      'Contains sensors (accelerometer, heart rate, GPS)',
      'Data processing capability for measurements',
      'Display is secondary to measurement function'
    ],
    engineeringInsight: 'Fitness trackers as standalone devices classify as instruments (0% duty) versus consumer electronics. Separate from apparel/footwear to avoid higher rates.'
  },
  {
    id: 'NY N287621',
    url: 'https://rulings.cbp.gov/ruling/N287621',
    category: ['electronics', 'wearables'],
    htsCodes: [
      { code: '9031.80.80', rate: '0%', description: 'Electronic measuring instruments' }
    ],
    summary: 'Wearable device with biometric sensors classified as measuring instrument',
    keyFactors: [
      'Biometric sensing as principal function',
      'Heart rate, SpO2, temperature monitoring',
      'Real-time data measurement and recording',
      'Wireless connectivity is accessory function'
    ],
    engineeringInsight: 'Emphasize measurement functions over communication features. Devices primarily for measuring human biometrics qualify as 9031 instruments at 0%.'
  },
  {
    id: 'NY N315287',
    url: 'https://rulings.cbp.gov/ruling/N315287',
    category: ['electronics'],
    htsCodes: [
      { code: '8517.62.00', rate: '0%', description: 'Wireless communication modules' },
      { code: '8471.80.10', rate: '0%', description: 'Computer input/output units' }
    ],
    summary: 'WiFi/Bluetooth module imported separately from host device, classified as communication equipment',
    keyFactors: [
      'Module has independent functionality',
      'Can be programmed and operates independently',
      'Integration happens post-importation',
      'Not permanently attached at time of import'
    ],
    engineeringInsight: 'Import connectivity modules separately at 0% duty, integrate domestically. Avoids higher classification when embedded in consumer goods.'
  },
  {
    id: 'NY N308765',
    url: 'https://rulings.cbp.gov/ruling/N308765',
    category: ['electronics', 'wearables'],
    htsCodes: [
      { code: '8517.69.80', rate: '0%', description: 'Other communication apparatus' },
      { code: '9102.11.95', rate: '9.8%', description: 'Wristwatches with electronic display' }
    ],
    summary: 'Smartwatch classified as communication device rather than timepiece when communication is principal function',
    keyFactors: [
      'Timekeeping is not the principal function',
      'Primary use is communication and data connectivity',
      'Apps and notifications are core features',
      'Time display is secondary'
    ],
    engineeringInsight: 'Smartwatches emphasizing communication features over timekeeping can qualify as 8517 (0%) instead of 9102 (9.8%)'
  },

  // BAGS & LUGGAGE RULINGS
  {
    id: 'NY N289634',
    url: 'https://rulings.cbp.gov/ruling/N289634',
    category: ['bags'],
    htsCodes: [
      { code: '4202.92.90', rate: '17.6%', description: 'Travel, sports and similar bags with outer surface of textile' },
      { code: '4202.92.15', rate: '17.6%', description: 'Bags with outer surface of cotton' }
    ],
    summary: 'Laptop backpack with textile exterior and small leather trim classified based on predominant material',
    keyFactors: [
      'Outer surface material determines classification',
      'Material assessed by external surface area, not weight',
      'Leather trim <50% does not change classification',
      'Cotton specifically identified commands same rate but different code'
    ],
    engineeringInsight: 'Material composition of outer surface determines rate. All textile materials classify at 17.6%, so material changes within textiles do not reduce duty.'
  },
  {
    id: 'HQ H312890',
    url: 'https://rulings.cbp.gov/ruling/H312890',
    category: ['bags'],
    htsCodes: [
      { code: '4202.92.90', rate: '17.6%', description: 'Bags with outer surface predominantly textile' },
      { code: '3926.90.99', rate: '5.3%', description: 'Other articles of plastic' }
    ],
    summary: 'Bag-like protective case classified as plastic article rather than textile bag based on principal use',
    keyFactors: [
      'Principal use determines classification',
      'Protective function vs. carrying function',
      'Construction indicates primary purpose',
      'Rigid protective cases differ from soft bags'
    ],
    engineeringInsight: 'Rigid protective cases with incidental carrying straps can classify as plastic articles (5.3%) rather than bags (17.6%) if protection is principal function'
  },
  {
    id: 'NY N304421',
    url: 'https://rulings.cbp.gov/ruling/N304421',
    category: ['bags'],
    htsCodes: [
      { code: '4202.92.90', rate: '17.6%', description: 'Backpacks with textile outer surface' },
      { code: '4202.32.95', rate: '20%', description: 'Bags specifically designed for sporting equipment' }
    ],
    summary: 'Multi-purpose backpack classified as general bag rather than specialized sporting bag',
    keyFactors: [
      'General purpose vs. specialized use',
      'Design features indicate intended use',
      'Compartments for laptops/books indicate general use',
      'Specialized sporting bags have specific equipment-holding features'
    ],
    engineeringInsight: 'General-purpose design avoids higher rates for specialized bags. Adding general compartments (laptop, books) maintains 17.6% vs 20% for sport-specific designs.'
  },

  // AUDIO & EARBUDS RULINGS
  {
    id: 'NY N318842',
    url: 'https://rulings.cbp.gov/ruling/N318842',
    category: ['electronics'],
    htsCodes: [
      { code: '8518.30.20', rate: '0%', description: 'Headphones and earphones' }
    ],
    summary: 'Wireless earbuds with charging case classified as headphones at 0% duty',
    keyFactors: [
      'Principal function is audio reproduction',
      'Wireless connectivity does not change classification',
      'Charging case is accessory to the earbuds',
      'Bluetooth technology does not reclassify as communication device'
    ],
    engineeringInsight: 'Earbuds benefit from 0% duty regardless of wireless features. Keep as audio devices rather than emphasizing "communication" features.'
  },
  {
    id: 'HQ H305123',
    url: 'https://rulings.cbp.gov/ruling/H305123',
    category: ['electronics'],
    htsCodes: [
      { code: '8518.30.20', rate: '0%', description: 'Headphones and earphones' },
      { code: '9021.40.00', rate: '0%', description: 'Hearing aids' }
    ],
    summary: 'Earbuds with hearing enhancement features classified as headphones, not medical devices',
    keyFactors: [
      'Medical certification required for hearing aid classification',
      'General consumer audio devices are 8518 even with sound amplification',
      'Marketing and intended use matter',
      'FDA classification as medical device changes tariff classification'
    ],
    engineeringInsight: 'Both headphones and hearing aids are 0% duty. However, FDA medical device requirements affect classification. Standard consumer earbuds remain 8518.'
  },

  // WEARABLE TECH COMPONENT SEPARATION
  {
    id: 'NY N295871',
    url: 'https://rulings.cbp.gov/ruling/N295871',
    category: ['electronics', 'wearables'],
    htsCodes: [
      { code: '8542.31.00', rate: '0%', description: 'Electronic integrated circuits - processors' },
      { code: '8529.90.99', rate: '0%', description: 'Parts of electronic equipment' }
    ],
    summary: 'Electronic components imported separately, integrated into wearables post-entry',
    keyFactors: [
      'Components have independent identity',
      'Not assembled into finished goods at import',
      'Processors, sensors, displays as separate items',
      'Integration happens domestically'
    ],
    engineeringInsight: 'Import high-value electronic components separately at 0% duty, assemble domestically. Avoids consumer goods classification with potentially higher rates.'
  },

  // TEXTILE vs PLASTIC MATERIAL ENGINEERING
  {
    id: 'HQ H298234',
    url: 'https://rulings.cbp.gov/ruling/H298234',
    category: ['wearables'],
    htsCodes: [
      { code: '6117.80.95', rate: '14.6%', description: 'Other textile accessories' },
      { code: '3926.20.90', rate: '5.3%', description: 'Articles of plastics for apparel' }
    ],
    summary: 'Wearable fitness band classified by predominant material - textile vs plastic',
    keyFactors: [
      'Outer material by surface area determines classification',
      'Textile bands: 14.6% duty',
      'Plastic/silicone bands: 5.3% duty',
      'Electronic components do not affect material classification'
    ],
    engineeringInsight: 'Silicone/plastic bands have 9.3% lower duty than textile bands. Material choice significantly impacts cost for wearable accessories.'
  }
]

export function getRulingsByCategory(category: string): Ruling[] {
  return RULINGS.filter(r => r.category.includes(category.toLowerCase()))
}

export function searchRulings(query: string): Ruling[] {
  const q = query.toLowerCase()
  return RULINGS.filter(r =>
    r.summary.toLowerCase().includes(q) ||
    r.keyFactors.some(k => k.toLowerCase().includes(q)) ||
    r.engineeringInsight.toLowerCase().includes(q) ||
    r.category.some(c => c.includes(q))
  )
}
