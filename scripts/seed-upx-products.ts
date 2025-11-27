import { getUncachableStripeClient } from '../server/stripeClient';

const UPX_PACKAGES = [
  {
    name: 'UPX Starter Pack',
    description: '1,000 UPX tokens - Perfect for getting started with UnityPay 2045',
    price: 999,
    upxAmount: 1000,
    metadata: {
      upx_amount: '1000',
      package_tier: 'starter',
      bonus_percentage: '0',
    }
  },
  {
    name: 'UPX Growth Pack',
    description: '5,000 UPX tokens - Best value for active users',
    price: 3999,
    upxAmount: 5000,
    metadata: {
      upx_amount: '5000',
      package_tier: 'growth',
      bonus_percentage: '10',
    }
  },
  {
    name: 'UPX Pro Pack',
    description: '25,000 UPX tokens - For power users and traders',
    price: 17999,
    upxAmount: 25000,
    metadata: {
      upx_amount: '25000',
      package_tier: 'pro',
      bonus_percentage: '20',
    }
  },
  {
    name: 'UPX Elite Pack',
    description: '100,000 UPX tokens - Maximum value with exclusive benefits',
    price: 59999,
    upxAmount: 100000,
    metadata: {
      upx_amount: '100000',
      package_tier: 'elite',
      bonus_percentage: '30',
    }
  },
];

async function seedProducts() {
  console.log('Starting UPX product seeding...');
  
  const stripe = await getUncachableStripeClient();

  for (const pkg of UPX_PACKAGES) {
    try {
      const existingProducts = await stripe.products.search({
        query: `name:'${pkg.name}'`,
      });

      if (existingProducts.data.length > 0) {
        console.log(`Product "${pkg.name}" already exists, skipping...`);
        continue;
      }

      console.log(`Creating product: ${pkg.name}`);
      
      const product = await stripe.products.create({
        name: pkg.name,
        description: pkg.description,
        metadata: pkg.metadata,
      });

      console.log(`Created product: ${product.id}`);

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.price,
        currency: 'usd',
        metadata: {
          upx_amount: pkg.metadata.upx_amount,
        },
      });

      console.log(`Created price: ${price.id} ($${(pkg.price / 100).toFixed(2)})`);
      console.log('---');
    } catch (error: any) {
      console.error(`Error creating ${pkg.name}:`, error.message);
    }
  }

  console.log('UPX product seeding complete!');
}

seedProducts().catch(console.error);
