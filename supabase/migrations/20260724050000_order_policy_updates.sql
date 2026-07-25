-- Allow customers to request cancellations for their own pending or processing orders.
CREATE POLICY "Users request order cancellation" ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status IN ('pending', 'processing'))
  WITH CHECK (auth.uid() = user_id AND status IN ('refund_pending', 'cancel_requested'));

-- Allow admins to delete orders when refunds are completed.
CREATE POLICY "Admins delete orders" ON public.orders
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete order items as part of refund finalization.
CREATE POLICY "Admins delete order items" ON public.order_items
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
