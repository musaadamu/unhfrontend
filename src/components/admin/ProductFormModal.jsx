import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

const ProductFormModal = ({ product, categories, onClose, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    brand: '',
    sku: '',
    modelNumber: '',
    isFeatured: false,
    isActive: true,
    images: [],
    specifications: [],
    warranty: { duration: '', details: '' },
    tags: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [imageFilename, setImageFilename] = useState('');

  // Debug: Log categories when component mounts or categories change
  useEffect(() => {
    console.log('ProductFormModal - Categories received:', categories);
    console.log('ProductFormModal - Categories count:', categories?.length || 0);
  }, [categories]);

  useEffect(() => {
    if (product) {
      // Convert specifications array to array format for editing
      const specs = Array.isArray(product.specifications)
        ? product.specifications
        : Object.entries(product.specifications || {}).map(([name, value]) => ({ name, value }));

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        compareAtPrice: product.compareAtPrice || '',
        category: product.category?._id || '',
        subcategory: product.subcategory || '',
        stock: product.stock || '',
        brand: product.brand || '',
        sku: product.sku || '',
        modelNumber: product.modelNumber || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        images: product.images || [],
        specifications: specs,
        warranty: product.warranty || { duration: '', details: '' },
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { name: newSpecKey.trim(), value: newSpecValue.trim() }]
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleWarrantyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      warranty: {
        ...prev.warranty,
        [field]: value
      }
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addImageByFilename = () => {
    if (imageFilename.trim()) {
      const newImage = {
        url: imageFilename.trim(),
        alt: formData.name || 'Product image',
        isPrimary: formData.images.length === 0
      };
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setImageFilename('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize existing images (they might be strings or objects) into the
      // shape expected by the backend: { url, alt, isPrimary }
      const normalizedExistingImages = (formData.images || []).map((img, index) =>
        typeof img === 'string'
          ? { url: img, alt: formData.name, isPrimary: index === 0 }
          : img
      );

      // Prepare images array by combining normalized existing images with any
      // newly selected files (we only set url to the filename here; uploads are
      // handled elsewhere).
      const images = [
        ...normalizedExistingImages,
        ...imageFiles.map((file, index) => ({
          url: file.name,
          alt: formData.name,
          // If there are no existing images, mark the first uploaded as primary
          isPrimary: normalizedExistingImages.length === 0 && index === 0
        }))
      ];

      // Process tags
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const productData = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images,
        specifications: formData.specifications,
        tags
      };

      // Remove empty optional fields
      if ('sku' in productData && (productData.sku === '' || productData.sku == null)) {
        delete productData.sku;
      }
      if ('subcategory' in productData && !productData.subcategory) {
        delete productData.subcategory;
      }
      if ('modelNumber' in productData && !productData.modelNumber) {
        delete productData.modelNumber;
      }
      if ('compareAtPrice' in productData && !productData.compareAtPrice) {
        delete productData.compareAtPrice;
      }

      if (product) {
        // Update existing product
        await axios.put(
          `${API_URL}/api/products/${product._id}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product updated successfully!');
      } else {
        // Create new product
        await axios.post(
          `${API_URL}/api/products`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product created successfully!');
      }

      onClose(true); // Close modal and refresh list
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price (e.g., 250000)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare at Price (₦)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter original price (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories && categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )}
              </select>
              {(!categories || categories.length === 0) && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ No categories available. Please refresh the page or contact admin.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g., Switches, Sockets, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Samsung, LG, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Stock Keeping Unit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Number
              </label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="Product model number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., energy-efficient, smart, wireless"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600">Click to upload images or enter filename below</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JFIF - Place files in frontend/public/images/products/</p>
              </label>

              {/* Manual Image Filename Input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={imageFilename}
                  onChange={(e) => setImageFilename(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageByFilename())}
                  placeholder="Or enter image filename (e.g., globe1.jfif)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addImageByFilename}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: Use existing images like globe1.jfif, socket1.jfif, solar1.jfif, etc.
              </p>

              {/* Existing Images */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`/images/products/${img.url || img}`}
                          alt={img.alt || 'Product'}
                          className="w-full h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        {img.isPrimary && (
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imageFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-xs text-gray-600 text-center px-2">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Place your image files in <code className="bg-gray-100 px-1 rounded">frontend/public/images/products/</code>
              and they will be automatically available. Just enter the filename (e.g., switch1.jfif).
            </p>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Specifications
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              {/* Existing Specifications */}
              {formData.specifications.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="font-medium text-sm flex-1">{spec.name}:</span>
                      <span className="text-sm flex-1">{spec.value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Specification */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Spec name (e.g., Voltage)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g., 220V)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warranty Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={formData.warranty.duration}
                  onChange={(e) => handleWarrantyChange('duration', e.target.value)}
                  placeholder="Duration (e.g., 1 Year, 6 Months)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.warranty.details}
                  onChange={(e) => handleWarrantyChange('details', e.target.value)}
                  placeholder="Details (e.g., Manufacturer warranty)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;

