import { getUncachableStripeClient } from './stripeClient';
import { stripeStorage } from './stripeStorage';

export class StripeService {
  async createCustomer(email: string, userId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  async createCheckoutSession(
    customerId: string | null, 
    priceId: string, 
    successUrl: string, 
    cancelUrl: string,
    email?: string
  ) {
    const stripe = await getUncachableStripeClient();
    
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        product_type: 'upx_tokens',
      },
    };

    if (customerId) {
      sessionConfig.customer = customerId;
    } else if (email) {
      sessionConfig.customer_email = email;
    }

    return await stripe.checkout.sessions.create(sessionConfig);
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getProduct(productId: string) {
    return await stripeStorage.getProduct(productId);
  }

  async listProducts() {
    return await stripeStorage.listProducts();
  }

  async listProductsWithPrices() {
    return await stripeStorage.listProductsWithPrices();
  }
}

export const stripeService = new StripeService();
