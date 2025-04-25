@echo off
echo ================================================
echo ⚠️  WARNING: TẤT CẢ CONTAINER, IMAGES, VOLUMES
echo ⚠️  SẼ BỊ XOÁ SẠCH. KHÔNG THỂ KHÔI PHỤC LẠI.
echo ================================================
echo.
set /p confirm="Bạn có chắc chắn muốn tiếp tục? (y/n): "

if /i "%confirm%" neq "y" (
    echo ❌ Đã huỷ thao tác. Không xoá gì hết.
    pause
    exit /b
)

echo ===============================
echo 🧹 Cleaning Docker Environment...
echo ===============================

:: Step 1: Down docker-compose, remove volumes and orphans
echo 🔻 Step 1: Stopping containers...
docker-compose down --volumes --remove-orphans

:: Step 2: Prune unused Docker images
echo 🗑️ Step 2: Removing unused Docker images...
docker image prune -a -f

:: Step 3: Prune Docker build cache
echo 🧼 Step 3: Removing build cache...
docker builder prune -f

:: Step 4: Prune unnamed/anonymous volumes
echo 📦 Step 4: Removing unused volumes...
docker volume prune -f

echo ✅ Docker cleanup completed!
pause
