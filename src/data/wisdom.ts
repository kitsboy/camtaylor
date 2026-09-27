/**
 * The sovereign healthcare wisdom database.
 *
 * Every entry in this file is a real, source-linked clinic or practice that has
 * been individually checked against a cited source (its own site or an
 * independent write-up) BEFORE it ships. `verifiedSource` is the URL that backs
 * the acceptance claim, `verifiedAt` is when it was checked. We do NOT store
 * entries on secondary hearsay — if the Bitcoin/Lightning acceptance cannot be
 * tied to evidence, it is not listed.
 *
 * Schema follows the Kimi/DoctorDoug/NurseNikki SOP (camtaylor.ca/wisdom).
 *
 * Geography tier (lower = closer to home, searched first):
 *   1 = YVR / British Columbia
 *   2 = Rest of Canada
 *   3 = USA
 *   4 = EU / Swiss
 *   5 = South America / regional hubs
 *   6 = Rest of world
 */

export interface WisdomLocation {
  city: string;
  region: string;
  country: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface WisdomVetting {
  /** Short, source-verifiable credential line. Empty = not yet verified. */
  physician_credentials?: string;
  facility_licensing?: string;
  patient_outcomes_rating?: string;
  booking_wait_time?: string;
  concierge_service?: boolean;
}

export interface WisdomEntry {
  id: string;
  name: string;
  category: string;
  sub_categories: string[];
  location: WisdomLocation;
  accepts_bitcoin: boolean;
  /** true when the provider routes payments over the Lightning Network. */
  accepts_lightning: boolean;
  payment_notes: string;
  vetting_metrics: WisdomVetting;
  offerings_summary: string;
  website: string;
  direct_intake_email?: string;
  direct_phone?: string;
  /** The URL that evidences the acceptance claim. Required. */
  verifiedSource: string;
  verifiedAt: string;
  tags: string[];
}

export const WISDOM_LAST_VERIFIED = '2026-09-27';

export const WISDOM: WisdomEntry[] = [
  {
    id: 'wis-0001',
    name: 'Direct Med Clinic',
    category: 'Primary Care',
    sub_categories: ['Direct Primary Care', 'Membership', 'Telemedicine'],
    location: { city: 'San Antonio', region: 'Texas', country: 'USA', tier: 3 },
    accepts_bitcoin: true,
    accepts_lightning: true,
    payment_notes:
      'Bitcoin on-chain or Lightning Network. Lightning membership carries a 5% discount (via Zaprite payment portal).',
    vetting_metrics: {
      physician_credentials: 'Direct Primary Care memberships — independent physician practice.',
      facility_licensing: 'Practicing medical clinic, San Antonio TX.',
      patient_outcomes_rating: 'Public DPC clinic; accepts Bitcoin for memberships.',
      booking_wait_time: 'Member-based DPC — direct scheduling.',
      concierge_service: true,
    },
    offerings_summary:
      'Direct primary care memberships payable in Bitcoin — on-chain or Lightning. Transparent flat pricing, no third-party payor, aligned with a value-for-value doctor–patient model.',
    website: 'https://directmedclinic.com/bitcoin/',
    direct_intake_email: 'office@directmedclinic.com',
    direct_phone: '+1-210-886-8031',
    verifiedSource: 'https://directmedclinic.com/bitcoin/',
    verifiedAt: '2026-09-27',
    tags: ['usa', 'texas', 'primary-care', 'bitcoin', 'lightning', 'dpc'],
  },
  {
    id: 'wis-0002',
    name: 'ProCare Medical Centers',
    category: 'Primary & Chiropractic Care',
    sub_categories: ['Primary Care', 'Chiropractic', 'Labs', 'X-Ray', 'Annual Physicals'],
    location: { city: 'Austin / San Antonio', region: 'Texas', country: 'USA', tier: 3 },
    accepts_bitcoin: true,
    accepts_lightning: false,
    payment_notes:
      'Bitcoin accepted for co-pays, deductibles and cash-pay services (annual physicals, chiropractic, labs, X-rays).',
    vetting_metrics: {
      physician_credentials: 'Independent Texas practice network (multi-clinic).',
      facility_licensing: 'Licensed medical & chiropractic centers, Texas.',
      patient_outcomes_rating:
        'First healthcare practice in Texas to publicly accept Bitcoin (announced 2019).',
      booking_wait_time: 'Online booking.',
      concierge_service: false,
    },
    offerings_summary:
      'Multi-clinic Texas practice network accepting Bitcoin for cash-pay primary care, chiropractic adjustments, annual physicals, labs and X-rays.',
    website: 'https://procareinjury.com/blog/pro-care-medical-center-is-first-healthcare-clinic-in-texas-to-accept-bitcoin/',
    verifiedSource: 'https://procareinjury.com/blog/pro-care-medical-center-is-first-healthcare-clinic-in-texas-to-accept-bitcoin/',
    verifiedAt: '2026-09-27',
    tags: ['usa', 'texas', 'primary-care', 'chiropractic', 'bitcoin'],
  },
  {
    id: 'wis-0003',
    name: 'City Clinic Marbella',
    category: 'Dental',
    sub_categories: ['Dental Implants', 'Cosmetic Dentistry', 'Restorative Dentistry'],
    location: { city: 'Marbella', region: 'Andalusia', country: 'Spain', tier: 4 },
    accepts_bitcoin: true,
    accepts_lightning: true,
    payment_notes:
      'Accepts Bitcoin for dental treatment — scan QR, enter amount, confirm. No banks/credit-card middlemen.',
    vetting_metrics: {
      physician_credentials: 'Dental practice, La Cañada shopping centre, Marbella.',
      facility_licensing: 'EU (Spain) dental clinic.',
      patient_outcomes_rating: 'Publically promotes crypto-accepting dental care.',
      booking_wait_time: '€50 booking fee deducted from treatment cost.',
      concierge_service: true,
    },
    offerings_summary:
      'Marbella dental clinic accepting Bitcoin — implants, cosmetic and restorative dentistry via simple QR payment.',
    website: 'https://cityclinic.io/where-can-i-pay-for-dental-treatment-with-btc/',
    verifiedSource: 'https://cityclinic.io/where-can-i-pay-for-dental-treatment-with-btc/',
    verifiedAt: '2026-09-27',
    tags: ['eu', 'spain', 'dental', 'bitcoin', 'lightning', 'medical-tourism'],
  },
  {
    id: 'wis-0004',
    name: 'Diente Zonte (Bitcoin Smiles)',
    category: 'Dental',
    sub_categories: ['Community Dental', 'Dentures', 'Critical Care', 'Mobile Dentistry'],
    location: { city: 'El Zonte', region: 'La Libertad', country: 'El Salvador', tier: 5 },
    accepts_bitcoin: true,
    accepts_lightning: false,
    payment_notes:
      'Bitcoin-first dental practice in Bitcoin Beach (El Zonte); BTCPay Server-backed.',
    vetting_metrics: {
      physician_credentials: 'Dr. Enrique Berrios, resident dentist of El Zonte.',
      facility_licensing: 'Dental practice, El Zonte, El Salvador.',
      patient_outcomes_rating:
        'Backed by the Bitcoin Smiles / BTCPay Server charitable initiative; accepted $ in the Bitcoin Beach economy.',
      booking_wait_time: 'Community practice — walk-in driven.',
      concierge_service: false,
    },
    offerings_summary:
      'Bitcoin-denominated dental practice at the epicentre of El Salvador\u2019s Bitcoin Beach adoption — checkups, dentures, critical dental care.',
    website: 'https://bitcoinsmiles.org',
    verifiedSource: 'https://bitcoinmagazine.com/business/el-salvador-bitcoin-smiles-raising-btc',
    verifiedAt: '2026-09-27',
    tags: ['el-salvador', 'dental', 'bitcoin', 'bitcoin-beach', 'btcpay'],
  },
];

export const TIER_LABELS: Record<number, string> = {
  1: 'YVR / British Columbia',
  2: 'Rest of Canada',
  3: 'USA',
  4: 'EU / Swiss',
  5: 'South America',
  6: 'Rest of World',
};
