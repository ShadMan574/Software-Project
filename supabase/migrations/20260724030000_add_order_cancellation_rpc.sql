CREATE OR REPLACE FUNCTION public.request_order_cancellation(order_id UUID, requester_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_order public.orders%ROWTYPE;
BEGIN
  SELECT * INTO current_order
  FROM public.orders
  WHERE id = order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF current_order.user_id <> requester_user_id AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'You are not allowed to cancel this order';
  END IF;

  IF current_order.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Only pending or processing orders can be cancelled';
  END IF;

  UPDATE public.orders
  SET status = 'refund_pending',
      refund_status = 'pending',
      cancel_requested_at = now()
  WHERE id = order_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_order_cancellation(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_order_refund(order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_order public.orders%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve refunds';
  END IF;

  SELECT * INTO current_order
  FROM public.orders
  WHERE id = order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  DELETE FROM public.order_items WHERE order_id = order_id;
  DELETE FROM public.orders WHERE id = order_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_order_refund(UUID) TO authenticated;
