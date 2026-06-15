import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpay = keyId && keySecret && keyId !== 'rzp_test_yourkeyid'
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : null;

if (!razorpay) {
  console.log('💳 Razorpay Credentials missing or set to testing defaults. Running in sandbox simulated checkout mode.');
}
