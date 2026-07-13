CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT '其他',
  stock INTEGER NOT NULL DEFAULT 0,
  sales_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT '4.5',
  is_hot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_is_hot_idx ON products (is_hot);
CREATE INDEX IF NOT EXISTS products_sales_count_idx ON products (sales_count);