// Script to generate fake CRM data
const fs = require('fs');
const path = require('path');

// Real company names from various sectors
const companies = [
  // Tech Giants
  'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Salesforce', 'Oracle', 'IBM',
  'Adobe', 'Intel', 'Nvidia', 'Cisco', 'Dell', 'HP', 'VMware', 'SAP', 'ServiceNow', 'Workday',
  'Zoom', 'Slack', 'Dropbox', 'Box', 'Atlassian', 'GitHub', 'MongoDB', 'Databricks', 'Snowflake', 'Palantir',
  
  // Finance
  'JPMorgan Chase', 'Bank of America', 'Goldman Sachs', 'Morgan Stanley', 'Citigroup', 'Wells Fargo',
  'American Express', 'Visa', 'Mastercard', 'PayPal', 'Stripe', 'Square', 'Fidelity', 'Charles Schwab',
  
  // Retail & E-commerce
  'Walmart', 'Target', 'Costco', 'Home Depot', 'Lowe\'s', 'Best Buy', 'Nike', 'Starbucks', 'McDonald\'s',
  'Coca-Cola', 'PepsiCo', 'Procter & Gamble', 'Unilever', 'Johnson & Johnson',
  
  // Healthcare & Pharma
  'Pfizer', 'Merck', 'Johnson & Johnson', 'Abbott', 'Medtronic', 'UnitedHealth', 'Anthem', 'Cigna',
  'CVS Health', 'Walgreens', 'McKesson',
  
  // Manufacturing & Industrial
  'General Electric', 'Boeing', 'Lockheed Martin', 'Caterpillar', '3M', 'Honeywell', 'Deere',
  'Ford', 'General Motors', 'Toyota',
  
  // Media & Entertainment
  'Disney', 'Warner Bros', 'Comcast', 'ViacomCBS', 'Spotify', 'Uber', 'Lyft', 'Airbnb',
  
  // Energy & Utilities
  'ExxonMobil', 'Chevron', 'Shell', 'BP', 'ConocoPhillips',
  
  // Telecom
  'AT&T', 'Verizon', 'T-Mobile', 'Sprint',
  
  // Consulting & Services
  'Accenture', 'Deloitte', 'PwC', 'EY', 'KPMG', 'McKinsey', 'BCG', 'Bain',
  
  // Other
  'FedEx', 'UPS', 'Amazon Web Services', 'Alibaba', 'Tencent', 'Samsung', 'Sony', 'Panasonic'
];

// Fake first names
const firstNames = [
  'James', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles',
  'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
  'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob',
  'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin',
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett',
  'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora',
  'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe'
];

// Fake last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
  'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks'
];

// Job titles
const jobTitles = [
  'CEO', 'CTO', 'CFO', 'CMO', 'VP of Sales', 'VP of Marketing', 'VP of Engineering', 'VP of Product',
  'Director of Sales', 'Director of Marketing', 'Director of Engineering', 'Director of Operations',
  'Senior Manager', 'Product Manager', 'Engineering Manager', 'Sales Manager', 'Marketing Manager',
  'Account Executive', 'Business Development Manager', 'Operations Manager', 'Project Manager',
  'Senior Engineer', 'Software Engineer', 'Data Scientist', 'Product Designer', 'UX Designer',
  'Business Analyst', 'Financial Analyst', 'Marketing Specialist', 'Sales Representative'
];

// Industries
const industries = [
  'Technology', 'Software', 'SaaS', 'Cloud Services', 'E-commerce', 'Retail', 'Finance', 'Banking',
  'Healthcare', 'Pharmaceutical', 'Manufacturing', 'Automotive', 'Energy', 'Telecommunications',
  'Media', 'Entertainment', 'Consulting', 'Professional Services', 'Real Estate', 'Education'
];

// Cities and states
const locations = [
  { city: 'San Francisco', state: 'CA' },
  { city: 'New York', state: 'NY' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Boston', state: 'MA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'Miami', state: 'FL' },
  { city: 'Portland', state: 'OR' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'San Diego', state: 'CA' }
];

// Buying roles
const buyingRoles = ['Decision Maker', 'Influencer', 'Economic Buyer', 'Technical Buyer', 'End User', 'Champion'];

// Lifecycle stages
const lifecycleStages = ['Lead', 'Opportunity', 'Customer'];

// Deal stages
const dealStages = ['Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

// Activity types
const activityTypes = ['call', 'email', 'meeting', 'note', 'task'];

// Activity titles
const activityTitles = [
  'Completed call with {name}',
  'Sent proposal to {company}',
  'Follow-up meeting scheduled',
  'Contract signed',
  'Demo completed',
  'Initial discovery call',
  'Sent pricing information',
  'Follow-up email sent',
  'Product demo scheduled',
  'Technical review completed',
  'Stakeholder meeting',
  'Contract negotiation',
  'Proposal reviewed',
  'Reference call completed',
  'ROI analysis shared'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateCompanyId(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateEmail(firstName, lastName, companyDomain) {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName[0].toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${randomInt(1, 99)}`
  ];
  return `${randomElement(formats)}@${companyDomain}`;
}

function generatePhone() {
  const countryCodes = ['+1', '+44', '+49', '+33', '+81'];
  const code = randomElement(countryCodes);
  const number = randomInt(1000000000, 9999999999).toString();
  return `${code} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
}

function generateRevenue(employees) {
  const empCount = parseInt(employees.replace(/,/g, ''));
  if (empCount > 100000) return `$${randomInt(50, 500)}B`;
  if (empCount > 10000) return `$${randomInt(1, 50)}B`;
  if (empCount > 1000) return `$${randomInt(100, 1000)}M`;
  return `$${randomInt(10, 100)}M`;
}

// Generate companies with unique IDs
const generatedCompanies = [];
const usedIds = new Set();

companies.slice(0, 120).forEach((name, index) => {
  const location = randomElement(locations);
  const employees = randomInt(100, 500000).toLocaleString();
  const industry = randomElement(industries);
  const domain = name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';
  
  // Generate unique ID
  let companyId = generateCompanyId(name);
  let counter = 1;
  while (usedIds.has(companyId)) {
    companyId = `${generateCompanyId(name)}-${counter}`;
    counter++;
  }
  usedIds.add(companyId);
  
  generatedCompanies.push({
    id: companyId,
    name: name,
    domain: domain,
    phone: generatePhone(),
    industry: industry,
    employees: employees,
    revenue: generateRevenue(employees),
    address: `${randomInt(100, 9999)} ${randomElement(['Main', 'Park', 'Oak', 'Maple', 'First', 'Second'])} Street`,
    city: location.city,
    country: 'United States',
    ownerId: 'sevda-danaie',
    lifecycleStage: randomElement(lifecycleStages),
    isPrimary: index < 10
  });
});

// Generate contacts (2-5 per company)
const generatedContacts = [];
let contactId = 1;
generatedCompanies.forEach(company => {
  const numContacts = randomInt(2, 5);
  for (let i = 0; i < numContacts; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const jobTitle = randomElement(jobTitles);
    const location = locations.find(l => l.city === company.city) || randomElement(locations);
    
    generatedContacts.push({
      id: contactId.toString(),
      firstName: firstName,
      lastName: lastName,
      email: generateEmail(firstName, lastName, company.domain),
      jobTitle: jobTitle,
      companyId: company.id,
      phone: generatePhone(),
      mobilePhone: generatePhone(),
      streetAddress: `${randomInt(100, 9999)} ${randomElement(['Main', 'Park', 'Oak', 'Maple'])} Avenue`,
      city: location.city,
      stateRegion: location.state,
      postalCode: randomInt(10000, 99999).toString(),
      leadStatus: randomElement(['New', 'Qualified', 'Contacted', '--']),
      lifecycleStage: randomElement(lifecycleStages),
      buyingRole: randomElement([...buyingRoles, '--']),
      ownerId: 'sevda-danaie',
      avatar: '/placeholder.svg?height=80&width=80',
      lastActivity: randomElement([
        `Completed call with ${firstName}`,
        `Sent proposal document`,
        `Follow-up meeting scheduled`,
        `Contract signed`,
        `Demo completed`,
        `No activity yet`
      ])
    });
    contactId++;
  }
});

// Generate deals
const generatedDeals = [];
let dealId = 1;
const dealTemplates = [
  'Enterprise License',
  'Annual Contract',
  'Q4 Expansion',
  'Multi-year Agreement',
  'Professional Services',
  'Implementation Project',
  'Upsell Opportunity',
  'Renewal Contract',
  'Strategic Partnership',
  'Pilot Program'
];

const now = new Date();
const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
const sixMonthsFuture = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

// Generate deals for each company
generatedCompanies.forEach(company => {
  const numDeals = randomInt(1, 4);
  const companyContacts = generatedContacts.filter(c => c.companyId === company.id);
  
  for (let i = 0; i < numDeals; i++) {
    const stage = randomElement(dealStages);
    let probability;
    let closeDate;
    
    if (stage === 'Qualified') {
      probability = randomInt(20, 40);
      closeDate = randomDate(now, sixMonthsFuture);
    } else if (stage === 'Proposal') {
      probability = randomInt(50, 70);
      closeDate = randomDate(now, sixMonthsFuture);
    } else if (stage === 'Negotiation') {
      probability = randomInt(70, 90);
      closeDate = randomDate(now, sixMonthsFuture);
    } else if (stage === 'Closed Won') {
      probability = 100;
      closeDate = randomDate(sixMonthsAgo, now);
    } else { // Closed Lost
      probability = 0;
      closeDate = randomDate(sixMonthsAgo, now);
    }
    
    generatedDeals.push({
      id: dealId.toString(),
      name: `${company.name} ${randomElement(dealTemplates)}`,
      amount: randomInt(10000, 2000000),
      stage: stage,
      probability: probability,
      closeDate: closeDate.toISOString().split('T')[0],
      companyId: company.id,
      contactIds: companyContacts.length > 0 
        ? [companyContacts[randomInt(0, companyContacts.length - 1)].id]
        : [],
      ownerId: 'sevda-danaie',
      priority: randomElement(['high', 'medium', 'low'])
    });
    dealId++;
  }
});

// Generate activities (spread over 6 months, more recent = more activities)
const generatedActivities = [];
let activityId = 1;
const daysAgo = [0, 1, 2, 3, 4, 5, 7, 10, 14, 21, 30, 45, 60, 90, 120, 150, 180];

// Weight recent dates more heavily
for (let i = 0; i < 150; i++) {
  let daysBack;
  if (i < 50) {
    // 50 activities in last 7 days
    daysBack = randomInt(0, 7);
  } else if (i < 100) {
    // 50 activities in last 30 days
    daysBack = randomInt(0, 30);
  } else {
    // 50 activities spread over 6 months
    daysBack = randomInt(0, 180);
  }
  
  const activityDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const contact = randomElement(generatedContacts);
  const activityType = randomElement(activityTypes);
  const titleTemplate = randomElement(activityTitles);
  const title = titleTemplate
    .replace('{name}', `${contact.firstName} ${contact.lastName}`)
    .replace('{company}', generatedCompanies.find(c => c.id === contact.companyId)?.name || 'Company');
  
  // Add random hours and minutes
  activityDate.setHours(randomInt(9, 17));
  activityDate.setMinutes(randomInt(0, 59));
  
  generatedActivities.push({
    id: activityId.toString(),
    type: activityType,
    contactId: contact.id,
    title: title,
    timestamp: activityDate.toISOString(),
    userId: 'sevda-danaie'
  });
  activityId++;
}

// Generate tickets (update existing structure)
const generatedTickets = [];
let ticketId = 1;
const ticketTitles = [
  'Login issues with SSO',
  'Feature request: Export data',
  'Billing inquiry',
  'Integration support needed',
  'Performance optimization',
  'API documentation request',
  'Custom report needed',
  'Data migration assistance',
  'User access permissions',
  'Bug report: Dashboard loading'
];

for (let i = 0; i < 30; i++) {
  const contact = randomElement(generatedContacts);
  const company = generatedCompanies.find(c => c.id === contact.companyId);
  const createdAt = randomDate(sixMonthsAgo, now);
  const updatedAt = new Date(createdAt.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000);
  
  generatedTickets.push({
    id: ticketId.toString(),
    title: randomElement(ticketTitles),
    description: `Support request from ${contact.firstName} ${contact.lastName} at ${company?.name || 'Company'}`,
    status: randomElement(['New', 'In Progress', 'Resolved', 'Closed']),
    priority: randomElement(['High', 'Medium', 'Low']),
    contactId: contact.id,
    companyId: company?.id || '',
    assigneeId: 'sevda-danaie',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  });
  ticketId++;
}

// Preserve users
const users = [
  {
    id: 'sevda-danaie',
    name: 'Sevda Danaie',
    email: 'sevda@company.com',
    initials: 'SD'
  }
];

// Create final data structure
const data = {
  contacts: generatedContacts,
  companies: generatedCompanies,
  deals: generatedDeals,
  tickets: generatedTickets,
  activities: generatedActivities,
  users: users
};

// Write to file
const filePath = path.join(__dirname, '..', 'data', 'contacts.json');
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Generated:`);
console.log(`- ${generatedCompanies.length} companies`);
console.log(`- ${generatedContacts.length} contacts`);
console.log(`- ${generatedDeals.length} deals`);
console.log(`- ${generatedActivities.length} activities`);
console.log(`- ${generatedTickets.length} tickets`);
console.log(`Data written to ${filePath}`);

