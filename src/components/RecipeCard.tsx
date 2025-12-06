// File: src/components/RecipeCard.tsx
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { Clock, Star, ChefHat, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/client';
// 1. Import hook chuyển trang
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    initialLiked?: boolean;
    showStatus?: boolean; // Prop để kiểm soát việc hiện trạng thái (Approved/Rejected)
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    onClick,
    initialLiked = false,
    showStatus = false // Mặc định ẩn
}) => {
    const { user } = useAuth();
    // 2. Khởi tạo hook navigate
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFavorite(initialLiked);
    }, [initialLiked]);

    // Xử lý logic Thả tim (Yêu thích)
    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn không cho click lan ra ngoài (tránh mở chi tiết món)
        if (!user) {
            alert("Vui lòng đăng nhập để lưu món ăn!");
            return;
        }
        setLoading(true);
        try {
            const userId = user._id || user.id;
            if (isFavorite) {
                await userAPI.removeFavorite(userId, recipe._id);
                setIsFavorite(false);
            } else {
                await userAPI.addFavorite(userId, recipe._id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật yêu thích:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Xử lý logic click vào thẻ Cuisine (MỚI)
    const handleCuisineClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // QUAN TRỌNG: Ngăn không mở trang chi tiết món ăn
        // Chuyển về trang chủ và kèm theo tham số lọc cuisine
        navigate(`/?cuisine=${recipe.cuisine}`);
    };

    // Helper: Lấy màu nền cho trạng thái
    const getStatusStyle = (status?: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500 text-white';
            case 'rejected': return 'bg-red-500 text-white';
            default: return 'bg-yellow-400 text-white'; // Pending
        }
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 relative"
        >
            {/* Phần Hình ảnh */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                    src={recipe.image && recipe.image.startsWith('http') ? recipe.image : 'https://placehold.co/600x400?text=Yummy'}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Lớp phủ đen mờ khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Badge trạng thái (Góc trái trên) */}
                {showStatus && recipe.status && (
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm z-10 ${getStatusStyle(recipe.status)}`}>
                        {recipe.status}
                    </div>
                )}

                {/* Nút Tim (Góc phải trên) */}
                <button
                    onClick={handleToggleFavorite}
                    disabled={loading}
                    className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-sm hover:bg-white transition-all active:scale-90 z-10"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-500'
                            }`}
                    />
                </button>

                {/* Rating (Góc trái dưới) */}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-white">{recipe.rating || 0}</span>
                </div>
            </div>

            {/* Phần Thông tin chi tiết */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.time} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ChefHat className="w-4 h-4" />
                        <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* 4. Thẻ Cuisine đã được sửa thành nút bấm */}
                    <span
                        onClick={handleCuisineClick}
                        className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-colors cursor-pointer z-20"
                        title={`Xem thêm các món ${recipe.cuisine}`}
                    >
                        {recipe.cuisine}
                    </span>

                    <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        {recipe.mealType}
                    </span>
                </div>
            </div>
        </div>
    );
};