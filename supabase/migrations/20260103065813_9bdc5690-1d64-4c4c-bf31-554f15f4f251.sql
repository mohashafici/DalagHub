-- Create product status enum
CREATE TYPE public.product_status AS ENUM ('active', 'sold');

-- Add status column to products
ALTER TABLE public.products 
ADD COLUMN status public.product_status NOT NULL DEFAULT 'active';

-- Create product reports table
CREATE TABLE public.product_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on product_reports
ALTER TABLE public.product_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can create a report (even anonymous for MVP)
CREATE POLICY "Anyone can create reports"
ON public.product_reports
FOR INSERT
WITH CHECK (true);

-- Only admins could view reports (for now, restrict to service role)
CREATE POLICY "Reports are not publicly viewable"
ON public.product_reports
FOR SELECT
USING (false);

-- Add index for efficient queries
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_product_reports_product_id ON public.product_reports(product_id);