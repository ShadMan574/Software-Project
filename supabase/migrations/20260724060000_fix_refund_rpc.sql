-- Fix refund RPC and admin delete policies

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

CREATE POLICY IF NOT EXISTS "Admins delete orders" ON public.orders
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins delete order items" ON public.order_items
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
