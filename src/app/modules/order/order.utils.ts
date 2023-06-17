import { Order } from './order.model';

export const findLastOrderId = async (): Promise<string | undefined> => {
  const lastOrder = await Order.findOne({}, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastOrder?.id ? lastOrder.id.substring(2) : undefined;
};

export const generateOrderId = async (): Promise<string> => {
  const currentId =
    (await findLastOrderId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `O-${incrementedId}`;

  return incrementedId;
};
