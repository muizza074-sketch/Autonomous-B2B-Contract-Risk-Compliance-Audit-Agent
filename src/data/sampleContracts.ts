import { ContractDocument } from '../types/contract';

export const SAMPLE_CONTRACTS: ContractDocument[] = [
  {
    id: 'doc-msa-01',
    title: 'NexusCloud Enterprise Master Services Agreement',
    fileName: 'NexusCloud_Enterprise_MSA_v4.2.pdf',
    fileType: 'application/pdf',
    uploadedAt: '2026-11-10T14:32:00Z',
    wordCount: 2840,
    overallRiskScore: 78,
    riskSummary: {
      high: 4,
      medium: 3,
      compliant: 2,
      total: 9,
    },
    categoryBreakdown: {
      'Indemnification': { high: 2, medium: 0, compliant: 0 },
      'Data Privacy': { high: 1, medium: 1, compliant: 0 },
      'Termination': { high: 1, medium: 1, compliant: 1 },
      'Payment Terms': { high: 0, medium: 1, compliant: 1 },
      'Liability & Warranties': { high: 0, medium: 0, compliant: 0 },
      'General': { high: 0, medium: 0, compliant: 0 },
    },
    executiveSummary:
      'High-risk vendor bias identified across Section 8 (Unilateral Indemnification), Section 12 (Auto-Renewal with 15% Annual Escalator), and Section 14 (Asymmetric Data Breach Notification). Current terms require Customer to indemnify Vendor for all third-party patent suits arising from data inputs while capping Vendor liability at 1x MRR.',
    content: `MASTER SERVICES AGREEMENT (ENTERPRISE)
Dated: November 1, 2026
Between: NexusCloud Technologies Inc. ("Vendor") and Enterprise Procurement Corp ("Customer")

SECTION 1. DEFINITIONS AND SCOPE
1.1 "Services" refers to the proprietary software-as-a-service application hosted and provided by Vendor under Order Forms executed hereunder.
1.2 "Customer Data" means electronic files, data, and content provided by Customer to the platform. Customer retains ownership of Customer Data.

SECTION 4. PAYMENT TERMS AND INVOICING
4.1 Payment Terms. Customer shall pay all undisputed invoice amounts within fifteen (15) calendar days from invoice generation. Invoices not disputed in writing within five (5) days of receipt shall be deemed conclusively accepted.
4.2 Late Penalties. Past due balances shall accrue interest at a rate of 2.5% per month (or the maximum allowable by law, whichever is higher), compounded daily from the due date until full receipt of payment. Customer shall reimburse Vendor for all legal and collection agency costs incurred.
4.3 Annual Price Escalation. Upon each renewal term, Vendor reserves the absolute right to adjust subscription fees upward by up to fifteen percent (15%) upon thirty (30) days prior written or electronic notice to Customer.

SECTION 6. SERVICE LEVELS AND UPTIME COMMITMENT
6.1 Uptime Calculation. Vendor shall use commercially reasonable efforts to make the Core Production Services available at least ninety-nine point nine percent (99.9%) of the time during each calendar month.
6.2 Carveouts and Maintenance. Uptime percentages strictly exclude: (a) scheduled maintenance windows, which may occur at Vendor's discretion up to twenty-four (24) hours per month; (b) emergency critical patches; and (c) any downtime caused by network transit or internet outages.
6.3 Sole Remedy. In the event Vendor fails to maintain 99.9% uptime, Customer's sole and exclusive remedy shall be an issuance of a service credit equal to five percent (5%) of that month's prorated base fee, applicable exclusively against subsequent invoices. Under no circumstances may Customer terminate this Agreement for SLA failures.

SECTION 8. INDEMNIFICATION AND DEFENSE
8.1 Customer Indemnification Obligation. Customer agrees to defend, indemnify, and hold harmless Vendor, its parent entities, affiliates, officers, directors, and employees against any and all claims, damages, liabilities, losses, costs, and expenses (including uncapped reasonable attorneys' fees) arising out of or related to: (a) Customer Data; (b) Customer's use of the Services; or (c) any alleged infringement or misappropriation of any third-party patent, copyright, or trade secret claims stemming from Customer workflows.
8.2 Vendor Indemnification Disclaimer. Vendor shall defend Customer against direct copyright infringement claims brought against the unmodified Core Software, provided that Vendor's aggregate total indemnity liability under this Agreement shall be strictly capped at the total subscription fees actually paid by Customer in the one (1) month immediately preceding the event giving rise to liability.

SECTION 10. DATA PRIVACY AND SECURITY (GDPR / CCPA)
10.1 Processing Role. To the extent Vendor processes personal data subject to GDPR or CCPA, Vendor acts as Data Processor.
10.2 Subprocessors. Vendor may engage third-party subprocessors at its sole discretion without prior notification to Customer. A current list shall be maintained on Vendor's public website. Customer waives any right of prior review or objection.
10.3 Incident Notification. Vendor shall report confirmed security incidents resulting in unauthorized exfiltration of Customer Personal Data to Customer within ten (10) business days following Vendor's completed internal forensic investigation.

SECTION 12. TERM, TERMINATION AND AUTO-RENEWAL
12.1 Term and Auto-Renewal. The Initial Term shall be thirty-six (36) months. This Agreement shall automatically renew for successive twenty-four (24) month renewal periods unless either party provides written notice of non-renewal at least ninety (90) calendar days prior to the expiration of the then-current term.
12.2 Termination for Cause. Either party may terminate for material breach only if such breach remains uncured for forty-five (45) business days after formal delivery of registered mail notice.
12.3 Termination for Convenience. Customer possesses no right of termination for convenience. Vendor may terminate this Agreement without cause at any time upon sixty (60) days prior written notice.
12.4 Post-Termination Data Retention. Upon termination, Customer may request an export of Customer Data within seven (7) days, subject to Vendor's standard Professional Services fees of $350/hour. Vendor may purge all Customer Data thereafter without retention liability.

SECTION 14. LIMITATION OF LIABILITY
14.1 Aggregate Cap. Except for Customer's indemnification obligations under Section 8, each party's maximum cumulative aggregate liability arising under this Agreement shall not exceed the total fees paid by Customer during the three (3) months preceding the claim.
14.2 Consequential Damages. In no event shall Vendor be liable for loss of profits, loss of business, data corruption, or indirect punitive damages.`,
    clauses: [
      {
        id: 'c-msa-1',
        sectionNumber: 'Section 8.1',
        title: 'Unilateral Customer Indemnification & Patent Liability',
        category: 'Indemnification',
        riskLevel: 'High Risk',
        exactQuote: 'Customer agrees to defend, indemnify, and hold harmless Vendor, its parent entities, affiliates, officers, directors, and employees against any and all claims, damages, liabilities, losses, costs, and expenses (including uncapped reasonable attorneys\' fees) arising out of or related to: (a) Customer Data; (b) Customer\'s use of the Services; or (c) any alleged infringement or misappropriation of any third-party patent, copyright, or trade secret claims stemming from Customer workflows.',
        explanation: 'Extreme risk. Forces Customer to indemnify Vendor with uncapped liability for broad patent infringement claims merely arising from normal workflow usage. The clause lacks standard exceptions for Vendor negligence or third-party modifications.',
        marketStandard: 'Mutual indemnification where Vendor defends Customer against IP infringement of the SaaS product, and Customer indemnifies Vendor strictly for illegal Customer Data content. Excludes uncapped legal fees and requires prompt notice and sole control of defense.',
        suggestedCounterClause: 'Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party against third-party claims arising from: (a) gross negligence or willful misconduct; or (b) in the case of Vendor, claims that the Services infringe any valid copyright, trademark, or patent. Customer\'s indemnification shall be strictly limited to Customer Data that directly violates applicable laws.',
        negotiationTip: 'Strike "Customer\'s use of the Services" and patent liabilities. Demand reciprocal IP defense with no sub-cap.',
        status: 'pending'
      },
      {
        id: 'c-msa-2',
        sectionNumber: 'Section 8.2',
        title: 'Vendor Indemnity Capped at 1 Month MRR',
        category: 'Indemnification',
        riskLevel: 'High Risk',
        exactQuote: 'Vendor\'s aggregate total indemnity liability under this Agreement shall be strictly capped at the total subscription fees actually paid by Customer in the one (1) month immediately preceding the event giving rise to liability.',
        explanation: 'Severe exposure. Capping IP indemnity liability at 1 month of fees (MRR) renders vendor IP protection illusory. A single copyright or patent claim can cost hundreds of thousands in defense.',
        marketStandard: 'Enterprise standard: IP indemnification obligations must be completely uncapped, or subject to a separate super-cap (e.g., 3x-5x annual contract value or $5,000,000).',
        suggestedCounterClause: 'Vendor\'s indemnification obligations set forth under this Section shall not be subject to any monetary liability limitation or cap under Section 14 (Limitation of Liability).',
        negotiationTip: 'Non-negotiable for enterprise procurement: Vendor created the code; they must bear full IP defense risk.',
        status: 'pending'
      },
      {
        id: 'c-msa-3',
        sectionNumber: 'Section 10.3',
        title: '10-Day Security Breach Notification (GDPR Non-Compliant)',
        category: 'Data Privacy',
        riskLevel: 'High Risk',
        exactQuote: 'Vendor shall report confirmed security incidents resulting in unauthorized exfiltration of Customer Personal Data to Customer within ten (10) business days following Vendor\'s completed internal forensic investigation.',
        explanation: 'Regulatory violation. Under GDPR Article 33, data controllers must notify supervisory authorities within 72 hours of becoming aware of a personal data breach. A 10-business-day vendor notice guarantees Customer will miss statutory deadlines, incurring severe GDPR fines (up to 4% global turnover).',
        marketStandard: 'Vendor must notify Customer in writing without undue delay, and in no event later than twenty-four (24) to forty-eight (48) hours after becoming aware of any confirmed or suspected personal data breach.',
        suggestedCounterClause: 'Vendor shall notify Customer in writing immediately, and in any event within thirty-six (36) hours of becoming aware of any confirmed or suspected Security Incident or personal data compromise, providing all technical forensic details reasonably requested.',
        negotiationTip: 'Cite GDPR Art 28(3)(f) and Art 33. Emphasize that 10 days breaches mandatory statutory law.',
        status: 'pending'
      },
      {
        id: 'c-msa-4',
        sectionNumber: 'Section 12.1',
        title: 'Strict 90-Day Auto-Renewal with 24-Month Lock-in',
        category: 'Termination',
        riskLevel: 'High Risk',
        exactQuote: 'The Initial Term shall be thirty-six (36) months. This Agreement shall automatically renew for successive twenty-four (24) month renewal periods unless either party provides written notice of non-renewal at least ninety (90) calendar days prior to the expiration of the then-current term.',
        explanation: 'Trap clause. If Customer misses the narrow 90-day window, they are locked into an automatic 24-month contract renewal, compounded by Section 4.3\'s 15% price escalator.',
        marketStandard: '12-month renewal terms with 30-day notice period, plus a mandatory reminder notice sent by Vendor 60 days prior to renewal deadline.',
        suggestedCounterClause: 'Following the Initial Term, this Agreement shall renew for successive twelve (12) month periods unless either party gives written notice of non-renewal at least thirty (30) days prior to the renewal date. Vendor must provide written reminder sixty (60) days prior to each deadline.',
        negotiationTip: 'Reduce renewal term to 12 months and notice window to 30 days. Add mandatory vendor reminder obligation.',
        status: 'pending'
      },
      {
        id: 'c-msa-5',
        sectionNumber: 'Section 10.2',
        title: 'Unilateral Subprocessor Engagement Without Notice',
        category: 'Data Privacy',
        riskLevel: 'Medium Risk',
        exactQuote: 'Vendor may engage third-party subprocessors at its sole discretion without prior notification to Customer. A current list shall be maintained on Vendor\'s public website. Customer waives any right of prior review or objection.',
        explanation: 'Violates GDPR Article 28(2), which requires data controllers to be given prior written notice of changes concerning the addition or replacement of subprocessors, along with right to object.',
        marketStandard: 'Vendor must provide at least thirty (30) days advance written notice of new subprocessors, and Customer retains the right to object on reasonable data protection grounds or terminate without penalty.',
        suggestedCounterClause: 'Vendor shall provide Customer with at least thirty (30) days advance written notice prior to engaging any new subprocessor. Customer may object to such subprocessor on reasonable security or compliance grounds within fourteen (14) days.',
        negotiationTip: 'Standard requirement for EU compliance; non-compliant subprocessor clauses block DPA approval.',
        status: 'pending'
      },
      {
        id: 'c-msa-6',
        sectionNumber: 'Section 12.3',
        title: 'Asymmetric Termination for Convenience',
        category: 'Termination',
        riskLevel: 'Medium Risk',
        exactQuote: 'Customer possesses no right of termination for convenience. Vendor may terminate this Agreement without cause at any time upon sixty (60) days prior written notice.',
        explanation: 'Asymmetric leverage. Allows Vendor to drop Customer if commercial priorities change or prices rise, while binding Customer unconditionally for 36 months.',
        marketStandard: 'Either mutual right to terminate for convenience upon 60-90 days notice (with pro-rata refund of prepaid fees), or neither party may terminate for convenience during the fixed term.',
        suggestedCounterClause: 'Neither party may terminate this Agreement for convenience prior to the expiration of the Initial Term. Thereafter, either party may terminate without cause upon ninety (90) days prior written notice, subject to prorated refund of any unearned prepaid fees.',
        negotiationTip: 'Make rights strictly bilateral. Demand pro-rata refund for prepaid unused subscription fees.',
        status: 'pending'
      },
      {
        id: 'c-msa-7',
        sectionNumber: 'Section 4.1 & 4.2',
        title: 'Net 15 Days & 2.5% Monthly Compound Late Interest',
        category: 'Payment Terms',
        riskLevel: 'Medium Risk',
        exactQuote: 'Customer shall pay all undisputed invoice amounts within fifteen (15) calendar days from invoice generation... Past due balances shall accrue interest at a rate of 2.5% per month (or the maximum allowable by law, whichever is higher), compounded daily',
        explanation: 'Net 15 is excessively tight for enterprise procurement cycles (standard is Net 45-60). 2.5% monthly compound interest equates to over 34% annual percentage rate (APR), well beyond customary commercial rates.',
        marketStandard: 'Net 45 or Net 60 days from invoice receipt. Late fees capped at 1.0% to 1.5% per month simple interest (non-compounded).',
        suggestedCounterClause: 'Customer shall pay undisputed invoices within forty-five (45) calendar days of invoice receipt. Past due balances shall accrue simple interest at a rate of 1.0% per month or the statutory maximum, whichever is lower.',
        negotiationTip: 'Align with corporate AP payment cycles (Net 45/60). Eliminate daily compounding.',
        status: 'pending'
      },
      {
        id: 'c-msa-8',
        sectionNumber: 'Section 4.3',
        title: 'Unilateral 15% Annual Price Escalator',
        category: 'Payment Terms',
        riskLevel: 'Medium Risk',
        exactQuote: 'Upon each renewal term, Vendor reserves the absolute right to adjust subscription fees upward by up to fifteen percent (15%) upon thirty (30) days prior written or electronic notice to Customer.',
        explanation: 'Compounded over multi-year renewals, 15% annual inflation yields massive unbudgeted cost increases without correlation to Consumer Price Index (CPI) or service improvements.',
        marketStandard: 'Price increases capped at 3% to 5% or the trailing 12-month CPI index, requiring at least 60 days advance written notice.',
        suggestedCounterClause: 'Any price increase for renewal terms shall not exceed the lesser of three percent (3%) or the annual percentage increase in the US Consumer Price Index (CPI-U), and requires sixty (60) days advance written notice.',
        negotiationTip: 'Cap escalation at CPI or 3%. Insert right to terminate without penalty if Vendor exceeds cap.',
        status: 'pending'
      },
      {
        id: 'c-msa-9',
        sectionNumber: 'Section 1.2',
        title: 'Customer Data Ownership Retention',
        category: 'Data Privacy',
        riskLevel: 'Compliant',
        exactQuote: 'Customer retains ownership of Customer Data.',
        explanation: 'Standard compliant clause recognizing Customer\'s sole title, copyright, and proprietary rights in all uploaded business data.',
        marketStandard: 'Clear statement that Customer retains 100% intellectual property ownership of Customer Data.',
        suggestedCounterClause: 'As between the parties, Customer exclusively owns all right, title, and interest in and to all Customer Data.',
        negotiationTip: 'Maintain this clause as drafted.',
        status: 'accepted'
      }
    ]
  },
  {
    id: 'doc-dpa-02',
    title: 'DataFlow Global Data Processing Addendum (DPA)',
    fileName: 'DataFlow_Global_DPA_2026.txt',
    fileType: 'text/plain',
    uploadedAt: '2026-11-08T09:15:00Z',
    wordCount: 1920,
    overallRiskScore: 64,
    riskSummary: {
      high: 3,
      medium: 2,
      compliant: 2,
      total: 7,
    },
    categoryBreakdown: {
      'Indemnification': { high: 1, medium: 0, compliant: 0 },
      'Data Privacy': { high: 2, medium: 1, compliant: 1 },
      'Termination': { high: 0, medium: 1, compliant: 0 },
      'Payment Terms': { high: 0, medium: 0, compliant: 1 },
      'Liability & Warranties': { high: 0, medium: 0, compliant: 0 },
      'General': { high: 0, medium: 0, compliant: 0 },
    },
    executiveSummary:
      'Moderate-to-high compliance vulnerability in Cross-Border Transfer mechanisms (missing Standard Contractual Clauses (SCCs) modular annexes), audit fees charged to Customer, and an unshielded subprocessor liability pass-through.',
    content: `DATA PROCESSING ADDENDUM (GDPR / UK GDPR / CCPA)

ARTICLE 1. APPLICABILITY AND ROLES
1.1 Parties agree that Customer is the Controller and DataFlow Inc. is the Processor of Personal Data.
1.2 Processor shall process Personal Data solely in accordance with Controller's documented instructions.

ARTICLE 3. SECURITY AND AUDITS
3.1 Security Measures. Processor shall implement technical and organizational measures as specified in Annex II.
3.2 Customer Audits. Controller may request an independent security audit once every three (3) years. Any audit must be conducted by an auditor pre-approved by Processor, with at least ninety (90) business days advance written notice. Controller shall reimburse Processor at a rate of $400/hour for all internal employee time expended assisting such audit.

ARTICLE 5. CROSS-BORDER DATA TRANSFERS
5.1 International Transfers. Processor may transfer Personal Data to hosting facilities in jurisdictions outside the EEA, Switzerland, and the UK without separate Controller execution of Standard Contractual Clauses, relying solely on commercial adequacy assertions.

ARTICLE 7. ALLOCATION OF REGULATORY FINES & INDEMNITY
7.1 Regulatory Fines. In the event a supervisory authority assesses an administrative fine under GDPR or CCPA relating to processing under this Agreement, Controller shall fully indemnify and reimburse Processor for all such fines unless Processor acted with gross negligence.`,
    clauses: [
      {
        id: 'c-dpa-1',
        sectionNumber: 'Article 5.1',
        title: 'Informal Cross-Border Transfers Lacking Standard Contractual Clauses',
        category: 'Data Privacy',
        riskLevel: 'High Risk',
        exactQuote: 'Processor may transfer Personal Data to hosting facilities in jurisdictions outside the EEA, Switzerland, and the UK without separate Controller execution of Standard Contractual Clauses, relying solely on commercial adequacy assertions.',
        explanation: 'Severe violation of Chapter V GDPR (Articles 44-46). Cross-border transfers to non-adequate third countries strictly require valid transfer mechanisms (e.g., EU Standard Contractual Clauses 2021/914 Module 2/3). Commercial assertions are legally invalid.',
        marketStandard: 'Mandatory incorporation of EU SCCs with completed Annexes, UK Addendum, and Swiss transfer provisions.',
        suggestedCounterClause: 'Any transfer of Personal Data outside the EEA/UK/Switzerland shall be governed by the standard contractual clauses adopted by the European Commission (Decision 2021/914, Module 2/3), which are hereby incorporated by reference.',
        negotiationTip: 'Mandatory legal requirement. In-house counsel cannot sign off without standard EU SCCs.',
        status: 'pending'
      },
      {
        id: 'c-dpa-2',
        sectionNumber: 'Article 7.1',
        title: 'Customer Indemnifies Processor for Regulatory Fines',
        category: 'Indemnification',
        riskLevel: 'High Risk',
        exactQuote: 'In the event a supervisory authority assesses an administrative fine under GDPR or CCPA relating to processing under this Agreement, Controller shall fully indemnify and reimburse Processor for all such fines unless Processor acted with gross negligence.',
        explanation: 'Extremely aggressive risk transfer. Forces Customer to pay Processor\'s GDPR administrative fines even when Processor caused the breach through ordinary negligence or operational error.',
        marketStandard: 'Each party is liable for its own statutory fines and violations under GDPR Article 82. Processor must indemnify Controller if Processor violates GDPR Article 28 processor obligations.',
        suggestedCounterClause: 'Each party shall remain solely responsible and liable for any administrative fines levied against it by supervisory authorities. Processor shall defend and indemnify Controller against any fines or claims caused by Processor\'s failure to adhere to this DPA.',
        negotiationTip: 'Strike entire clause. Never indemnify a third-party vendor against their own regulatory penalties.',
        status: 'pending'
      },
      {
        id: 'c-dpa-3',
        sectionNumber: 'Article 3.2',
        title: 'Audit Restriction & $400/hr Audit Expense Surcharge',
        category: 'Data Privacy',
        riskLevel: 'Medium Risk',
        exactQuote: 'Controller may request an independent security audit once every three (3) years... Controller shall reimburse Processor at a rate of $400/hour for all internal employee time expended assisting such audit.',
        explanation: 'Audits once every 3 years restricts Customer\'s statutory right under GDPR Art 28(3)(h) to conduct annual or breach-triggered audits. $400/hr fee discourages legitimate security verification.',
        marketStandard: 'Annual audit permitted on 30 days notice, plus immediate audits following any confirmed security incident. Provision of SOC 2 Type II reports at no additional charge.',
        suggestedCounterClause: 'Controller may conduct an audit once per calendar year upon thirty (30) days prior notice, or immediately following any confirmed Security Incident. Processor shall provide current SOC 2 Type II / ISO 27001 certifications without fee.',
        negotiationTip: 'Accept SOC 2 Type II in lieu of on-site audits for routine years, but preserve free audit rights post-breach.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'doc-sla-03',
    title: 'ApexSLA Enterprise Infrastructure & Support Agreement',
    fileName: 'ApexSLA_Terms_2026.md',
    fileType: 'text/markdown',
    uploadedAt: '2026-11-05T11:00:00Z',
    wordCount: 1640,
    overallRiskScore: 52,
    riskSummary: {
      high: 2,
      medium: 2,
      compliant: 2,
      total: 6,
    },
    categoryBreakdown: {
      'Indemnification': { high: 0, medium: 1, compliant: 0 },
      'Data Privacy': { high: 0, medium: 0, compliant: 1 },
      'Termination': { high: 1, medium: 0, compliant: 1 },
      'Payment Terms': { high: 1, medium: 1, compliant: 0 },
      'Liability & Warranties': { high: 0, medium: 0, compliant: 0 },
      'General': { high: 0, medium: 0, compliant: 0 },
    },
    executiveSummary:
      'Key vulnerability identified in SLA termination remedies: continuous downtime of under 95% provides only a 10% credit without right to terminate contract. Payment terms contain non-refundable prepayments with zero clawback.',
    content: `SERVICE LEVEL & CLOUD INFRASTRUCTURE AGREEMENT

1. DOWNTIME COMMITMENTS
1.1 Uptime Target. Apex agrees to maintain 99.95% Monthly Uptime Percentage.
1.2 Scheduled Maintenance. Up to 16 hours of maintenance scheduled between 00:00 and 06:00 UTC on Sundays shall not count toward Downtime.

2. PENALTIES AND TERMINATION LIMITATIONS
2.1 Tiered Credits. If uptime falls below 99.0%, Customer shall receive a 10% credit. If uptime falls below 95.0%, Customer shall receive a 25% credit.
2.2 Exclusive Remedy. Service Credits are Customer's sole and exclusive remedy for any availability failure. In no event shall persistent or chronic SLA failure constitute cause for contract termination.

3. FEES AND PREPAYMENT FORFEITURE
3.1 Non-Refundable Upfront Payments. All multi-year prepayment sums are strictly non-refundable under all circumstances, even in the event of Vendor bankruptcy or chronic system unavailability.`,
    clauses: [
      {
        id: 'c-sla-1',
        sectionNumber: 'Section 2.2',
        title: 'No Termination Right for Chronic SLA Outages',
        category: 'Termination',
        riskLevel: 'High Risk',
        exactQuote: 'Service Credits are Customer\'s sole and exclusive remedy for any availability failure. In no event shall persistent or chronic SLA failure constitute cause for contract termination.',
        explanation: 'Extreme operational vulnerability. If the SaaS application remains offline for weeks, Customer has no legal right to exit the contract or migrate to an alternate vendor.',
        marketStandard: 'If Monthly Uptime falls below 99.0% for two (2) consecutive months or three (3) months in any 12-month period ("Chronic Failure"), Customer may terminate immediately for cause with full refund of unearned fees.',
        suggestedCounterClause: 'Notwithstanding Section 2.1, if Vendor fails to achieve at least 99.0% uptime in any two (2) consecutive calendar months or any three (3) months within a rolling twelve (12) month period, Customer may terminate this Agreement immediately for cause with written notice and receive a full prorated refund of all prepaid fees.',
        negotiationTip: 'Vital procurement safeguard. Never accept SLA credits as sole remedy without chronic failure termination escape hatch.',
        status: 'pending'
      },
      {
        id: 'c-sla-2',
        sectionNumber: 'Section 3.1',
        title: 'Non-Refundable Multi-Year Prepayment Forfeiture',
        category: 'Payment Terms',
        riskLevel: 'High Risk',
        exactQuote: 'All multi-year prepayment sums are strictly non-refundable under all circumstances, even in the event of Vendor bankruptcy or chronic system unavailability.',
        explanation: 'Severe financial risk. Strips away all common-law recovery remedies and bankruptcy clawbacks.',
        marketStandard: 'Upon termination for Vendor\'s breach, bankruptcy, or convenience, Vendor must promptly refund all unearned, prepaid fees on a pro-rata basis.',
        suggestedCounterClause: 'Upon any termination of this Agreement for Vendor breach, insolvency, or under Section 2.2, Vendor shall refund to Customer within thirty (30) days all prepaid and unearned fees calculated pro-rata from the effective termination date.',
        negotiationTip: 'Standard finance clause: CFO will not allow multi-year prepayment without pro-rata refund terms.',
        status: 'pending'
      }
    ]
  }
];
