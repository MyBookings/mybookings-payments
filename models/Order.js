import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
  payment_id: {
    type: String,
    required: true,
    default: 'undefined',
  },
  status: {
    type: String,
    required: true,
    default: 'open',
    enum: ['open', 'paid', 'expired', 'failed', 'canceled'],
  },
  email: {
    type: String,
    required: true,
  },
  reservation_ids: {
    type: [String],
    required: true,
  },
  service_id: {
    type: String,
    required: true,
  },
  total_value: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
