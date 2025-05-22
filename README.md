# iDev4rum – IUH Developers Forum

## 📝 About this Project

**iDev4rum** là một diễn đàn chia sẻ kiến thức dành cho sinh viên ngành Công nghệ thông tin, được phát triển trong khuôn khổ môn học *Kiến trúc và Thiết kế phần mềm*. Lấy cảm hứng từ Medium và các nền tảng chia sẻ tri thức, iDev4rum được xây dựng với mục tiêu:

- Tạo không gian chia sẻ bài viết, kinh nghiệm lập trình và công nghệ giữa sinh viên.
- Ứng dụng các mô hình kiến trúc hiện đại như **microservice**, **AI duyệt bài**, **AI kiểm duyệt bình luận**, **Redis caching**, **JWT**, và nhiều công nghệ khác.
- Thực hành phát triển phần mềm theo mô hình **Agile/Scrum**, triển khai thực tế với **CI/CD**, **Docker**, và **Jenkins**.

---

## 👨‍🏫 Lecturer & Team Members

**Lecturers**:
- Hà Thị Kim Thoa  
- Nguyễn Văn Thắng

**Students – iDev4rum Team**:
- Dương Thái Bảo – MSSV: 21037621
- Nguyễn Thành Luân – MSSV: 21123021
- Lê Nguyễn Duy Khang – MSSV: 21063601
- Phan Đình Thái – MSSV: 21038281

**Class**: DHKTPM17B – 420300362103

---

## 🎯 Project Purpose

- Mục đích giáo dục: thực hành xây dựng hệ thống theo kiến trúc Microservices.
- Áp dụng các công nghệ hiện đại trong phát triển ứng dụng web.
- Rèn luyện kỹ năng teamwork, quy trình Agile/Scrum, kỹ thuật DevOps và triển khai hệ thống thực tế.

---

## 🛠️ Technologies & Tools

- **Backend**: Java, Spring Boot, JDBC
- **Database**: Microsoft SQL Server
- **Frontend & UI**: Figma, HTML/CSS/JS
- **IDE & Tools**: Eclipse, Visual Studio Code, Visual Paradigm
- **CI/CD**: GitLab CI/CD, Jenkins
- **Containerization**: Docker, Docker Compose
- **Caching**: Redis (CRUD object + TTL)
- **Security**: JSON Web Token (JWT)
- **Message Queue**: RabbitMQ
- **AI Integration**:
  - AI kiểm duyệt bài viết (OpenAI API)
  - AI kiểm duyệt bình luận
  - AI tìm kiếm thông minh
- **Monitoring**:
  - Rate Limiting Client & Server
  - Retry mechanism (3–5s backoff)

---

## 🏗️ System Architecture

- **API Gateway**: quản lý luồng request giữa client và các microservice.
- **Authentication Service**: xử lý đăng ký, đăng nhập, cấp phát JWT.
- **User Service**: quản lý người dùng, thông tin cá nhân.
- **Post Service**: tạo, cập nhật, duyệt bài viết (có AI).
- **Comment Service**: quản lý comment, kiểm duyệt (AI).
- **Search Service**: tìm kiếm thông minh bằng từ khóa.
- **Notification Service**: gửi thông báo qua RabbitMQ.
- **Redis**: cache user và post.

> 🖼️ Hình ảnh kiến trúc hệ thống có thể tham khảo trong file báo cáo.

---

## 🚀 Deployment & DevOps

- **Docker**: cấu hình đầy đủ cho tất cả microservices.
- **Docker Compose**: tối thiểu 5 service chạy đồng thời.
- **CI/CD with GitLab**: build – test – deploy tự động qua GitLab CI.
- **Jenkins**: cài đặt trên local để chạy pipeline test & build.
- **Agile/Scrum**:
  - Roadmap dự án
  - Spring Planning, Review, Retrospective
  - Role: Product Owner, Scrum Master, Dev Team
- **Online Deployment**: test API hoạt động trên internet (Postman/Swagger).
- **Rate Limiting**:
  - Client: giới hạn 5 request/phút
  - Server: cấu hình giới hạn request ở tầng backend

---

## 📂 Repository & Documents

- **GitLab**: _[Chưa có link – sẽ cập nhật sau]_
- **Google Drive**: _[Đã có tài liệu báo cáo + slide trình bày]_

---

## 📌 Notes for Evaluation (According to Rubric)

| Tiêu chí | Trạng thái |
|---------|------------|
| ✅ Link GitLab | ✔ Có |
| ✅ Google Drive & Slide | ✔ Có |
| ✅ Ảnh hệ thống & mô tả microservice | ✔ Có |
| ✅ JWT hoạt động | ✔ Có |
| ✅ Redis (CRUD đủ 4 phương thức) | ✔ Có |
| ✅ Retry 3–5s | ✔ Có |
| ✅ Rate Limit (client + server) | ✔ Có |
| ✅ Docker >= 5 Service | ✔ Có |
| ✅ Docker Compose hợp lý | ✔ Có |
| ✅ Jenkins cài & chạy | ✔ Có |
| ✅ GitLab CI/CD | ✔ Có |
| ✅ Agile-Scrum đầy đủ | ✔ Có |
| ✅ Triển khai online | ✔ Có |
| ✅ RabbitMQ hoạt động | ✔ Có |

---

## 💡 Future Improvements

- Bổ sung trang quản trị nội dung cho giảng viên hoặc quản trị viên.
- Nâng cấp hệ thống phân tích AI để phân loại bài viết theo lĩnh vực.
- Tích hợp OAuth2 đăng nhập qua Google hoặc Facebook.
- Nâng hiệu năng với Redis clustering và Rate Limit thông minh hơn.

---

## ❤️ Special Thanks

Cảm ơn thầy cô và các bạn đã hỗ trợ nhóm trong suốt quá trình thực hiện dự án này. iDev4rum là sản phẩm xuất phát từ đam mê, và nhóm mong muốn nó sẽ được tiếp tục phát triển để phục vụ cộng đồng sinh viên IUH.

---

