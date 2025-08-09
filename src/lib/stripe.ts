import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-07-30.basil",
});

export default stripe;

// Payment helper functions
export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { paymentIntent, error: null };
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    return { paymentIntent: null, error };
  }
};

export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return { customer, error: null };
  } catch (error) {
    console.error("Stripe customer creation error:", error);
    return { customer: null, error };
  }
};

export const createSubscription = async (
  customerId: string,
  priceId: string
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });
    return { subscription, error: null };
  } catch (error) {
    console.error("Stripe subscription error:", error);
    return { subscription: null, error };
  }
};

// Real estate specific payment functions
export const createListingPayment = async (
  amount: number,
  customerEmail: string,
  propertyAddress: string
) => {
  try {
    const customer = await createCustomer(customerEmail);
    if (customer.error) throw customer.error;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.customer!.id,
      metadata: {
        propertyAddress,
        type: "listing_payment",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { paymentIntent, error: null };
  } catch (error) {
    console.error("Listing payment error:", error);
    return { paymentIntent: null, error };
  }
};

export const createMarketingPackagePayment = async (
  amount: number,
  customerEmail: string,
  packageName: string
) => {
  try {
    const customer = await createCustomer(customerEmail);
    if (customer.error) throw customer.error;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.customer!.id,
      metadata: {
        packageName,
        type: "marketing_package",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { paymentIntent, error: null };
  } catch (error) {
    console.error("Marketing package payment error:", error);
    return { paymentIntent: null, error };
  }
};
