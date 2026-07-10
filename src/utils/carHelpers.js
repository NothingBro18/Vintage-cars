export const generateDetails = (name, model) => {
  if (!name && !model) return "";
  const modelText = model ? ` ${model}` : "";
  return `The ${name}${modelText} is a timeless classic with iconic style and collector appeal. This car blends vintage charm with character that stands out on any road.`;
};

export const parsePriceNumber = (priceString) => {
  if (!priceString) return 0;
  const cleaned = priceString.replace(/[₹,\s+\+]/g, '').replace(/[^0-9.]/g, '');
  return Number(cleaned) || 0;
};

const knownCarSpecs = [
  {
    match: /Shelby GT500|Mustang/i,
    engine: "428 cu in (7.0L) V8",
    horsepower: "355 hp",
    topSpeed: "130 mph",
    price: "₹2,05,00,000+",
    address: "Los Angeles, USA"
  },
  {
    match: /Camaro SS|Chevelle/i,
    engine: "396 cu in (6.5L) V8",
    horsepower: "375 hp",
    topSpeed: "125 mph",
    price: "₹1,47,60,000",
    address: "Detroit, USA"
  },
  {
    match: /Charger R\/T|Charger/i,
    engine: "426 HEMI V8",
    horsepower: "425 hp",
    topSpeed: "140 mph",
    price: "₹1,80,40,000",
    address: "Detroit, USA"
  },
  {
    match: /Impala/i,
    engine: "V8",
    horsepower: "300 hp",
    topSpeed: "120 mph",
    price: "₹73,80,000",
    address: "USA"
  },
  {
    match: /Road Runner/i,
    engine: "440 V8",
    horsepower: "390 hp",
    topSpeed: "135 mph",
    price: "₹1,23,00,000",
    address: "USA"
  },
  {
    match: /Boss 302/i,
    engine: "302 V8",
    horsepower: "290 hp",
    topSpeed: "125 mph",
    price: "₹1,64,00,000",
    address: "USA"
  }
];

const defaultSpecs = {
  engine: "V8",
  horsepower: "300 hp",
  topSpeed: "120 mph",
  price: "Contact owner for price",
  address: "USA"
};

export const generateSpecs = ({ brand = "", model = "", name = "" }) => {
  const lookupKey = `${brand} ${model} ${name}`.trim();
  const spec = knownCarSpecs.find((entry) => entry.match.test(lookupKey));
  if (spec) return spec;

  if (/ford/i.test(brand) && /mustang/i.test(name + ' ' + model)) {
    return knownCarSpecs[0];
  }

  if (/chevrolet/i.test(brand) && /camaro|chevelle/i.test(name + ' ' + model)) {
    return knownCarSpecs[1];
  }

  if (/dodge/i.test(brand) && /charger/i.test(name + ' ' + model)) {
    return knownCarSpecs[2];
  }

  if (/plymouth/i.test(brand) && /road runner/i.test(name + ' ' + model)) {
    return knownCarSpecs[4];
  }

  if (/chevrolet/i.test(brand) && /impala/i.test(name + ' ' + model)) {
    return knownCarSpecs[3];
  }

  return defaultSpecs;
};
