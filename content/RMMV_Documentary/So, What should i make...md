---
title:
description: WIP
tags:
publish: true
---

# Objective

- an minimum viable product of a game produced in RPG Maker
- a summary of how i used RPG Maker to iterate on da game
- The main purpose of the task is just to get your hands dirty with the engine itself, and see how it can aid you from end-to-end (characters, maps, sounds, animation, etc.).
- See how the map editor offers an out-of-the-box solution.
- See how opinionated the engine is: its RTP, the provided attributes/stats (HP, XP, etc.).
- Focus on RPG Maker's Event Command system, which makes the game design intuitive, while keeping the actions that you want in your game composable.
- Pay attention to event-driven design: trigger points, reaction, chaining sequences, etc.

In other words, the aesthetics or polishing level is not the point of this task. It is to test (1) how quickly you can just spin something out of thin air with RPG Maker, (2) the playability of the outcome.

---
# The Idea - "Papilio"

![[Pasted image 20260815194938.png]]
## Concept
### Game ID
- **Bối cảnh:** _Mirroria_ – một thế giới siêu thực được dệt nên từ những mảnh vô thức vụn vỡ của Elya.
- **Nhân vật chính:** **Elya**, cô gái bị khủng hoảng danh tính, luôn đeo chiếc mặt nạ gốm vô cảm và đã quên mất khuôn mặt thật của mình.
- **Phản diện chính:** **Nyx**, cái bóng (Shadow) của Elya, hiện thân của những nỗi sợ và tổn thương bị kìm nén.
- **Mục tiêu tối thượng:** Vượt qua ranh giới vô thức, thu thập các mảnh cánh bướm bản ngã để đối diện, chấp nhận Nyx và hóa thành **Alya** – bản thể tự do

| ![[Pasted image 20260815195133.png\|]] | ![[Pasted image 20260815195415.png]] |
| -------------------------------------- | ------------------------------------ |
| <center>Elya</center>                  | <center>Nyx</center>                 |
### Câu Chuyện

> **Synopsis:** **Elya** thức dậy trong thế giới vô thức *Mirroria*. Cô luôn đeo chiếc mặt nạ gốm vô cảm và không nhớ nổi khuôn mặt thật của mình. Để thoát ra, cô phải đối  mặt với **Nyx** - kẻ luôn đeo bám và biến đổi theo nổi sợ của cô.



**Elya** không nhớ nổi lần cuối cùng nhìn thấy khuôn mặt thật của bản thân. Ba năm nay, kể từ ngày rời khỏi ngôi làng nhỏ ở rìa **Mirroria**, cô đã học được rằng người ta sẽ sống dễ dàng hơn nhiều khi chọn mang đúng chiếc mặt nạ vào đúng lúc. Mặt nạ của người con gái ngoan. Mặt nạ của một người tốt bụng. Mặt nạ của người luôn ổn. Mặt nạ của người không cần ai giúp.

Đêm nay, chiếc xe ngựa đen chở cô đến trước cổng thành của **Facede City** - nơi đèn neon xanh tím lập lòe như đang thở, và bóng tối nép mình sau từng góc phố hào nhoáng. Những hành khách khác, những bóng đen không mặt, lặng lẽ bước xuống, đi qua cổng thành phố rồi tan vào sương mù. Elya bước xuống sau cùng. Gió rít khẽ qua khe hở của chiếc mặt nạ gốm cô đang đeo - thứ đã dính chặt vào da thịt cô lâu đến mức cô không còn chắc bên dưới nó còn lại điều gì.

Cô đi qua đại sảnh **Cathedral of Persona**, nơi trần nhà cao vút được lát bằng hàng ngàn mảnh gương vỡ phản chiếu chính cô với vô vàn góc độ khác nhau. Ở cuối sảnh, một tấm gương lớn hơn tất cả đang chờ.

Elya không soi thấy mình trong đó. cô nhìn thấy **Nyx**

Hắn đứng đó, đeo một chiếc mặt nạ nứt vỡ hệt cô, chỉ khác là những vết nứt của hắn rỉ ra thứ ánh sáng u ám. "Ngươi đeo nó bao lâu rồi," Nyx hỏi với tông giọng thều thào như tiếng gió, "đến mức đã quên mất đi khuôn mặt thật của chính mình?"

Elya không trả lời được. Đôi chân cô như bị khóa xuống nền đá lạnh. Rồi, đột ngột như lúc xuất hiện, Nyx tan vào bóng tối của tấm gương, để lại Elya một mình nơi đó.

Elya nhìn xuống hành lang dẫn về phía sau nhà thờ - một cầu thang xoắn ốc chìm dần vào bóng tối - **The Abyss**. Chưa ai từng quay lại khỏi nơi đó. Nhưng Elya biết nếu có một khuôn mặt thật nào còn sót lại dưới lớp mặt nạ của mình, nó sẽ không nằm tại thành phố giả tạo này. Nó nằm ở dưới kia, trong bóng tối mà mọi người luôn trốn tránh.

Elya bước xuống bậc thang đầu tiên.

---

Type of Puzzles
