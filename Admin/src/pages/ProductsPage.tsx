import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, X, UploadCloud, Check, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Product, Category } from '../types';

export const ProductsPage: React.FC = () => {
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal / Form state (Screen 13)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState('2999');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStock, setFormStock] = useState('25');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formHighlights, setFormHighlights] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, cats] = await Promise.all([
        api.admin.getProducts({ search: searchTerm || undefined, categoryId: selectedCategory || undefined, limit: 100 }),
        api.categories.getAll(),
      ]);
      setProducts(prodRes.products);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedCategory]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSku('SN-' + Math.floor(1000 + Math.random() * 9000));
    setFormPrice('2999');
    setFormComparePrice('');
    setFormCategoryId(categories[0]?.id || '');
    setFormStock('20');
    setFormDescription('Engineered with premium durable materials for everyday reliable performance.');
    setFormImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80');
    setFormHighlights('Premium Quality, Direct Manufacturer Warranty, Fast Delivery');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormSku(p.sku);
    setFormPrice(String(p.price));
    setFormComparePrice(p.compareAtPrice ? String(p.compareAtPrice) : '');
    setFormCategoryId(p.categoryId);
    setFormStock(String(p.stock));
    setFormDescription(p.description);
    setFormImageUrl(p.images[0]?.url || '');
    setFormHighlights(p.highlights || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formTitle,
        sku: formSku,
        price: parseFloat(formPrice),
        compareAtPrice: formComparePrice ? parseFloat(formComparePrice) : null,
        categoryId: formCategoryId,
        stock: parseInt(formStock, 10),
        description: formDescription,
        highlights: formHighlights,
        images: formImageUrl ? [{ url: formImageUrl, isPrimary: true, sortOrder: 1 }] : [],
      };

      if (editingProduct) {
        await api.admin.updateProduct(editingProduct.id, payload);
        toast.success(`"${formTitle}" updated successfully`);
      } else {
        await api.admin.createProduct(payload);
        toast.success(`"${formTitle}" added to catalogue`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.admin.deleteProduct(id);
      toast.info(`Deleted "${title}"`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
            Products Management
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
            Manage inventory items, pricing, specs, and add new products.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', borderRadius: '10px' }}
          />
        </div>

        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: '220px', borderRadius: '10px' }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#F8FAFC', color: 'var(--muted-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>Product</th>
                <th style={{ padding: '14px 20px' }}>SKU</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Price</th>
                <th style={{ padding: '14px 20px' }}>Stock</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-ink)' }}>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-ink)' }}>
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80';

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={img}
                            alt={p.title}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', padding: '3px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted-ink)' }}>Rating: {p.rating} &bull; {p.reviewCount} reviews</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        {p.sku}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ backgroundColor: '#F1F5F9', color: 'var(--ink)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {p.category?.name || 'Category'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#DC2626' : '#15803D' }}>
                          {p.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: p.isActive ? '#DCFCE7' : '#F1F5F9',
                            color: p.isActive ? '#15803D' : '#64748B',
                          }}
                        >
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="btn btn-danger btn-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen 13: ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add Product (Seller)'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-ink)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Watch Pro"
                    className="form-input"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter price"
                    className="form-input"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter stock quantity"
                    className="form-input"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                  />
                </div>

                {/* Upload Images dropzone (Screen 13) */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Upload Images</label>
                  <div
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      marginBottom: '8px',
                    }}
                    onClick={() => {
                      const url = prompt('Enter Image URL for product photograph:', formImageUrl);
                      if (url) setFormImageUrl(url);
                    }}
                  >
                    <UploadCloud size={32} color="var(--brand-blue)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
                      Click to upload or drag and drop
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-ink)', marginTop: '2px' }}>
                      PNG, JPG (Max 10MB)
                    </div>
                  </div>
                  <input
                    type="url"
                    placeholder="Or enter image URL (https://...)"
                    className="form-input"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter product description..."
                    className="form-textarea"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Highlights (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Heart rate monitor, Sleep tracking, Water resistant"
                    className="form-input"
                    value={formHighlights}
                    onChange={(e) => setFormHighlights(e.target.value)}
                  />
                </div>
              </div>

              {/* Action buttons (Screen 13: Save Product) */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
