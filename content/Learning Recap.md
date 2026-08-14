
# Resource
- [RPG Maker MV Beginner Tutorials](https://www.youtube.com/playlist?list=PLMcr1s5MjsiTky6KB4ML-q_QoBE_ZYJk5)
- [RMMV How to Make a Horror Puzzle Game](https://www.youtube.com/playlist?list=PLmqD_CN4-c_t7UCXj3c2YoaJw2mGqnluk)
- [How I got watercolor paintings into RPG Maker MV - Devlog #3](https://www.youtube.com/watch?v=mdIEMHsxM10)
- [RPG Maker Custom Assets Tutorials](https://www.youtube.com/playlist?list=PLxSSrLcPTihdS619hWRTMMGWmANGfWPWa)

# Final Report
- Read the introduce about RPG Maker at: [RM: The Unexpected Stage](https://docs.google.com/document/d/15-tF9PpV5zjyVZhHLTcwYJzH3VKtbJR8l_oec2wm-0I/edit?usp=sharing)
- Read the outline and WIP version of the Final Report at [[How I Made My First RM MVP Game]]

---

### PHẦN 1: LÀM QUEN CƠ BẢN

*Mục tiêu: Biết vẽ map, tạo nhân vật, cho họ nói chuyện và di chuyển cơ bản.*

1. **SomeRanDev - Tut #1: Drawing The Map!:** Tạo Project, vọc Tileset và vẽ bản đồ. 
	- **Did:** Vẽ map đầu tiên bằng các map editor và tileset sẵn có của RPG Maker![[assets/Pasted image 20260808153735.png]]<p align="center"><i>*Bùa nhanh 2 phút*</i></p>
	- **The Opinionated engine:** Hệ thống tilesets đa dạng, làm sẵn, tự động hóa, dễ dùng. Nhanh gọn nhưng bị gò bó (không hẳn là điểm trừ vì nó chỉ bị gò bó khi đang muốn làm những thể loại game khác, góc nhìn khác, còn với JRPG thì không có gì để chê)
	- **Cons:** Mới đầu hơi overwhelm![[assets/Pasted image 20260808154252.png]]
	- **Final Report:** Nguyên liệu cho [[Map Editor Evaluation]]  ^891d1b

2. **SomeRanDev - Tut #2: Creating an NPC!**: Tạo sự kiện, dùng lệnh _Show Text_ cho nhân vật nói chuyện. ^0156e2
	- **Did:** Tạo một NPC bằng event, tạo tương tác dialogue đơn giản![[assets/PixPin_2026-08-08_16-07-50.webp]]
	- **Pros:** Mới vọc vạch làm quen nên chưa rõ, nhưng thấy làm quen cũng nhanh. Nếu quen rồi chắc có thể làm được nhiều thứ hay ho với các Event commands này.
	- **Cons:** Dễ lọt hố và overwhelm (like me in this whole week - i try to learn all the commands 😭). Và liệu nó có thể custom được đến đâu? hay chỉ bị giới hạn trong những command cho trước (hình như có thể dùng script và plugin trong đây, nhưng chưa xem tới)![[assets/Pasted image 20260808161115.png]]
	![[assets/Pasted image 20260808161828.png]]

	 - **Final report:** Nguyên liệu cho [[Event-Driven Design in RMMV]]

3. **SomeRanDev - Tut #3: Moving to other Maps!**: Học cách làm sự kiện truyền tống (Transfer Player) để đi từ map này sang map khác. ^4022be
	-  **Did:** Tạp map mới "Làng Tân Thủ", và thiết lập sự kiện transfer qua lại.![[assets/Pasted image 20260808171549.png]]
		![[assets/PixPin_2026-08-08_17-17-27.webp]]
		![[assets/Pasted image 20260808174316.png]]
	
	- **Cons:** Tạo transfer event thủ công thì không có SE (Sound effect), còn dùng rightclick -> QuickEvent Creation -> Transfer player thì lại có SE. Ở địa hình không same level với character (Đồi núi, không thể bước đè lên được, thì phải nhớ chuyển Priority của địa hình đó sang "Same as characters" và chuyển Trigger từ "Player touch" sang "Action Button")
	- **Final report:** Nguyên liệu cho [[Event-Driven Design in RMMV]]

4. **SomeRanDev - Tut #4: Making NPCs Move!**: Học cách cho nhân vật tự động di chuyển quanh map (Random, Approach, Custom).
	- **Did:** Thiết lập di chuyển tự động (Autonomous Movement) cho NPC theo các chế độ tự động (random, Approach), chế độ tùy chỉnh cũng tương tự nhưng do không gian map hẹp nên chưa đụng tới. ![[assets/PixPin_2026-08-08_18-15-33.webp]]
		![[assets/Pasted image 20260808182110.png]]
		![[assets/Pasted image 20260808182151.png]]
		![[assets/Pasted image 20260808182320.png]]
	- **Pros:** Bắt đầu thổi hồn vào map, có sức sống hơn, không cần code phức tạp vẫn làm được
	- **Cons:** -
	- **Final Report:** [[Event-Driven Design in RMMV]] 

5. **SomeRanDev - Tut #5: Building a Door!**: Làm một cánh cửa hoàn chỉnh.
	- **Did:** Tạo sub map "Lang_Tan_Thu-Room_one". Tạo event "Door" để chuyển từ map làng tân thủ sang sub map đó.![[assets/PixPin_2026-08-13_20-39-22.webp]]
	- **Pros:** Hệ thống map được xây dựng như các folder -> giúp dễ quản lý khi project scale to ra (vd trong mỗi map lại có hàng chục map con)
		![[assets/Pasted image 20260813204233.png]]
	- **Cons:** có 2 loại cửa / gạch nền, tròn và vuông, cần phải để ý để khi tạo door match tụi nó với nhau.
	  ![[assets/Pasted image 20260813214705.png]]
	- **Final Report:** [[content/RMMV_Documentary/1. Design_Reflection/Map Editor Evaluation|Map Editor Evaluation]]

---

### PHẦN 2: THIẾT KẾ CỐT TRUYỆN KINH DỊ

*Mục tiêu: Hiểu tư duy làm game kinh dị giải đố trước khi lập trình.*
- Tài liệu tham khảo:
	- [Horror That Lingers](https://www.youtube.com/watch?v=vSKtTBjSBg0)
	- [What Makes a Good Horror Game?](https://www.youtube.com/watch?v=Gb2qKP5YDFU)
	- [3 Major Elements to any Good Horror Game](https://www.youtube.com/watch?v=aO4fKS_6pls)

6. **TheOdie - Bài 2 (What is Horror?)**: 
   - **Sự khác biệt giữa Kinh dị hình ảnh và Kinh dị tâm lý:**
	- **Kinh dị hình ảnh/hành động** tập trung vào yếu tố đồ họa, máu me, vũ khí,... điểm yếu là khi trải nghiệm chơi kết thúc, người chơi quay lại thế giới thực và lập tức cảm thấy an toàn.
	- **Kinh dị tâm lý** đánh sâu vào tâm trí, khiến người chơi liên tục suy nghĩ và cảm giác sợ hãi sẽ bám theo họ ngay cả khi đã thoát game. Thể loại này dựa nhiều và **the uncanny** từ những chi tiết nhỏ nhặt có thể xảy ra trong đời thực.

- **Nỗi sợ chủ quan**
	- Bị chi phối bởi **văn hóa** và **độ tuổi**.
	-  Để thực sự làm ai đó sợ hãi, cần khai thác vào những nỗi sợ thời thơ ấu mà player tưởng đã quên, hoặc tác động vào nỗi sợ cá nhân. **Vì thế sẽ không thể tạo ra một tựa game dọa được tất cả mọi người, mà phải nhắm vào một tệp khán giả cụ thể.** 

- **3 Yếu tố của một game kinh dị tốt**
	1. Nhịp độ chậm và có tính toán (Slow Pacing)
		- Tạo ra sự bất an thông qua việc kéo dài trạng thái chờ đợi.
		- Nỗi lo âu sẽ được khuyếch đại khi tâm trí người chơi tự lấp đầy những khoảng trống của sự chờ đợi bằng những kịch bản tồi tệ họ tự tưởng tượng.
	2. Thiết kế không gian gây ngột ngạt
		- Thiết kế không gian hẹp tác động đến cảm xúc người chơi thông qua 3 cơ chế:
			- **Giới hạn khả năng di chuyển:** loại bỏ không gian né tránh, make us feel that we're not in control.
			- **Ép buộc đối mặt** Trong những hành lang dài, người chơi không thể đi vòng qua mối nguy hiểm; họ buộc phải đối diện trực tiếp với nỗi sợ
			- **Make the monster seem bigger and stand out** 
	3. Cách sử dụng ánh sáng/bóng tối
		- Ánh sáng là công cụ tốt nhất để khai thác **The fear of the Unknown.** Khi tầm nhìn bị hạn chế, não phải nỗ lực  giải mã những hình khối mập mờ trong bóng tối, từ đó tạo ra cảm giác lo âu liên tục.
			- 

- **Tại sao RPG maker kinh dị lại chọn Puzzle thay vì Combat/Action?
	- Bản chất RPG là game nhập vai, thế mạnh nằm ở xây dựng thế giới và nhân vật để người chơi đồng cảm, **Nhân vật sợ hãi điều gì thì người chơi cũng sợ hãi điều đó**
	- Nếu chọn cơ chế Combat, nhân vật sẽ mạnh lên nhờ Level up, điều này có thể tiêu diệt nổi sợ của player vì nó sẽ khiến họ tin rằng rồi họ sẽ đủ sức đánh bại thế lực đáng sợ đó.
	- Ở Puzzles, thay vì chiến đấu, game designer có thể giấu cốt truyện vào các câu đố, giúp định hình nhân vật, bối cảnh, câu chuyện một cách tự nhiên.

6. **TheOdie - Bài 3 (Files and Overview)**: Đọc cốt truyện của Jake và Eric. Tải template game để chuẩn bị thực hành.
- 

---

### PHẦN 3: LÀM CẢNH CẮT MỞ ĐẦU (OPENING CUTSCENE)

_Mục tiêu: Làm phân cảnh xe buýt học sinh đỗ, học sinh xuống xe mượt mà._

8. **SomeRanDev - Tut #18: Autorun Events!**: Hiểu cơ chế sự kiện tự động chạy và khóa điều khiển của người chơi.
9. **SomeRanDev - Tut #19: Movement Routing!**: Học cách lập trình đường đi ép buộc cho vật thể.
10. **TheOdie - Bài 4 (Opening Cutscenes with Credits)**: Áp dụng để tự dựng cảnh xe buýt đỗ, học sinh đi vào trường và chạy chữ giới thiệu bối cảnh năm 1991.

---

### PHẦN 4: HỘI THOẠI NÂNG CAO & CÔNG TẮC/BIẾN SỐ CỐT LÕI

_Mục tiêu: Viết thoại đổi màu chữ, khóa chuyển động của Eric bằng vòng lặp._

11. **SomeRanDev - Tut #15: Switches!**: Học cách dùng công tắc bật/tắt để thay đổi trạng thái thế giới game.
12. **SomeRanDev - Tut #16: Variables!**: Học cách dùng biến số lưu trữ tính toán.
13. **SomeRanDev - Tut #28: Loops**: Học cách tạo vòng lặp vô hạn và cách dùng lệnh _Break Loop_ để thoát ra.
14. **TheOdie - Bài 5 (Learning Dialogue)**: Lập trình cảnh lớp học. Học viết mã màu chữ `\c[n]` và dùng vòng lặp ngầm so sánh tọa độ X, Y để khóa Eric di chuyển đúng vị trí mới cho nói chuyện.

---

### PHẦN 5: CHUỖI CÂU ĐỐ TÌM ĐỒ ĐẦU TIÊN (FETCH QUEST)

_Mục tiêu: Nhặt đá đập khóa nhà kho, lấy xẻng đào xà báng để dịch chuyển hộp gỗ._

15. **SomeRanDev - Tut #17: Self-Switches!**: Học cách dùng công tắc nội bộ để vật phẩm sau khi nhặt sẽ tự biến mất (tránh nhặt vô hạn).
16. **SomeRanDev - Tut #10: Skills & Items!** & **Tut #11: Distributing Skills/Items**: Cách tạo vật phẩm chìa khóa và phân phát nó vào kho đồ người chơi.
17. **TheOdie - Bài 6 (Search Fetch Quest Puzzle)**: Ráp nối logic chuỗi câu đố tìm đồ sau nhà Jake theo tư duy thiết kế ngược.

---

### PHẦN 6: ĐÈN PIN VÀ ĐẨY HỘP (PUSH PUZZLE)

_Mục tiêu: Tạo hệ thống bật/tắt đèn pin toàn game, đẩy hộp gỗ và nhảy qua hộp._

18. **SomeRanDev - Tut #26 & #27: Common Events (Part 1 & 2)**: Hiểu cách viết một đoạn code chạy ngầm toàn game trong Sự kiện chung.
19. **TheOdie - Bài 7 (Flashlight & Push Puzzle)**: Tạo nút bật/tắt đèn pin bằng phím bấm chạy ngầm. Lập trình câu đố đẩy hộp gỗ và hiệu ứng nhảy qua hộp mượt mà.

---

### PHẦN 7: GIẢI MÃ MẬT MÃ CHỮ NỔI (BRAILLE CODE)

_Mục tiêu: Người chơi tự gõ mật mã số để mở cánh cửa phòng tối._

20. **SomeRanDev - Tut #30: Pictures**: Học cách hiển thị hình ảnh lên màn hình (nếu bạn muốn vẽ bảng chữ cái Braille hiển thị trực quan).
21. **TheOdie - Bài 8 (Deciphering Puzzle)**: Sử dụng lệnh _Input Number_ lưu vào biến số. Lập trình Common Event gọi bảng chữ nổi Braille quy đổi sang số thứ tự trong bảng chữ cái tiếng Anh.

---

### PHẦN 8: CUỘC RƯỢT ĐUỔI VÀ KẾT GAME

_Mục tiêu: AI Jake đuổi bắt theo ánh sáng/tiếng động, giấu chìa khóa ngẫu nhiên._

22. **SomeRanDev - Tut #6: The Character Generator**: Tự tạo ngoại hình tùy chỉnh cho nhân vật Eric và Jake nếu thích.
23. **TheOdie - Bài 9 (Final Chase and Closing the Game)**: Lập trình AI đuổi bắt cho Jake dựa vào trạng thái đèn pin và âm thanh bước chân. Sử dụng biến số ngẫu nhiên để giấu chìa khóa thoát hiểm ở 1 trong 5 vị trí mỗi khi chơi lại. Chạy Credits kết game.

---

### PHẦN 9: ĐÁNH BÓNG SẢN PHẨM (PLUGINS & CODE)

_Mục tiêu: Tối giản Menu hệ thống, đổi nút bật đèn pin sang phím F, làm Autosave._

24. **TheOdie - Bài 10 (Remove Submenus and Plugins)**: Can thiệp trực tiếp vào mã nguồn JavaScript để xóa các mục Menu thừa của game RPG. Cài đặt hệ thống ánh sáng quầng sáng thực tế và viết Script tự động lưu game (Autosave).
25. **TheOdie - Bài 11 (What's Next?)**: Xuất bản game lên GameJolt/Itch.io.

---
