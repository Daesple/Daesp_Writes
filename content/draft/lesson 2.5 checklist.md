Chào bạn! Việc làm quen với toàn bộ giao diện và cơ chế cốt lõi của công cụ thông qua một dự án thử nghiệm là bước chuẩn bị vô cùng quan trọng trước khi chúng ta thiết kế trò chơi chính thức. Dưới đây là **checklist chi tiết từng bước thao tác cụ thể** được chuyển đổi trực tiếp từ nội dung bài học **[2.5] Engine Tour** để bạn dễ dàng thực hành theo đúng trình tự:

### I. Cấu hình Cơ sở dữ liệu (Database Setup)

- [x] Vào [Database -> Actors] → làm [Tăng số lượng nhân vật tối đa bằng cách nhấp vào Change Maximum]. 
- [x] Vào [Database -> Actors] → làm [Nhập tên nhân vật tại ô Name là Pizza Man, đặt biệt danh Nickname là Piz và chỉnh Class thành Average Joe]. 
- [x] Vào [Database -> Actors] → làm [Viết nội dung mô tả cốt truyện ngắn tại ô Profile để làm văn bản hương vị cho Pizza Man]. 
- [x] Vào [Database -> Actors] → làm [Chọn hình ảnh đại diện khuôn mặt Face và ảnh di chuyển Character phù hợp với nhân vật]. 
- [x] Vào [Database -> Classes] → làm [Thay đổi tên Class số 1 thành Average Joe]. [ ] Vào [Database -> Classes] → làm [Nhấp đúp vào Max MP để đổi tên hiển thị năng lượng thành thanh thể lực Max Stamina hoặc Stamina]. 
- [x] Vào [Database -> Skills] → làm [Tạo một kỹ năng Heal, chọn biểu tượng Icon, đặt MP Cost, đặt Scope là One Ally và chỉnh Occasion thành Menu Screen Only để dùng ngoài trận chiến]. 
- [x] Vào [Database -> Items] → làm [Tạo vật phẩm mới tên là Key tại ô Name, chỉnh Item Type thành regular item, đặt Consumable thành No và chỉnh Occasion thành Never]. 
- [x] Vào [Database -> Tilesets] → làm [Tăng số bộ tối đa và tạo bộ Tileset mới tên là Theody bằng cách sao chép từ bộ SF Outside có sẵn]. 
- [x] Vào [Database -> Tilesets] → làm [Nhấp chọn ô D và tải tài nguyên Tileset Outside B vào ô này để gộp hai bộ lại với nhau]. 
- [x] Vào [Database -> Tilesets -> Passage] → làm [Nhấp chọn biểu tượng O hoặc X để thiết lập cho phép hoặc chặn người chơi đi qua các ô cây cối]. 
- [x] Vào [Database -> Tilesets -> Passage (4-dir)] → làm [Nhấp chuột để chặn hướng di chuyển sang trái và phải trên các ô thang]. 
- [x] Vào [Database -> Tilesets -> Ladder] → làm [Nhấp chọn các ô thang để nhân vật tự động quay lưng lại phía người chơi khi đang leo thang]. 
- [x] Vào [Database -> Tilesets -> Bush] → làm [Nhấp chọn các ô cỏ rậm rạp để tự động làm mờ và trộn chân nhân vật khi đi vào cỏ]. 
- [x] Vào [Database -> Tilesets -> Counter] → làm [Nhấp chọn các ô quầy kệ hoặc bàn để cho phép người chơi kích hoạt tương tác với vật thể xuyên qua bàn]. 
- [ ] Vào [Database -> Tilesets -> Terrain Tag] → làm [Gán thẻ Terrain Tag số 1 cho các ô cỏ để làm cơ sở phát âm thanh bước chân phù hợp khi di chuyển]. 
- [ ] Vào [Database -> System -> Starting Party] → làm [Chọn toàn bộ các nhân vật mặc định ban đầu rồi nhấn Delete để xóa sạch, sau đó nhấn đúp hoặc nhấn Enter để thêm Pizza Man làm nhân vật xuất phát]. 
- [ ] Vào [Database -> System -> Window Color] → làm [Thay đổi tông màu của hộp thoại hệ thống sang màu đỏ hoặc màu tùy chỉnh]. 
- [ ] Vào [Database -> Terms] → làm [Đổi tên Max MP thành stamina hoặc đổi tên lệnh chiến đấu Attack mặc định thành slap].

### II. Cấu hình Bản đồ & Giao diện biên tập (Map & Editor Setup)

- [ ] Vào [cần tự mò trong engine] → làm [Nhấp chuột phải vào tên bản đồ ở cột bên trái màn hình, chọn Edit để chỉnh sửa Name, tên hiển thị Display Name, bộ Tileset, kích thước bản đồ, vô hiệu hóa nút chạy nhanh Disable Dashing hoặc cài đặt ảnh nền Parallax]. 
- [ ] Vào [cần tự mò trong engine] → làm [Chuyển sang chế độ vẽ bản đồ Map Mode và sử dụng các công cụ Paintbrush, Circle, Square hoặc Shadow Brush để vẽ bóng đổ thủ công]. 
- [ ] Vào [Tools -> Options] → làm [Thay đổi giao diện biên tập sang giao diện tối UI Theme Dark để bảo vệ mắt và cấu hình dòng lưới Map Grid].

### III. Thiết lập Trang sự kiện trên Bản đồ (Event Page Setup)

- [ ] Vào [cần tự mò trong engine] → làm [Nhấp đúp chuột vào một ô vuông bất kỳ trên bản đồ hoặc nhấn Enter để mở bảng thiết lập Sự kiện (Event Page)]. 
- [ ] Vào [Event Page] → làm [Đặt tên cho sự kiện tại ô Name và ghi chú tại ô Notes]. 
- [ ] Vào [Event Page -> Conditions] → làm [Thiết lập điều kiện xuất hiện của sự kiện thông qua Switch, Variable, Self-Switch, Item hoặc Actor Pizza Man]. 
- [ ] Vào [Event Page -> Image] → làm [Nhấp chuột để chọn hình ảnh đồ họa đại diện cho sự kiện từ tài nguyên mặc định hoặc từ Tileset bản đồ]. 
- [ ] Vào [Event Page -> Options] → làm [Tích chọn các tùy chọn hoạt ảnh chuyển động gồm Walking animation, Stepping animation, Direction Fix hoặc Through]. 
- [ ] Vào [Event Page -> Autonomous Movement] → làm [Nhấp vào menu thả xuống chọn kiểu di chuyển tự động gồm Fixed, Random, Approach hoặc Custom]. 
- [ ] Vào [Event Page -> Autonomous Movement -> Custom -> Route] → làm [Lập trình lộ trình di chuyển tùy chỉnh bằng các nút đi xuống, nhảy tọa độ trục X/Y qua giá trị offset, xoay hướng, phát âm thanh hoặc bật/tắt công tắc]. 
- [ ] Vào [Event Page -> Speed / Frequency] → làm [Chọn tốc độ Speed và tần suất di chuyển Frequency của sự kiện]. 
- [ ] Vào [Event Page -> Priority] → làm [Chọn độ ưu tiên hiển thị gồm Below characters, Same as characters hoặc Above characters]. 
- [ ] Vào [Event Page -> Trigger] → làm [Chọn cách kích hoạt sự kiện gồm Action Button, Player Touch, Event Touch, Autorun hoặc Parallel Process]. 
- [ ] Vào [Event Page] → làm [Chọn New Event Page để thêm trang sự kiện mới hoặc chọn Delete Event Page để xóa bớt trang].

### IV. Các câu lệnh Sự kiện cốt lõi (Event Commands - Tab 1)

- [ ] Vào [Event Commands -> Show Text] → làm [Nhập đoạn hội thoại của chú chó: "Woof. I woof a lot. \N" kèm cài đặt ảnh khuôn mặt và chế độ hiển thị Dim/Transparent]. 
- [ ] Vào [Event Commands -> Show Choices] → làm [Tạo các lựa chọn rẽ nhánh Yes/No, đổi hình nền hộp lựa chọn và đặt tùy chọn mặc định hoặc hủy bỏ]. 
- [ ] Vào [Event Commands -> Input Numbers] → làm [Thiết lập yêu cầu người chơi nhập mật mã 3 chữ số và lưu kết quả vào biến temp X]. 
- [ ] Vào [Event Commands -> Show Scrolling Text] → làm [Nhập đoạn văn bản cuộn credits tự đóng kèm cài đặt tốc độ và tích chọn No Fast Forward]. 
- [ ] Vào [Event Commands -> Control Switches] → làm [Bật hoặc tắt một công tắc đơn lẻ hoặc một dãy công tắc theo phạm vi mong muốn]. 
- [ ] Vào [Event Commands -> Control Variables] → làm [Thực hiện các phép toán gán Set, cộng Add, trừ Sub, nhân Mult, chia Div, chia lấy dư Mod cho biến số thông qua hằng số, biến số khác, dữ liệu trò chơi Game Data hoặc đoạn mã Script]. 
- [ ] Vào [Event Commands -> Control Self-Switch] → làm [Bật hoặc tắt công tắc nội bộ tự chọn của riêng sự kiện đó (A, B, C, D)]. 
- [ ] Vào [Event Commands -> Control Timer] → làm [Thiết lập bộ đếm thời gian đếm ngược hiển thị công khai trên màn hình]. 
- [ ] Vào [Event Commands -> Conditional Branch] → làm [Tạo nhánh rẽ điều kiện dựa trên trạng thái của Switch, Variable, Self-Switch, Timer, Actor, hướng nhân vật, nút bấm được nhấn hoặc đoạn mã Script]. 
- [ ] Vào [Event Commands -> Loop] → làm [Tạo vòng lặp vô hạn và chèn câu lệnh Break Loop bên trong để thoát khỏi vòng lặp khi thỏa mãn điều kiện]. 
- [ ] Vào [Event Commands -> Exit Event Processing] → làm [Chèn lệnh chấm dứt mọi tiến trình xử lý sự kiện tiếp theo ngay lập tức]. 
- [ ] Vào [Event Commands -> Common Event] → làm [Gọi một Sự kiện chung có sẵn trong thư viện trò chơi để sử dụng lại code]. 
- [ ] Vào [Event Commands -> Label] → làm [Tạo nhãn Label tên burritos và dùng Jump to Label để điều hướng luồng sự kiện về nhãn đó]. 
- [ ] Vào [Event Commands -> Comment] → làm [Ghi chú thích ghi nhớ trong tiến trình sự kiện để dễ quản lý luồng code dài].

### V. Các câu lệnh Sự kiện nâng cao (Event Commands - Tab 2)

- [ ] Vào [Event Commands -> Transfer Player] → làm [Thiết lập dịch chuyển người chơi tới tọa độ bản đồ mong muốn, chọn hướng xuất phát và hiệu ứng mờ dần Fade]. 
- [ ] Vào [Event Commands -> Set Vehicle Location] → làm [Thiết lập vị trí của phương tiện di chuyển trên bản đồ]. 
- [ ] Vào [Event Commands -> Set Event Location] → làm [Dịch chuyển một sự kiện cụ thể tới tọa độ mong muốn trên bản đồ hiện tại]. 
- [ ] Vào [Event Commands -> Scroll Map] → làm [Đặt hướng cuộn bản đồ, khoảng cách cuộn và tốc độ cuộn màn hình b-roll]. 
- [ ] Vào [Event Commands -> Set Movement Route] → làm [Chọn đối tượng di chuyển cụ thể, nhập lộ trình chuyển động, tích chọn Skip if cannot move hoặc Wait for completion]. 
- [ ] Vào [Event Commands -> Change Transparency] → làm [Bật hoặc tắt tính năng ẩn hình nhân vật chính]. 
- [ ] Vào [Event Commands -> Change Player Followers] → làm [Bật hoặc tắt việc các thành viên trong đội đi nối đuôi nhau theo sau]. 
- [ ] Vào [Event Commands -> Gather Followers] → làm [Dịch chuyển toàn bộ thành viên đi sau về một điểm trùng với nhân vật chính]. 
- [ ] Vào [Event Commands -> Show Animation] → làm [Phát một hiệu ứng hoạt ảnh có sẵn trên một sự kiện hoặc trên người chơi]. 
- [ ] Vào [Event Commands -> Show Balloon Icon] → làm [Hiển thị biểu tượng cảm xúc bong bóng như dấu chấm hỏi hoặc dấu chấm than trên đầu sự kiện]. 
- [ ] Vào [Event Commands -> Erase Event] → làm [Xóa tạm thời sự kiện trên bản đồ hiện tại cho đến khi người chơi tải lại bản đồ]. 
- [ ] Vào [Event Commands -> Show Picture] → làm [Hiển thị một bức ảnh lên màn hình theo số ID, điều chỉnh tọa độ pixel, độ mờ Opacity và chế độ Blend]. 
- [ ] Vào [Event Commands -> Move Picture] → làm [Di chuyển bức ảnh hiển thị kèm hiệu ứng biến đổi trong khoảng thời gian tùy chọn]. 
- [ ] Vào [Event Commands -> Rotate Picture] → làm [Xoay tròn bức ảnh 360 độ theo tốc độ chọn]. [ ] Vào [Event Commands -> Tint Picture] → làm [Thay đổi tông màu của bức ảnh theo ID]. 
- [ ] Vào [Event Commands -> Erase Picture] → làm [Xóa bức ảnh trên màn hình theo ID tương ứng]. [ ] Vào [Event Commands -> Wait] → làm [Đặt khoảng thời gian chờ tính bằng khung hình (60 frames = 1 giây)]. 
- [ ] Vào [Event Commands -> Tint Screen] → làm [Thay đổi tông màu màn hình ban đêm/ban ngày, chỉnh thời gian chuyển tiếp và chờ hoàn thành]. 
- [ ] Vào [Event Commands -> Flash Screen] → làm [Nháy sáng màn hình theo màu sắc, tần suất và thời gian chọn]. 
- [ ] Vào [Event Commands -> Shake Screen] → làm [Rung lắc màn hình theo mức độ Power, tốc độ Speed và thời gian]. 
- [ ] Vào [Event Commands -> Set Weather Effect] → làm [Tạo hiệu ứng thời tiết như mưa, tuyết, bão kèm thời lượng]. 
- [ ] Vào [Event Commands -> Play BGM / Fade Out BGM / Save BGM / Replay BGM] → làm [Phát nhạc nền, chỉnh âm lượng/tốc độ pitch, làm nhỏ dần nhạc, lưu vị trí nhạc đang phát hoặc phát tiếp tục]. 
- [ ] Vào [Event Commands -> Play BGS / Fade Out BGS] → làm [Phát hoặc làm nhỏ dần âm thanh môi trường như tiếng thành phố]. 
- [ ] Vào [Event Commands -> Play ME] → làm [Phát hiệu ứng nhạc hệ thống]. 
- [ ] Vào [Event Commands -> Play SE / Stop SE] → làm [Phát các âm thanh ngắn đè lên nhau hoặc tắt toàn bộ âm thanh đang phát]. 
- [ ] Vào [Event Commands -> Play Movie] → làm [Phát một đoạn phim ngắn theo định dạng được hỗ trợ].

### VI. Các mẹo thao tác nhanh & Khắc phục lỗi (Tips & Shortcuts)

- [ ] Vào [cần tự mò trong engine] → làm [Mở thư mục trò chơi bằng tùy chọn Game -> Open Folder để thêm tài nguyên JavaScript hoặc Plugins thủ công]. 
- [ ] [ ] Vào [cần tự mò trong engine] → làm [Sử dụng phím tắt Ctrl + S để lưu nhanh dự án và Ctrl + R để bắt đầu chơi thử trò chơi ngay lập tức]. 
- [ ] [ ] Vào [cần tự mò trong engine] → làm [Nhấn giữ phím Ctrl khi đang chơi thử (Playtest) để kích hoạt chế độ đi xuyên tường giúp nhảy nhanh qua các sự kiện dài].

---

Chúc bạn có một buổi làm quen công cụ thật trực quan và thú vị!

🧩 Bạn có muốn tôi chuẩn bị trước phần hướng dẫn viết mã sự kiện (eventing) cho phần mở đầu của game (bài 4 - Opening Cutscenes) để sau khi làm quen xong công cụ, bạn có thể bắt tay ngay vào dựng các hoạt cảnh đầu tiên không?