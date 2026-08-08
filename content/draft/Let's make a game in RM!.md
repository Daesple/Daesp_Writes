
#  Objective

- an minimum viable product of a game produced in RPG Maker
    
- a summary of how i used RPG Maker to iterate on da game
    

- The main purpose of the task is just to get your hands dirty with the engine itself, and see how it can aid you from end-to-end (characters, maps, sounds, animation, etc.).
    

- See how the map editor offers an out-of-the-box solution.
    
- See how opinionated the engine is: its RTP, the provided attributes/stats (HP, XP, etc.).
    
- Focus on RPG Maker's Event Command system, which makes the game design intuitive, while keeping the actions that you want in your game composable.
    
- Pay attention to event-driven design: trigger points, reaction, chaining sequences, etc.
    

In other words, the aesthetics or polishing level is not the point of this task. It is to test (1) how quickly you can just spin something out of thin air with RPG Maker, (2) the playability of the outcome.

  [[lesson 2.5 checklist]]

---

# Resources

[[Tut]RMMV How to Make a Horror Puzzle Game - YouTube](https://www.youtube.com/playlist?list=PLmqD_CN4-c_t7UCXj3c2YoaJw2mGqnluk)

[What Makes a Good Horror Game? - Game Exchange](https://www.youtube.com/watch?v=Gb2qKP5YDFU)

[Horror That Lingers - How the Uncanny Instills Fear - Extra Credits](https://www.youtube.com/watch?v=vSKtTBjSBg0)

  
  
  

---

# Course Recap

## What is Horror?

Sự khác biệt giữa Kinh dị hình ảnh và Kinh dị tâm lý:

- Kinh dị hình ảnh/hành động tập trung vào yếu tố đồ họa, máu me, vũ khí,... điểm yếu là khi trải nghiệm chơi kết thúc, người chơi quay lại thế giới thực và lập tức cảm thấy an toàn.
    
- Kinh dị tâm lý/đọng lại đánh sâu hơn vào tâm trí, khiến người chơi liên tục suy nghĩ và cảm giác sợ hãi sẽ bám theo họ ngay cả khi đã thoát game. Thể loại này dựa nhiều vào sự bất an kỳ lạ (the uncanny) từ những chi tiết nhỏ nhặt có thể xảy ra trong đời thực (ánh đèn nhấp nháy, điềm báo, bóng đen,..).
    

  

Nỗi sợ chủ quan

- Bị chi phối bởi văn hóa và độ tuổi.
    
- Để thực sự làm ai đó sợ hãi, cần khai thác vào những nỗi sợ thời thơ ấu mà. player tưởng đã quên, hoặc tác động vào nỗi sợ cá nhân. Vì thế sẽ không thể tạo ra một tựa game dọa được tất cả mọi người, mà phải nhắm vào một tệp khán giả cụ thể.
    

  

Tại sao RPG Maker kinh dị lại chọn Puzzles thay vì Combat/Action?

- Bản chất RPG là game nhập vai, thế mạnh nằm ở xây dựng thế giới và nhân vật để người chơi đồng cảm, Nhân vật sợ hãi điều gì thì người chơi cũng sợ hãi điều đó
    
- Nếu chọn cơ chế Combat, nhân vật sẽ mạnh lên nhờ level up, điều này có thể tiêu diệt nỗi sợ của player vì nó khiến họ tin rằng rồi họ sẽ đủ sức đánh bại thế lực đáng sợ đó.
    
- ở Puzzles, thay vì chiến đấu, game designer có thể giấu cốt truyện vào các câu đố, giúp định hình nhân vật, bối cảnh, câu chuyện một cách tự nhiên.
    

## Engine tour

Database (F9)

- Actors & Class: Quản lý các nhân vật chơi được.
    
- Skills & Item: Tạo các kỹ năng cơ bản và các vật phẩm giải đồ. (Các mục weapon, Armor, Enemies, Troops (nhóm địch) tạm bỏ qua trong thể loại Puzzles này)
    
- Tilesets: Gồm các thuộc tính:
    

- Passage (O/X): Quyết định ô nào người chơi đi qua được, và ô nào bị chặn.
    
- Ladder: Khi trên ô này, nhân vật tự động quay lưng về phía player -> tạo cảm giác leo trèo tự nhiên.
    
- Bush: Làm mờ (giảm opacity) nửa dưới của nhân vật khi đi vào
    
- Counter: Cho phép người chơi tương tác với object
    
- Terrain Tag (Tag địa hình): Gán số để lập trình phát âm thanh bước chân tương ứng khi đi qua.
    
- System & Term: Quản lý âm thanh hệ thống, màu cửa sổ hội thoại, màn hình khởi động, độ trong suốt của nhân vật và đổi tên các thuật ngữ trong game.
    

  

---

  

Event Page

- Conditions: Kiểm tra các yếu tố như Công tắc (Switches), Biến số (Variables), Công tắc nội bộ (Self-Switches), Vật phẩm (Items) hay Nhân vật (Actors) có thỏa mãn hay không thì sự kiện mới xuất hiện trên bản đồ.
    
- Autonomous Movement: Có 4 chế độ: Fixed (đứng yên), Random (Ngẫu nhiên), Approach (Bám theo người chơi) và Custom (Tự lập trình lộ trình di chuyển của sự kiện). Lệnh Jump hoạt động theo cơ chế tọa độ offset x, y từ vị trí hiện tại.
    

  

- Các tùy chọn chuyển động (Options):
    

- Walking Animation
    
- Stepping animation: Nhân vật dậm chân tại chỗ
    
- Direction Fix (Khóa hướng): Ngăn sự kiện đổi hướng quay về phía người chơi khi tương tác
    
- Through: Cho phép người chơi và sự kiện đi xuyên qua nhau.
    

- Priority & Trigger: Độ ưu tiên hiển thị (dưới/bằng/trên nhân vật) và cách kích hoạt sự kiện (Nhấn enter, Chạm vào người chơi, Autorun - tự động chạy và khóa điều khiển, Parallel Process - chạy song song tự do)
    
- Thứ tự ưu tiên của trang sự kiện (Pages): Sự kiện sẽ kiểm tra điều kiện từ trang có số lớn nhất lùi về trang 1. Nó sẽ chạy trang có số lớn nhất thỏa mãn điều kiện và bỏ qua tất cả các trang trước.
    

  

---

Các Event Commands chính (Cho Horror Puzzle game)

- Messages: Câu lệnh show text hỗ trợ các mã code thoại như \V[n] để hiển thị giá trị (Value) của biến số index n, hoặc \N[n] để hiển thị tên của nhân vật index n. Lệnh input numbers để yêu cầu người chơi nhập mật mã số (các câu đố khóa số)
    
- Game Progression & Flow Control: Quản lý Switches, Variables và các câu lệnh điều hướng:
    

- Conditional Branch (nhánh điều kiện):  Chiếm 70-90% các sự kiện để tạo ra các lựa chọn và ngã rẽ cốt truyện
    
- Loop & Break Loop / Label & Jump to Label: Tạo vòng lặp sự kiện và ngắt vòng lặp.
    
- Common Events (sự kiện chung): Thư viện sự kiện công khai trên toàn game, giúp tái sử dụng code và tiết kiệm thời gian.
    

- Tự tạo bộ đếm thời gian ẩn (Custom invisible timer): Thay vì dùng bộ đếm mặc định, có thể kết hợp Loop, Variable - dùng làm bộ đếm cộng dồn và lệnh Wait - với tỉ lệ 60 frames = 1 giây để tạo ra bộ đếm thời gian chạy ngầm.
    
- Screen Effect: Sử dụng tint Screen để thay đổi tông màu (tạo hiệu ứng bóng tối, ban đêm), ngoài ra còn Flash screen, Fade in/out, Shake screen và thời tiết (mưa, bão, tuyết,...)
    
- Audio & Video: Quản lý nhạc nền (BGM, âm thanh môi trường (BGS), hiệu ứng nhạc (ME) và hiệu ứng âm thanh (SE). Cũng có thể edit Volume, Pitch và Pan (độ lệch loa trái/phải)
    

  

---

  

- Các công cụ hỗ trợ khác:
    

- Shadow Brush: Vẽ bóng đổ thủ công
    
- Event Searcher: Hỗ trợ tìm kiếm nhanh vị trí các Switch hoặc Variables trên toàn bộ dự án
    
- Character Generator: Trình tạo và phối đồ họa nhân vật.
    

## Files and Overview

- Cần có Game Documentation ghi lại ý tưởng ban đầu, dùng khi phát triển game, có thể đánh giá các thay đổi là constructive hay destructive.
    
- Nguyên tắc thiết kế cốt truyện: Giữ câu chuyện đơn giản, mục tiêu là phải giải thích được cốt truyện game cho người khác hiểu chỉ trong vòng 5 phút.
    

---

- Hệ thống 4 loại thử thách sẽ xây dựng:
    

Các câu đố cần được thiết kế Tăng dần từ dễ đến khó để tạo độ căng thẳng phù hợp và giữ chân người chơi, tránh là họ ức chế và bỏ game ngay từ đầu.

- Search Fetch Quest (tìm đồ): Dạng câu đố dễ, thông dụng. Tìm vật phẩm cần thiết và mang tới nơi cần sử dụng để mở khóa cốt truyện.
    
- Box Push Puzzles (đẩy hộp): Trực quan hơn, quan sát không gian để mở đường.
    
- Code Decipher (Giải mật mã): Thử thách logic
    
- Chase Sequence (cảnh rượt đuổi): Kinh điển.
    

## Opening Cutscenes with Credits

fix lỗi glitch ở startup screen

- Database -> system, xóa sạch tất cả nhân vật khởi đầu trong party
    
- tạo một map trống không chứa bất kì assets nào (đặt tên “start”)
    
- Thiết lập vị trí bắt đầu của player tại map start này dưới dạng một ô vuông xanh mờ (không có nhân vật hiển thị). Bản đồ này sẽ hoạt động như một loading screen. Đây cũng là nơi để chèn thời gian chờ hoặc các dòng cảnh báo trò chơi (như auto save,...)
    
- tạo sự kiện auto run trên map này để chuyển tiếp người chơi sang bản đồ mở đầu thực tế sau khi thiết lập màn hình đen.
    

  

Setup Master Event

Event này sẽ direct tất cả các hoạt động trên bản đồ. (thường gọi event này là “Start” và đặt ở góc bản đồ để tránh làm vướng các event khác)

- Chạy chữ giới thiệu tự động: Để hiển thị dòng chữ bối cảnh “Summer of 1991”, sử dụng lệnh Show text, tích chọn “Do not wait for input after displaying text” + lệnh Wait (~ 1.5s) để player kịp đọc. Có thể đổi kiểu hộp thoại thành Dim hoặc Transparent.
    
- Quản lý âm thanh
    
- Dịch chuyển và cuộn bản đồ: Thực hiện dịch chuyển ẩn khi màn hình đang đen hoàn toàn. Sau đó, cuộn bản đồ từ từ từ trái sang phải với tốc độ chậm nhất để giới thiệu toàn cảnh ngôi trường. Khi bản đồ bắt đầu cuộn, màn hình sẽ từ từ sáng lại về trạng thái bình thường (tint screen về normal trong 4s)
    

  

Thiết lập xe buýt chở học sinh di chuyển

- Tạo 4 sự kiện học sinh khởi đầu ẩn tại cùng một vị trí của xe buýt.
    
- thiết lập lộ trình di chuyển (Movement route) cho từng học sinh đi xuống xe, rẽ hướng đi vào trường học.
    
- Căn chỉnh thời gian: Không sử dụng tính năng wait for completion khi học sinh di chuyển vì nó sẽ bắt từng người đi hết đường rồi người tiếp theo mới được đi. Thay vào đó, hãy bỏ tích chọn lệnh này và chèn lệnh Wait 30 frames (0.5s) giữa mỗi học sinh để họ xuống xe tuần tự nối đuôi nhau
    
- Khi học sinh chạm tới cửa trường, đổi đồ họa họ sang “None” để tạo hiệu ứng họ đã bước vào trong tòa nhà.
    

  

Sự xuất hiện của nhân vật chính

- Sau khi học sinh vào trường và xe buýt rời đi, hệ thống sẽ chờ khoảng 4s (240 frs) trước khi xuất hiện eric
    
- Eric (lúc này vẫn là một event trên map chứ chưa phải nhân vật do người chơi điều khiển) sẽ đổi đồ họa hiển thị và bước lên 5 bước đến trước cửa trường.
    
- Hiệu ứng mở cửa: Có thể tạo nhanh một sự kiện bằng tính năng Quick Event Creation -> Door, sao chép đoạn mã chuyển động mở/đóng cửa của nó và dán vào Master Event. Eric sẽ bước tới, cửa mở ra, Eric đi vào trong (đổi opacity hoặc chuyển ảnh về none), và cửa tự đóng lại.
    
- nhạc và âm thanh môi trường bắt đầu fade out trong 4s báo hiệu cảnh quay kết thúc để chuyển tiếp sang map lớp học bên trong.
    

  
  
  
  
  
  
  
  

  
  

# The idea

- a horror game, with not so much talking. I would prefer something like self discovery (?) I don't want players to go around and talk to npc to figure things out.
    
- so the BG much create a mood for the game
    
- How can I make it’s horror? i don’t want jump scare
    
- music + a little bit of jumpscare. but i think the main horror is the mental obsession of the character with sth that make audience relate to that horror
    

---

  

- Cốt truyện Game
    

- Bối Cảnh:
    
- Nhân vật chính
    
- Biến cố: