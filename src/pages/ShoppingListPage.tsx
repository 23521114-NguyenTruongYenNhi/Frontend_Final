import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ShoppingListItem } from '../types/recipe';
import { Logo } from '../components/Logo';
// Import API thật
import { shoppingListAPI } from '../api/client';

export function ShoppingListPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');
    const [newItemUnit, setNewItemUnit] = useState('pcs');

    // Common units
    const commonUnits = ['pcs', 'kg', 'g', 'lbs', 'oz', 'ml', 'l', 'cups', 'tbsp', 'tsp'];

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Load shopping list
    useEffect(() => {
        if (user) {
            loadShoppingList();
        }
    }, [user]);

    // Hàm hỗ trợ chuẩn hóa dữ liệu (Map _id từ MongoDB sang id cho Frontend)
    const normalizeItems = (data: any[]): ShoppingListItem[] => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
            ...item,
            id: item.id || item._id || Date.now().toString(), // Ưu tiên id, nếu không có thì lấy _id
            checked: !!item.checked // Đảm bảo checked luôn là boolean
        }));
    };

    const loadShoppingList = async () => {
        try {
            setLoading(true);
            const response: any = await shoppingListAPI.getList();

            console.log("API Response Shopping List:", response);

            let rawItems: any[] = [];

            // Kiểm tra cấu trúc trả về
            if (Array.isArray(response)) {
                rawItems = response;
            } else if (response && Array.isArray(response.data)) {
                rawItems = response.data;
            } else if (response && Array.isArray(response.items)) {
                rawItems = response.items;
            } else {
                console.warn("Dữ liệu shopping list không đúng định dạng mảng.");
                rawItems = [];
            }

            // Chuẩn hóa dữ liệu trước khi set state
            setItems(normalizeItems(rawItems));

        } catch (error) {
            console.error('Failed to load shopping list:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newItemName.trim()) return;

        try {
            const payload = {
                name: newItemName.trim(),
                quantity: parseFloat(newItemQuantity) || 1,
                unit: newItemUnit,
                checked: false,
            };

            // Gọi API thêm mới
            const newItem = await shoppingListAPI.addItem(payload);

            // Chuẩn hóa item mới trả về từ server
            // Nếu API không trả về item (hoặc null), dùng payload + fake ID
            const normalizedNewItem = newItem
                ? { ...newItem, id: newItem.id || newItem._id }
                : { ...payload, id: Date.now().toString() };

            setItems(prev => [...prev, normalizedNewItem]);

            // Reset form
            setNewItemName('');
            setNewItemQuantity('1');
            setNewItemUnit('pcs');
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Failed to add item. Please try again.');
        }
    };

    const handleToggleItem = async (id: string) => {
        if (!id) {
            console.error("Item ID is missing");
            return;
        }

        // Optimistic update
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );

        try {
            await shoppingListAPI.toggleItem(id);
        } catch (error) {
            console.error('Failed to toggle item:', error);
            // Revert nếu lỗi
            setItems(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, checked: !item.checked } : item
                )
            );
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!id) {
            console.error("Item ID is missing");
            return;
        }

        if (!confirm('Are you sure you want to delete this item?')) return;

        // Optimistic update
        const previousItems = [...items];
        setItems(prev => prev.filter(item => item.id !== id));

        try {
            await shoppingListAPI.deleteItem(id);
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item. Please try again.');
            setItems(previousItems); // Hoàn tác
        }
    };

    const handleClearCompleted = async () => {
        const safeItems = Array.isArray(items) ? items : [];
        const completedCount = safeItems.filter(item => item.checked).length;

        if (completedCount === 0) {
            alert('No completed items to clear.');
            return;
        }

        if (!confirm(`Clear ${completedCount} completed item(s)?`)) return;

        try {
            await shoppingListAPI.clearCompleted();
            setItems(prev => prev.filter(item => !item.checked));
        } catch (error) {
            console.error('Failed to clear completed items:', error);
            alert('Failed to clear items. Please try again.');
        }
    };

    // Tính toán chỉ số an toàn
    const safeItems = Array.isArray(items) ? items : [];
    const totalItems = safeItems.length;
    const completedItems = safeItems.filter(item => item.checked).length;
    const pendingItems = totalItems - completedItems;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Logo size="sm" />
                        </Link>

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back to Home</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ShoppingBag className="w-10 h-10 text-orange-500" />
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
                            Shopping List
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Your personal grocery shopping companion
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
                        <div className="text-3xl font-bold text-orange-500 mb-1">{totalItems}</div>
                        <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
                        <div className="text-3xl font-bold text-green-500 mb-1">{completedItems}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
                        <div className="text-3xl font-bold text-blue-500 mb-1">{pendingItems}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                </div>

                {/* Progress Bar */}
                {totalItems > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-bold text-orange-500">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </button>

                    {completedItems > 0 && (
                        <button
                            onClick={handleClearCompleted}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                        >
                            <Trash2 className="w-5 h-5" />
                            Clear Completed ({completedItems})
                        </button>
                    )}
                </div>

                {/* Add Item Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-orange-200">
                        <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                            Add New Item
                        </h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="e.g., Tomatoes"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={newItemQuantity}
                                        onChange={(e) => setNewItemQuantity(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit
                                    </label>
                                    <select
                                        value={newItemUnit}
                                        onChange={(e) => setNewItemUnit(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        {commonUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Add to List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewItemName('');
                                        setNewItemQuantity('1');
                                        setNewItemUnit('pcs');
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Shopping List Items */}
                <div className="bg-white rounded-lg shadow-lg border border-orange-100">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            Loading shopping list...
                        </div>
                    ) : safeItems.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Your shopping list is empty</p>
                            <p className="text-gray-400 text-sm mb-6">
                                Add items manually or visit recipe pages to add missing ingredients
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Item
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {safeItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-orange-50 transition-colors ${item.checked ? 'opacity-60' : ''
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggleItem(item.id)}
                                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${item.checked
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-300 hover:border-orange-500'
                                            }`}
                                    >
                                        {item.checked && <Check className="w-4 h-4 text-white" />}
                                    </button>

                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {item.name}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {item.quantity} {item.unit}
                                            {item.recipeName && (
                                                <span className="ml-2 text-orange-600">
                                                    • from {item.recipeName}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Delete item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
                        💡 Pro Tips
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Visit recipe detail pages to automatically add missing ingredients</li>
                        <li>• Check off items as you shop to track your progress</li>
                        <li>• Clear completed items to keep your list organized</li>
                        <li>• Your shopping list is saved automatically</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}