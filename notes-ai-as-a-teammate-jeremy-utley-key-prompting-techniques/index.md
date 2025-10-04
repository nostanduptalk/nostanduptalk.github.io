# [筆記] 把 AI 當隊友：Jeremy Utley 的關鍵提示技巧


想提升 AI 的生產力嗎？史丹佛大學教授 Jeremy Utley 提出，關鍵在於將 AI 視為「隊友」而非「工具」。這篇文章整理了他的四個實用提示技巧，幫助你學會如何引導、提問，讓 AI 發揮最佳表現。

<!--more-->

> _Right now the primary limitation is the limits of human imagination._
>
> _… not because they're technologically impossible but because they never occur to us personally._

## AI 心態：把 AI 當隊友，而非工具

| 關鍵觀念 | 摘要 |
| :--- | :--- |
| **最佳使用者心態** | 最會用 AI 的人不是「工程師」，而是「教練」：他們懂得引導、提問，幫助 AI 發揮最佳表現。 |
| **隊友觀念** | 把 AI 當成「隊友」而不是「技術」。 |
| **本質比喻** | AI = 「壞軟體，但好人」：它就像一個永不疲倦、超熱情、能力不錯但需要引導的實習生。 |
| **缺陷提醒** | AI 天生愛說「是」，不擅長反駁或設限。若用戶缺乏批判，可能被「煤氣燈效應」誤導。 |
| **鏡子效應** | AI 會反映用戶的心態：想偷懶的人會更懶，想保持敏銳的人會更敏銳。 |

### 1. 逆向提示 (Reverse Prompting)

這項技術將 AI 視為**隊友而非技術**，強制 AI 在開始工作前，主動要求任務所需的背景資訊，避免它**編造數字 (make numbers up)**。

```
before you get started ask me for any information you need to do a good job
```

### 2. 思維鏈推理 (Chain of Thought Reasoning)

這項技術要求 AI **出聲思考 (thinking out loud)**，將隱藏的思維過程外顯化。這能顯著**改善模型的輸出結果 (meaningfully improve the outputs of the model)**，並讓人得以評估其假設。

```
before you respond to my query please walk me through your thought process step by step
```

### 3. 強化批判性思考 (Strengthening Critical Thinking)

這項語句通常用於自訂指令中，目的在於避免**認知卸載 (cognitive offloading)**，並防止 AI 施展**煤氣燈效應 (gaslight you)**。它要求 AI 成為挑戰者，推動人類思考。

```
whenever you see opportunities in our conversations please push my critical thinking ability
```

### 4. 角色指定 (Role Assignment)

這是最基礎的技巧之一。透過指定角色，可以告訴 AI **在它龐大的知識庫中應該聚焦在哪裡 (where in your vast knowledge bank do I want you to draw information)**，從而獲得更有針對性的回答。

```
I'd like you to be a professional communications expert
```

---

## 影片來源

[提升AI生產力的實用指南 (Jeremy Utley)](https://www.youtube.com/watch?v=yMOmmnjy3sE)
