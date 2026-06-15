import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PaymentService } from '../services/paymentService.js';
import { PaymentType } from '@prisma/client';

export class PaymentController {
  /**
   * Create Checkout Payment Order
   */
  static async createCheckoutOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id!;
      const { amount, type } = req.body;

      if (!amount || !type || !Object.values(PaymentType).includes(type)) {
        res.status(400).json({ error: 'Valid checkout amount and PaymentType (SUBSCRIPTION/MENTOR_SESSION) are required.' });
        return;
      }

      const orderDetails = await PaymentService.createOrder(userId, amount, type);
      res.json(orderDetails);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Confirm Payment Transaction
   */
  static async confirmPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id!;
      const { orderId, paymentId, signature, sandbox } = req.body;

      if (!orderId || !paymentId) {
        res.status(400).json({ error: 'Order ID and Payment ID are required to finalize transactions.' });
        return;
      }

      const success = await PaymentService.verifyPayment(
        userId,
        orderId,
        paymentId,
        signature || '',
        sandbox || false
      );

      if (success) {
        res.json({ success: true, message: 'Payment successfully processed and verified. Premium status unlocked.' });
      } else {
        res.status(400).json({ success: false, error: 'Payment signature checks failed. Transaction rejected.' });
      }
    } catch (err) {
      next(err);
    }
  }
}
