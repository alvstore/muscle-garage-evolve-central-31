
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, ProductCategory } from '@/types/store';
import { formatCurrency } from '@/utils/formatters';
import { Edit, Plus, ShoppingCart } from 'lucide-react';

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onAddNew?: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  isMemberView?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit, onAddNew, onAddToCart, isMemberView = false }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchProducts = async () => {
      // Simulating API call with timeout
      setTimeout(() => {
        const mockProducts: Product[] = [
          {
            id: 'prod_1',
            name: 'Premium Whey Protein',
            description: 'High-quality whey protein to support muscle growth and recovery.',
            price: 1999,
            salePrice: 1799,
            category: 'supplement',
            status: 'in-stock',
            stock: 45,
            sku: 'WHEY-001',
            images: ['/placeholder.svg'],
            features: ['24g protein per serving', 'Low in carbs and fat', 'Great taste'],
            brand: 'NutriMax',
            featured: true,
            createdAt: '2023-12-01',
          },
          {
            id: 'prod_2',
            name: 'Adjustable Dumbbells (5-25kg)',
            description: 'Space-saving adjustable dumbbells for home workouts.',
            price: 12000,
            category: 'equipment',
            status: 'in-stock',
            stock: 8,
            sku: 'DUMB-001',
            images: ['/placeholder.svg'],
            brand: 'FitGear',
            featured: true,
            createdAt: '2023-11-15',
          },
          {
            id: 'prod_3',
            name: 'Performance T-Shirt',
            description: 'Moisture-wicking t-shirt for comfortable workouts.',
            price: 799,
            salePrice: 599,
            category: 'apparel',
            status: 'in-stock',
            stock: 120,
            sku: 'TSHIRT-001',
            images: ['/placeholder.svg'],
            brand: 'ActiveWear',
            featured: false,
            createdAt: '2023-12-10',
          },
          {
            id: 'prod_4',
            name: 'Fitness Tracker Watch',
            description: 'Track your workouts, heart rate, and sleep patterns.',
            price: 3499,
            category: 'accessory',
            status: 'low-stock',
            stock: 3,
            sku: 'FTWATCH-001',
            images: ['/placeholder.svg'],
            brand: 'TechFit',
            featured: true,
            createdAt: '2023-10-20',
          },
          {
            id: 'prod_5',
            name: 'Muscle Gain Bundle',
            description: 'Protein, creatine, and BCAA bundle for serious muscle gain.',
            price: 3999,
            category: 'supplement',
            status: 'in-stock',
            stock: 15,
            sku: 'BUNDLE-001',
            images: ['/placeholder.svg'],
            features: ['Premium protein', 'Pure creatine', 'Essential BCAAs'],
            brand: 'NutriMax',
            featured: false,
            createdAt: '2023-11-05',
          },
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    };
    
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'supplement', label: 'Supplements' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'membership', label: 'Memberships' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {!isMemberView && onAddNew && (
          <Button onClick={onAddNew} className="gap-1">
            <Plus size={16} />
            Add New Product
          </Button>
        )}
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex w-full h-auto flex-wrap overflow-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.value} 
              value={category.value}
              className="flex-shrink-0"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img 
                  src={product.images[0] || '/placeholder.svg'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              </CardHeader>
              
              <CardContent className="pb-4 flex-grow">
                <p className="text-sm line-clamp-2">{product.description}</p>
                
                <div className="mt-3 flex items-center">
                  {product.salePrice ? (
                    <>
                      <span className="font-semibold">{formatCurrency(product.salePrice)}</span>
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatCurrency(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                
                <div className="mt-1 text-sm">
                  <span className={`
                    ${product.status === 'in-stock' ? 'text-green-600' : ''}
                    ${product.status === 'low-stock' ? 'text-amber-600' : ''}
                    ${product.status === 'out-of-stock' ? 'text-red-600' : ''}
                    ${product.status === 'discontinued' ? 'text-gray-600' : ''}
                  `}>
                    {product.status === 'in-stock' && 'In stock'}
                    {product.status === 'low-stock' && 'Low stock'}
                    {product.status === 'out-of-stock' && 'Out of stock'}
                    {product.status === 'discontinued' && 'Discontinued'}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="flex w-full gap-2">
                  {isMemberView && onAddToCart ? (
                    <Button 
                      className="w-full flex items-center gap-1"
                      onClick={() => onAddToCart(product, 1)}
                      disabled={product.status === 'out-of-stock' || product.status === 'discontinued'}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </Button>
                  ) : onEdit ? (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-1"
                      onClick={() => onEdit(product)}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                  ) : null}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
