CREATE POLICY "Product images are publicly readable"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');