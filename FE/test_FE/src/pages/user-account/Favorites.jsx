import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userAccountService from "../../services/userAccountService";
import Pagination from "../../components/user-account/Pagination";
import "../../assets/styles/user-account/Favorites.css";

const Favorites = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 9 phim mỗi trang (3x3 grid)

  const queryClient = useQueryClient();
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["user-favorites"],
    queryFn: () => userAccountService.getFavorites(),
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const paginatedFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return favorites.slice(startIndex, endIndex);
  }, [favorites, currentPage, itemsPerPage]);

  const removeFavoriteMutation = useMutation({
    mutationFn: (movieId) => userAccountService.removeFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-favorites"]);
    },
  });

  const handleRemoveFavorite = (movieId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa phim này khỏi danh sách yêu thích?"
      )
    ) {
      removeFavoriteMutation.mutate(movieId);
    }
  };

  if (isLoading) {
    return (
      <div className="favorites-page">
        <h1>Phim yêu thích</h1>
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Phim yêu thích</h1>
        <div className="favorites-count">{favorites.length} phim</div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-heart"></i>
          <p>Bạn chưa có phim yêu thích nào</p>
          <button className="btn btn-primary">Khám phá phim</button>
        </div>
      ) : (
        <>
          <div className="favorites-grid">
            {paginatedFavorites.map((movie) => (
              <div key={movie.id} className="favorite-card">
                <div className="favorite-card-image">
                  <img src={movie.poster} alt={movie.title} />
                  <button
                    className="favorite-remove-btn"
                    onClick={() => handleRemoveFavorite(movie.id)}
                    title="Xóa khỏi yêu thích"
                  >
                    <i className="bx bxs-heart"></i>
                  </button>
                </div>
                <div className="favorite-card-content">
                  <h3>{movie.title}</h3>
                  <div className="favorite-card-meta">
                    <span className="rating">
                      <i className="bx bx-star"></i> {movie.rating}
                    </span>
                    <span className="genre">{movie.genre}</span>
                  </div>
                  <p className="favorite-card-description">
                    {movie.description}
                  </p>
                  <button className="btn btn-primary btn-sm">Đặt vé</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
