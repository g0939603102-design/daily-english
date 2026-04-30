import { useState, useRef, useEffect } from "react";

const WORD_BANK = [
  [
    { word: "tired", pronunciation: "/ˈtaɪərd/", partOfSpeech: "adj", chineseMeaning: "累的", example: "I'm so tired today.", exampleTranslation: "我今天好累。", tip: "最常用的「累」，比 exhausted 簡單多了" },
    { word: "hungry", pronunciation: "/ˈhʌŋ.ɡri/", partOfSpeech: "adj", chineseMeaning: "餓的", example: "I'm really hungry. Let's eat!", exampleTranslation: "我好餓，我們去吃吧！", tip: "肚子餓就說 I'm hungry，超直接" },
    { word: "busy", pronunciation: "/ˈbɪz.i/", partOfSpeech: "adj", chineseMeaning: "忙的", example: "Sorry, I'm busy right now.", exampleTranslation: "抱歉，我現在很忙。", tip: "忙到沒時間回訊息時說這句" },
  ],
  [
    { word: "late", pronunciation: "/leɪt/", partOfSpeech: "adj", chineseMeaning: "遲到的", example: "I'm going to be late!", exampleTranslation: "我要遲到了！", tip: "遲到說 I'm late，簡單有力" },
    { word: "early", pronunciation: "/ˈɜː.li/", partOfSpeech: "adj", chineseMeaning: "早的", example: "Let's leave early to avoid traffic.", exampleTranslation: "我們早點出發避開塞車。", tip: "early = 早，late = 晚，一組記" },
    { word: "ready", pronunciation: "/ˈred.i/", partOfSpeech: "adj", chineseMeaning: "準備好了", example: "Are you ready? Let's go!", exampleTranslation: "你準備好了嗎？走吧！", tip: "Are you ready? 出門前最常說的一句" },
  ],
  [
    { word: "hot", pronunciation: "/hɒt/", partOfSpeech: "adj", chineseMeaning: "熱的", example: "It's so hot today — I'm sweating!", exampleTranslation: "今天好熱，我在流汗！", tip: "天氣熱、食物燙都用 hot" },
    { word: "cold", pronunciation: "/kəʊld/", partOfSpeech: "adj", chineseMeaning: "冷的", example: "It's cold outside. Bring a jacket.", exampleTranslation: "外面很冷，帶件外套。", tip: "天氣冷、飲料冰都是 cold" },
    { word: "full", pronunciation: "/fʊl/", partOfSpeech: "adj", chineseMeaning: "吃飽了", example: "I'm so full. I can't eat anymore.", exampleTranslation: "我好飽，吃不下了。", tip: "吃飽了說 I'm full，簡單直接" },
  ],
  [
    { word: "good", pronunciation: "/ɡʊd/", partOfSpeech: "adj", chineseMeaning: "好的", example: "This food is so good!", exampleTranslation: "這個食物好好吃！", tip: "萬用稱讚詞，比 nice 更口語" },
    { word: "bad", pronunciation: "/bæd/", partOfSpeech: "adj", chineseMeaning: "糟的", example: "Today was a really bad day.", exampleTranslation: "今天真的是很糟的一天。", tip: "That's bad. / That's too bad. 都超常用" },
    { word: "okay", pronunciation: "/ˌəʊˈkeɪ/", partOfSpeech: "adj", chineseMeaning: "還好、可以", example: "Are you okay? You look tired.", exampleTranslation: "你還好嗎？你看起來很累。", tip: "OK / okay 可以問人、也可以回答" },
  ],
  [
    { word: "want", pronunciation: "/wɒnt/", partOfSpeech: "verb", chineseMeaning: "想要", example: "I want coffee. Do you want some too?", exampleTranslation: "我想喝咖啡，你也要嗎？", tip: "I want... 是最直接表達需求的方式" },
    { word: "need", pronunciation: "/niːd/", partOfSpeech: "verb", chineseMeaning: "需要", example: "I need to sleep. I'm exhausted.", exampleTranslation: "我需要睡覺，我累壞了。", tip: "need 比 want 更急迫，是「必須要」" },
    { word: "like", pronunciation: "/laɪk/", partOfSpeech: "verb", chineseMeaning: "喜歡", example: "I like this place — it's really cozy.", exampleTranslation: "我喜歡這個地方，很溫馨。", tip: "Do you like...? 是聊天最好用的開場" },
  ],
  [
    { word: "think", pronunciation: "/θɪŋk/", partOfSpeech: "verb", chineseMeaning: "覺得、認為", example: "I think this is a good idea.", exampleTranslation: "我覺得這是個好主意。", tip: "I think... 表達意見時的萬用開頭" },
    { word: "know", pronunciation: "/nəʊ/", partOfSpeech: "verb", chineseMeaning: "知道", example: "I don't know. Let me check.", exampleTranslation: "我不知道，讓我查一下。", tip: "I don't know. / I know! 日常超高頻" },
    { word: "sorry", pronunciation: "/ˈsɒr.i/", partOfSpeech: "interjection", chineseMeaning: "抱歉", example: "Sorry, I'm late!", exampleTranslation: "抱歉，我遲到了！", tip: "Sorry! 一個字就夠，不需要長篇道歉" },
  ],
  [
    { word: "please", pronunciation: "/pliːz/", partOfSpeech: "adv", chineseMeaning: "請", example: "Can I have the menu, please?", exampleTranslation: "請給我菜單好嗎？", tip: "句尾加 please 讓任何請求都更有禮貌" },
    { word: "thank you", pronunciation: "/ˈθæŋk juː/", partOfSpeech: "phrase", chineseMeaning: "謝謝", example: "Thank you so much for your help!", exampleTranslation: "非常感謝你的幫忙！", tip: "Thanks 更口語，Thank you 更正式，都對" },
    { word: "excuse me", pronunciation: "/ɪkˈskjuːz miː/", partOfSpeech: "phrase", chineseMeaning: "不好意思", example: "Excuse me, where is the bathroom?", exampleTranslation: "不好意思，廁所在哪裡？", tip: "問路、借過、打斷別人都用這句" },
  ],
  [
    { word: "really", pronunciation: "/ˈrɪəl.i/", partOfSpeech: "adv", chineseMeaning: "真的、非常", example: "This is really delicious!", exampleTranslation: "這個真的很好吃！", tip: "加在形容詞前面強調語氣，超常用" },
    { word: "very", pronunciation: "/ˈver.i/", partOfSpeech: "adv", chineseMeaning: "非常", example: "I'm very happy today.", exampleTranslation: "我今天非常開心。", tip: "very 跟 really 用法一樣，可以互換" },
    { word: "too", pronunciation: "/tuː/", partOfSpeech: "adv", chineseMeaning: "太（過分）", example: "This is too spicy for me!", exampleTranslation: "這對我來說太辣了！", tip: "too hot / too spicy / too expensive 超常用" },
  ],
  [
    { word: "here", pronunciation: "/hɪər/", partOfSpeech: "adv", chineseMeaning: "這裡", example: "I'm here! Sorry I'm late.", exampleTranslation: "我到了！抱歉我遲到了。", tip: "I'm here. 到達某地打招呼用" },
    { word: "wait", pronunciation: "/weɪt/", partOfSpeech: "verb", chineseMeaning: "等一下", example: "Wait! I forgot my phone.", exampleTranslation: "等一下！我忘記帶手機了。", tip: "Wait! 一個字就能叫人停下來" },
    { word: "help", pronunciation: "/help/", partOfSpeech: "verb", chineseMeaning: "幫忙", example: "Can you help me with this?", exampleTranslation: "你可以幫我做這個嗎？", tip: "Can you help me? 求助萬用句" },
  ],
  [
    { word: "go", pronunciation: "/ɡəʊ/", partOfSpeech: "verb", chineseMeaning: "走、去", example: "Let's go! We're going to be late.", exampleTranslation: "走吧！我們要遲到了。", tip: "Let's go! 是最有能量的出發號令" },
    { word: "come", pronunciation: "/kʌm/", partOfSpeech: "verb", chineseMeaning: "來", example: "Come here, look at this!", exampleTranslation: "來這裡，看看這個！", tip: "Come on! = 快點！Come here! = 過來！" },
    { word: "take", pronunciation: "/teɪk/", partOfSpeech: "verb", chineseMeaning: "拿、花（時間）", example: "It takes 30 minutes to get there.", exampleTranslation: "到那裡要花30分鐘。", tip: "It takes... 說時間最常用的句型" },
  ],
  [
    { word: "eat", pronunciation: "/iːt/", partOfSpeech: "verb", chineseMeaning: "吃", example: "Have you eaten yet?", exampleTranslation: "你吃了嗎？", tip: "Have you eaten? 台灣人最熟悉的關心句！" },
    { word: "drink", pronunciation: "/drɪŋk/", partOfSpeech: "verb", chineseMeaning: "喝", example: "What do you want to drink?", exampleTranslation: "你想喝什麼？", tip: "點飲料時直接說 I want..." },
    { word: "sleep", pronunciation: "/sliːp/", partOfSpeech: "verb", chineseMeaning: "睡覺", example: "I need to sleep. I'm so tired.", exampleTranslation: "我需要睡覺，我好累。", tip: "Go to sleep. = 去睡覺。I slept well. = 我睡得很好。" },
  ],
  [
    { word: "work", pronunciation: "/wɜːk/", partOfSpeech: "verb", chineseMeaning: "工作", example: "I work from 9 to 6 every day.", exampleTranslation: "我每天9點到6點上班。", tip: "work 也可以是名詞，go to work = 去上班" },
    { word: "buy", pronunciation: "/baɪ/", partOfSpeech: "verb", chineseMeaning: "買", example: "I want to buy a new phone.", exampleTranslation: "我想買一支新手機。", tip: "I'll buy it. 購物決定的那一刻就說這句" },
    { word: "try", pronunciation: "/traɪ/", partOfSpeech: "verb", chineseMeaning: "試試看", example: "Just try it — you might like it!", exampleTranslation: "試試看，你可能會喜歡的！", tip: "鼓勵別人嘗試說 Just try it!" },
  ],
  [
    { word: "today", pronunciation: "/təˈdeɪ/", partOfSpeech: "adv", chineseMeaning: "今天", example: "What are you doing today?", exampleTranslation: "你今天要做什麼？", tip: "today / tomorrow / yesterday 三個一起記" },
    { word: "tomorrow", pronunciation: "/təˈmɒr.əʊ/", partOfSpeech: "adv", chineseMeaning: "明天", example: "Let's do it tomorrow instead.", exampleTranslation: "我們改明天做吧。", tip: "See you tomorrow! 分別時常說的一句" },
    { word: "now", pronunciation: "/naʊ/", partOfSpeech: "adv", chineseMeaning: "現在、馬上", example: "I can't talk right now.", exampleTranslation: "我現在沒辦法說話。", tip: "right now 比 now 更強調「就是現在」" },
  ],
  [
    { word: "happy", pronunciation: "/ˈhæp.i/", partOfSpeech: "adj", chineseMeaning: "開心的", example: "I'm so happy to see you!", exampleTranslation: "見到你我好開心！", tip: "I'm happy. / That makes me happy. 都超自然" },
    { word: "sad", pronunciation: "/sæd/", partOfSpeech: "adj", chineseMeaning: "難過的", example: "I'm a bit sad today.", exampleTranslation: "我今天有點難過。", tip: "That's sad. 聽到壞消息時同理對方" },
    { word: "surprised", pronunciation: "/səˈpraɪzd/", partOfSpeech: "adj", chineseMeaning: "驚訝的", example: "I was so surprised by the news!", exampleTranslation: "我對那個消息感到非常驚訝！", tip: "I'm surprised! / What a surprise! 都很自然" },
  ],
  [
    { word: "always", pronunciation: "/ˈɔːl.weɪz/", partOfSpeech: "adv", chineseMeaning: "總是", example: "She's always late!", exampleTranslation: "她總是遲到！", tip: "always / sometimes / never 三個頻率詞一起記" },
    { word: "never", pronunciation: "/ˈnev.ər/", partOfSpeech: "adv", chineseMeaning: "從不", example: "I never skip breakfast.", exampleTranslation: "我從不跳過早餐。", tip: "I never... 表示「我絕對不會...」" },
    { word: "maybe", pronunciation: "/ˈmeɪ.bi/", partOfSpeech: "adv", chineseMeaning: "也許", example: "Maybe we can go next weekend.", exampleTranslation: "也許我們可以下個週末去。", tip: "不確定的時候說 Maybe，語氣比較軟" },
  ],
  [
    { word: "again", pronunciation: "/əˈɡen/", partOfSpeech: "adv", chineseMeaning: "再一次", example: "Can you say that again?", exampleTranslation: "你可以再說一次嗎？", tip: "聽不懂時說 Sorry, can you say that again?" },
    { word: "together", pronunciation: "/təˈɡeð.ər/", partOfSpeech: "adv", chineseMeaning: "一起", example: "Let's go together!", exampleTranslation: "我們一起去吧！", tip: "Let's do it together. 邀請別人最暖的說法" },
    { word: "enough", pronunciation: "/ɪˈnʌf/", partOfSpeech: "adj", chineseMeaning: "夠了", example: "That's enough, thank you.", exampleTranslation: "夠了，謝謝。", tip: "That's enough! 也可以表示「夠了！不要再說了！」" },
  ],
  [
    { word: "fast", pronunciation: "/fɑːst/", partOfSpeech: "adj", chineseMeaning: "快的", example: "You walk so fast — slow down!", exampleTranslation: "你走好快，慢一點！", tip: "fast / slow 一組記，形容速度" },
    { word: "slow", pronunciation: "/sləʊ/", partOfSpeech: "adj", chineseMeaning: "慢的", example: "The internet is so slow today.", exampleTranslation: "今天網路好慢。", tip: "Take it slow. = 慢慢來，不要急" },
    { word: "alone", pronunciation: "/əˈləʊn/", partOfSpeech: "adj", chineseMeaning: "一個人的", example: "I went there alone.", exampleTranslation: "我一個人去的。", tip: "alone = 一個人，lonely = 感到孤單，不一樣" },
  ],
  [
    { word: "money", pronunciation: "/ˈmʌn.i/", partOfSpeech: "noun", chineseMeaning: "錢", example: "I don't have enough money.", exampleTranslation: "我的錢不夠。", tip: "I'm out of money. = 我沒錢了。" },
    { word: "time", pronunciation: "/taɪm/", partOfSpeech: "noun", chineseMeaning: "時間", example: "What time is it?", exampleTranslation: "現在幾點？", tip: "What time is it? 問時間最基本的句子" },
    { word: "place", pronunciation: "/pleɪs/", partOfSpeech: "noun", chineseMeaning: "地方", example: "This place is amazing!", exampleTranslation: "這個地方太棒了！", tip: "推薦某地說 This is a great place!" },
  ],
  [
    { word: "food", pronunciation: "/fuːd/", partOfSpeech: "noun", chineseMeaning: "食物", example: "The food here is so good.", exampleTranslation: "這裡的食物真的很好吃。", tip: "The food is great here. 稱讚餐廳最直接的說法" },
    { word: "weather", pronunciation: "/ˈweð.ər/", partOfSpeech: "noun", chineseMeaning: "天氣", example: "The weather is perfect today!", exampleTranslation: "今天天氣真的很棒！", tip: "聊天氣是全球通用的對話開場" },
    { word: "price", pronunciation: "/praɪs/", partOfSpeech: "noun", chineseMeaning: "價格", example: "What's the price of this?", exampleTranslation: "這個多少錢？", tip: "問價錢說 What's the price? 或 How much?" },
  ],
  [
    { word: "hang out", pronunciation: "/hæŋ aʊt/", partOfSpeech: "phrase", chineseMeaning: "出去玩、閒晃", example: "Want to hang out this weekend?", exampleTranslation: "這週末要出來玩嗎？", tip: "沒有特別計畫的輕鬆相聚就是 hang out" },
    { word: "no way", pronunciation: "/nəʊ weɪ/", partOfSpeech: "phrase", chineseMeaning: "不可能！", example: "No way — that's so cheap!", exampleTranslation: "不可能，那麼便宜！", tip: "驚訝或拒絕都可以用，語氣決定意思" },
    { word: "come on", pronunciation: "/kʌm ɒn/", partOfSpeech: "phrase", chineseMeaning: "快點、拜託", example: "Come on, we're going to be late!", exampleTranslation: "快點，我們要遲到了！", tip: "催促別人快點或表示「拜託一下」" },
  ],
  [
    { word: "no problem", pronunciation: "/nəʊ ˈprɒb.ləm/", partOfSpeech: "phrase", chineseMeaning: "沒問題", example: "Can you help me? — No problem!", exampleTranslation: "你可以幫我嗎？— 沒問題！", tip: "比 you're welcome 更口語的回應方式" },
    { word: "kind of", pronunciation: "/kaɪnd əv/", partOfSpeech: "phrase", chineseMeaning: "有點", example: "It's kind of cold today, right?", exampleTranslation: "今天有點冷，對吧？", tip: "口語常說 kinda，讓語氣變得比較軟" },
    { word: "actually", pronunciation: "/ˈæk.tʃu.ə.li/", partOfSpeech: "adv", chineseMeaning: "其實", example: "Actually, I changed my mind.", exampleTranslation: "其實，我改變主意了。", tip: "要說出與對方預期不同的話前，先說 actually" },
  ],
  [
    { word: "sounds good", pronunciation: "/saʊndz ɡʊd/", partOfSpeech: "phrase", chineseMeaning: "聽起來不錯", example: "Let's meet at 7? — Sounds good!", exampleTranslation: "7點見？— 聽起來不錯！", tip: "同意對方提議時最自然的回應" },
    { word: "go ahead", pronunciation: "/ɡəʊ əˈhed/", partOfSpeech: "phrase", chineseMeaning: "請便、你先吧", example: "Go ahead — I'll catch up later.", exampleTranslation: "你先去，我等一下跟上。", tip: "讓對方先行動，或許可對方的請求" },
    { word: "by the way", pronunciation: "/baɪ ðə weɪ/", partOfSpeech: "phrase", chineseMeaning: "對了、順帶一提", example: "By the way, did you eat yet?", exampleTranslation: "對了，你吃了嗎？", tip: "轉換話題或補充資訊時最自然的開頭" },
  ],
  [
    { word: "totally", pronunciation: "/ˈtəʊ.tə.li/", partOfSpeech: "adv", chineseMeaning: "完全、超級", example: "I totally forgot about it!", exampleTranslation: "我完全忘記這件事了！", tip: "I totally agree. / I totally forgot. 超口語" },
    { word: "seriously", pronunciation: "/ˈsɪər.i.əs.li/", partOfSpeech: "adv", chineseMeaning: "真的假的", example: "Seriously? You ate the whole thing?", exampleTranslation: "真的假的？你全部都吃掉了？", tip: "表示不敢相信，語氣很豐富" },
    { word: "literally", pronunciation: "/ˈlɪt.ər.ə.li/", partOfSpeech: "adv", chineseMeaning: "真的、超（強調）", example: "I'm literally dying — it's so funny.", exampleTranslation: "我真的笑死，太好笑了。", tip: "誇張強調用，影集裡超常聽到" },
  ],
  [
    { word: "grab", pronunciation: "/ɡræb/", partOfSpeech: "verb", chineseMeaning: "去吃、順手拿", example: "Let's grab some coffee.", exampleTranslation: "我們去喝杯咖啡吧。", tip: "grab lunch / grab a drink 隨興找東西吃喝" },
    { word: "end up", pronunciation: "/end ʌp/", partOfSpeech: "phrase", chineseMeaning: "最後結果是", example: "We got lost and ended up at a park.", exampleTranslation: "我們迷路，最後跑到一個公園。", tip: "形容預料之外的結果，超好用" },
    { word: "run out of", pronunciation: "/rʌn aʊt əv/", partOfSpeech: "phrase", chineseMeaning: "用完了", example: "I ran out of shampoo.", exampleTranslation: "我的洗髮精用完了。", tip: "run out of time / money / battery 都超常用" },
  ],
  [
    { word: "catch up", pronunciation: "/kætʃ ʌp/", partOfSpeech: "phrase", chineseMeaning: "敘舊", example: "Let's catch up over dinner!", exampleTranslation: "我們去吃晚餐敘舊吧！", tip: "久沒見面，更新近況就叫 catch up" },
    { word: "give up", pronunciation: "/ɡɪv ʌp/", partOfSpeech: "phrase", chineseMeaning: "放棄", example: "Don't give up — you're almost there!", exampleTranslation: "不要放棄，你快到了！", tip: "Don't give up! 鼓勵別人最有力的一句" },
    { word: "check out", pronunciation: "/tʃek aʊt/", partOfSpeech: "phrase", chineseMeaning: "去看看", example: "You should check out that new café.", exampleTranslation: "你應該去看看那家新咖啡廳。", tip: "推薦別人去某地試試就說 check it out" },
  ],
  [
    { word: "worth it", pronunciation: "/wɜːθ ɪt/", partOfSpeech: "phrase", chineseMeaning: "值得的", example: "The wait was long but totally worth it.", exampleTranslation: "等了很久但完全值得。", tip: "付出代價之後覺得划算就說 worth it" },
    { word: "on the way", pronunciation: "/ɒn ðə weɪ/", partOfSpeech: "phrase", chineseMeaning: "在路上", example: "I'm on the way! Be there in 10 minutes.", exampleTranslation: "我在路上了！10分鐘後到。", tip: "告訴別人你正在前往就說 I'm on the way" },
    { word: "count me in", pronunciation: "/kaʊnt miː ɪn/", partOfSpeech: "phrase", chineseMeaning: "算我一份！", example: "Road trip? Count me in!", exampleTranslation: "公路旅行？算我一份！", tip: "相反是 count me out = 我不參加" },
  ],
  [
    { word: "obsessed", pronunciation: "/əbˈsest/", partOfSpeech: "adj", chineseMeaning: "超迷、著迷", example: "I'm obsessed with this show!", exampleTranslation: "我超迷這部劇！", tip: "比 love 強很多，完全停不下來的喜歡" },
    { word: "hooked", pronunciation: "/hʊkt/", partOfSpeech: "adj", chineseMeaning: "上癮了", example: "I'm hooked — I watched 5 episodes today.", exampleTranslation: "我上癮了，今天看了5集。", tip: "像魚被鉤住，停不下來" },
    { word: "can't stand", pronunciation: "/kɑːnt stænd/", partOfSpeech: "phrase", chineseMeaning: "受不了", example: "I can't stand the heat today.", exampleTranslation: "我今天受不了這個熱。", tip: "比 hate 更口語，表示真的忍受不了" },
  ],
  [
    { word: "pumped", pronunciation: "/pʌmpt/", partOfSpeech: "adj", chineseMeaning: "超興奮", example: "I'm so pumped for the concert!", exampleTranslation: "我對演唱會超興奮！", tip: "像被打了氣一樣充滿能量，很正面的興奮" },
    { word: "fed up", pronunciation: "/fed ʌp/", partOfSpeech: "phrase", chineseMeaning: "受夠了", example: "I'm so fed up with this weather.", exampleTranslation: "我對這個天氣真的受夠了。", tip: "被餵到飽，受不了了 = fed up" },
    { word: "heads up", pronunciation: "/hedz ʌp/", partOfSpeech: "phrase", chineseMeaning: "先提醒你", example: "Just a heads up — the meeting moved to 3pm.", exampleTranslation: "先提醒你，會議改到下午3點。", tip: "提前讓對方知道某件事，很貼心的說法" },
  ],
  [
    { word: "nail it", pronunciation: "/neɪl ɪt/", partOfSpeech: "phrase", chineseMeaning: "做得太棒了", example: "You nailed it! That was perfect.", exampleTranslation: "你做得太棒了，完美！", tip: "像釘子精準釘進去，一擊即中" },
    { word: "good call", pronunciation: "/ɡʊd kɔːl/", partOfSpeech: "phrase", chineseMeaning: "好決定", example: "Taking the train was a good call.", exampleTranslation: "搭火車這個決定真的不錯。", tip: "讚美對方做了正確判斷的說法" },
    { word: "you've got this", pronunciation: "/juːv ɡɒt ðɪs/", partOfSpeech: "phrase", chineseMeaning: "你可以的！", example: "Nervous? You've got this!", exampleTranslation: "緊張嗎？你可以的！", tip: "最有力量的鼓勵句" },
  ],
  [
    { word: "hang in there", pronunciation: "/hæŋ ɪn ðeər/", partOfSpeech: "phrase", chineseMeaning: "撐住、加油", example: "I know it's tough — hang in there!", exampleTranslation: "我知道很辛苦，撐住！", tip: "別放手，繼續堅持" },
    { word: "take it easy", pronunciation: "/teɪk ɪt ˈiː.zi/", partOfSpeech: "phrase", chineseMeaning: "放輕鬆", example: "Take it easy — there's no rush.", exampleTranslation: "放輕鬆，不急的。", tip: "叫對方不要緊張或過度操勞" },
    { word: "at least", pronunciation: "/æt liːst/", partOfSpeech: "phrase", chineseMeaning: "至少", example: "It's not perfect, but at least it works.", exampleTranslation: "不完美，但至少可以用。", tip: "找到壞事中的一點好時說 at least" },
  ],
  [
    { word: "out of nowhere", pronunciation: "/aʊt əv ˈnəʊ.weər/", partOfSpeech: "phrase", chineseMeaning: "突然、毫無預警", example: "Out of nowhere, it started raining.", exampleTranslation: "突然就開始下雨了。", tip: "從沒有地方冒出來 = 毫無預警地發生" },
    { word: "in no time", pronunciation: "/ɪn nəʊ taɪm/", partOfSpeech: "phrase", chineseMeaning: "很快就好", example: "Don't worry — it'll be done in no time.", exampleTranslation: "別擔心，很快就好了。", tip: "時間短到幾乎沒有 = 一下子就完成" },
    { word: "better late than never", pronunciation: "/ˈbet.ər leɪt ðæn ˈnev.ər/", partOfSpeech: "phrase", chineseMeaning: "遲到總比沒到好", example: "You finally came! Better late than never.", exampleTranslation: "你終於來了！遲到總比沒到好。", tip: "晚一點做比完全不做好，英文諺語" },
  ],
];

const CARD_COLORS = [
  { bg: "#1a1a2e", accent: "#e94560", light: "#16213e" },
  { bg: "#0f3460", accent: "#f5a623", light: "#1a4a7a" },
  { bg: "#1b4332", accent: "#52b788", light: "#2d6a4f" },
];

const GROUP_LABELS = [
  "累・餓・忙","早・晚・準備好","冷熱・吃飽","好壞・還好","想要・需要・喜歡",
  "覺得・知道・抱歉","請・謝謝・不好意思","真的・非常・太","這裡・等一下・幫忙","走・來・花時間",
  "吃・喝・睡","工作・買・試","今天・明天・現在","開心・難過・驚訝","總是・從不・也許",
  "再一次・一起・夠了","快・慢・一個人","錢・時間・地方","食物・天氣・價格","hang out・no way・come on",
  "no problem・kind of・actually","sounds good・go ahead・by the way","totally・seriously・literally","grab・end up・run out of","catch up・give up・check out",
  "worth it・on the way・count me in","obsessed・hooked・can't stand","pumped・fed up・heads up","nail it・good call・you've got this","hang in there・take it easy・at least",
  "out of nowhere・in no time・better late than never",
];

function getDaySet() {
  const start = new Date("2026-04-30T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / 86400000);
  return Math.abs(diff) % WORD_BANK.length;
}

// ── 發音按鈕 ──
function SpeakBtn({ text, label, accent, rate }) {
  const [playing, setPlaying] = useState(false);
  function handleSpeak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlaying(true);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US"; utter.rate = rate || 0.85; utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang === "en-US") || voices.find(v => v.lang.startsWith("en"));
    if (v) utter.voice = v;
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utter);
  }
  return (
    <button onClick={handleSpeak} style={{
      display:"inline-flex", alignItems:"center", gap:"5px",
      background: playing ? `${accent}33` : "rgba(255,255,255,0.08)",
      border:`1px solid ${playing ? accent : "rgba(255,255,255,0.15)"}`,
      color: playing ? accent : "rgba(255,255,255,0.6)",
      borderRadius:"20px", padding:"5px 12px", fontSize:"12px", cursor:"pointer",
      transition:"all 0.2s", fontFamily:"monospace"
    }}>
      <span style={{fontSize:"14px"}}>{playing ? "🔊" : "🔈"}</span>{label}
    </button>
  );
}

// ── 跟讀練習 ──
function SpeechPractice({ word, accent }) {
  const [status, setStatus] = useState("idle");
  const [heard, setHeard] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const recRef = useRef(null);
  const gotResultRef = useRef(false);

  function normalize(str) {
    return str.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus("unsupported"); return; }
    if (recRef.current) { try { recRef.current.abort(); } catch(e) {} }
    setStatus("listening"); setHeard(""); setErrorMsg(""); gotResultRef.current = false;

    const rec = new SR();
    recRef.current = rec;
    rec.lang = "en-US"; rec.interimResults = false; rec.continuous = false; rec.maxAlternatives = 3;

    rec.onresult = (e) => {
      gotResultRef.current = true;
      const transcripts = [];
      for (let i = 0; i < e.results.length; i++)
        for (let j = 0; j < e.results[i].length; j++)
          transcripts.push(normalize(e.results[i][j].transcript));
      setHeard(transcripts[0] || "");
      const target = normalize(word);
      const matched = transcripts.some(t =>
        t.split(" ").some(tw => target.split(" ").some(tr => tw === tr || tw.includes(tr) || tr.includes(tw)))
      );
      setStatus(matched ? "success" : "fail");
    };

    rec.onerror = (e) => {
      gotResultRef.current = true;
      if (e.error === "not-allowed") setErrorMsg("請允許麥克風權限後再試");
      else if (e.error === "no-speech") setErrorMsg("沒偵測到聲音，說大聲一點再試");
      else if (e.error === "network") setErrorMsg("需要網路連線才能使用");
      else setErrorMsg("請再試一次");
      setStatus("error");
    };

    rec.onend = () => {
      if (!gotResultRef.current) { setErrorMsg("沒收到語音，靠近麥克風說清楚一點"); setStatus("error"); }
    };

    try { rec.start(); } catch(e) { setErrorMsg("無法啟動麥克風"); setStatus("error"); }
  }

  function reset() { setStatus("idle"); setHeard(""); setErrorMsg(""); gotResultRef.current = false; }

  if (status === "unsupported") return (
    <div style={{ padding:"12px", background:"rgba(255,255,255,0.04)", borderRadius:"10px", fontSize:"12px", color:"#666", textAlign:"center", marginBottom:"14px" }}>
      ⚠️ 此環境不支援語音辨識<br/>
      <span style={{fontSize:"11px",color:"#444"}}>請用瀏覽器開啟獨立連結後使用</span>
    </div>
  );

  return (
    <div style={{ padding:"16px", background:"rgba(255,255,255,0.04)", borderRadius:"12px", marginBottom:"14px" }}>
      <div style={{ fontSize:"10px", letterSpacing:"2px", color:accent, textTransform:"uppercase", marginBottom:"10px", fontFamily:"monospace" }}>
        🎤 跟讀練習
      </div>
      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"14px", lineHeight:"1.6" }}>
        ① 先聽發音　② 跟著念　③ 按麥克風，AI 判斷對不對
      </div>

      <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
        <SpeakBtn text={word} label="① 聽發音" accent={accent} rate={0.7} />

        {status === "idle" && (
          <button onClick={startListening} style={{
            display:"inline-flex", alignItems:"center", gap:"6px",
            background:`${accent}`, border:"none",
            color:"#fff", borderRadius:"20px", padding:"6px 16px",
            fontSize:"12px", cursor:"pointer", fontWeight:"600"
          }}>🎤 ② 我來念</button>
        )}

        {status === "listening" && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px" }}>
            <span style={{ color:"#f5a623", fontSize:"12px", animation:"pulse 0.8s infinite" }}>🔴 聆聽中，請念出單字...</span>
            <button onClick={reset} style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"#666", borderRadius:"10px", padding:"3px 10px", fontSize:"11px", cursor:"pointer" }}>取消</button>
          </div>
        )}

        {status === "success" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"22px" }}>✅</span>
              <span style={{ color:"#52b788", fontSize:"14px", fontWeight:"700" }}>發音正確！太棒了！</span>
            </div>
            {heard && <div style={{ fontSize:"11px", color:"#666", fontFamily:"monospace" }}>辨識到："{heard}"</div>}
            <button onClick={reset} style={{ alignSelf:"flex-start", background:"none", border:`1px solid ${accent}44`, color:accent, borderRadius:"12px", padding:"4px 14px", fontSize:"12px", cursor:"pointer" }}>再練一次</button>
          </div>
        )}

        {status === "fail" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"22px" }}>❌</span>
              <span style={{ color:"#e94560", fontSize:"14px", fontWeight:"700" }}>再試試看！</span>
            </div>
            <div style={{ fontSize:"11px", color:"#666", fontFamily:"monospace", lineHeight:"1.7" }}>
              {heard ? <>你說的：<span style={{color:"#bbb"}}>"{heard}"</span><br/>目標：<span style={{color:accent}}>"{word}"</span></> : "沒清楚辨識到，說大聲清楚一點"}
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={startListening} style={{ background:`${accent}`, border:"none", color:"#fff", borderRadius:"12px", padding:"6px 16px", fontSize:"12px", cursor:"pointer", fontWeight:"600" }}>🎤 再念一次</button>
              <SpeakBtn text={word} label="再聽一次" accent={accent} rate={0.6} />
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
            <div style={{ fontSize:"12px", color:"#f5a623" }}>⚠️ {errorMsg}</div>
            <button onClick={startListening} style={{ alignSelf:"flex-start", background:`${accent}22`, border:`1px solid ${accent}44`, color:accent, borderRadius:"12px", padding:"5px 14px", fontSize:"12px", cursor:"pointer" }}>🎤 重試</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 測驗 ──
function QuizMode({ words }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => { generateOptions(0); }, []);

  function generateOptions(idx) {
    const correct = words[idx];
    const pool = [
      {word:"happy",chineseMeaning:"開心的"},{word:"tired",chineseMeaning:"累的"},
      {word:"go",chineseMeaning:"走"},{word:"eat",chineseMeaning:"吃"},
      {word:"cold",chineseMeaning:"冷的"},{word:"money",chineseMeaning:"錢"},
      {word:"now",chineseMeaning:"現在"},{word:"help",chineseMeaning:"幫忙"},
      {word:"good",chineseMeaning:"好的"},{word:"sorry",chineseMeaning:"抱歉"},
    ].filter(p => p.word !== correct.word);
    const others = pool.sort(() => Math.random() - 0.5).slice(0, 2);
    setOptions([...others, correct].sort(() => Math.random() - 0.5));
    setSelected(null);
  }

  function handleSelect(opt) {
    if (selected !== null) return;
    setSelected(opt);
    if (opt.word === words[qIndex].word) setScore(s => s + 1);
  }

  function next() {
    if (qIndex + 1 >= words.length) { setDone(true); return; }
    const ni = qIndex + 1; setQIndex(ni); generateOptions(ni);
  }

  function restart() { setQIndex(0); setScore(0); setDone(false); generateOptions(0); }

  const c = CARD_COLORS[qIndex % CARD_COLORS.length];
  const current = words[qIndex];

  if (done) return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:"52px", marginBottom:"16px" }}>{score === words.length ? "🎉" : score >= 2 ? "👍" : "💪"}</div>
      <div style={{ fontSize:"28px", fontWeight:"700", color:"#fff", marginBottom:"8px" }}>{score} / {words.length}</div>
      <div style={{ fontSize:"14px", color:"#888", marginBottom:"28px" }}>
        {score === words.length ? "全對！太厲害了！" : score >= 2 ? "不錯！繼續加油！" : "再練一次！"}
      </div>
      <button onClick={restart} style={{ background:CARD_COLORS[0].accent, border:"none", color:"#fff", borderRadius:"12px", padding:"13px 32px", fontSize:"15px", cursor:"pointer", fontWeight:"700" }}>再玩一次</button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"16px" }}>
        <div style={{ fontSize:"12px", color:"#666", fontFamily:"monospace" }}>第 {qIndex+1} / {words.length} 題</div>
        <div style={{ fontSize:"12px", color:"#52b788", fontFamily:"monospace" }}>✓ {score}</div>
      </div>
      <div style={{ background:c.light, borderRadius:"16px", padding:"28px", textAlign:"center", marginBottom:"16px" }}>
        <div style={{ fontSize:"11px", color:c.accent, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px", fontFamily:"monospace" }}>看中文，選英文</div>
        <div style={{ fontSize:"32px", fontWeight:"700", color:"#fff" }}>{current.chineseMeaning}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"16px" }}>
        {options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.06)", border = "1px solid rgba(255,255,255,0.1)", color = "#ccc";
          if (selected !== null) {
            if (opt.word === current.word) { bg = "rgba(82,183,136,0.2)"; border = "1px solid #52b788"; color = "#52b788"; }
            else if (opt.word === selected.word) { bg = "rgba(233,69,96,0.2)"; border = "1px solid #e94560"; color = "#e94560"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(opt)} style={{ background:bg, border, color, borderRadius:"12px", padding:"16px 8px", fontSize:"14px", cursor: selected ? "default":"pointer", fontWeight:"600", transition:"all 0.2s", fontFamily:"inherit" }}>
              {opt.word}
            </button>
          );
        })}
      </div>
      {selected && (
        <>
          <div style={{ padding:"12px", background:"rgba(255,255,255,0.04)", borderRadius:"10px", fontSize:"12px", color:"#888", fontStyle:"italic", textAlign:"center", marginBottom:"12px" }}>
            "{current.example}"
          </div>
          <button onClick={next} style={{ width:"100%", background:c.accent, border:"none", color:"#fff", borderRadius:"10px", padding:"13px", fontSize:"14px", cursor:"pointer", fontWeight:"600" }}>
            {qIndex + 1 >= words.length ? "看成績 🎉" : "下一題 →"}
          </button>
        </>
      )}
    </div>
  );
}

// ── 主 App ──
export default function DailyWordsApp() {
  const [mode, setMode] = useState("learn");
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [learned, setLearned] = useState({});

  const setIndex = getDaySet();
  const words = WORD_BANK[setIndex];
  const today = new Date().toLocaleDateString("zh-TW", { year:"numeric", month:"long", day:"numeric", weekday:"long" });
  const learnedCount = Object.values(learned).filter(Boolean).length;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0f 0%,#12121f 50%,#0a0a0f 100%)", fontFamily:"'Georgia','Times New Roman',serif", color:"#f0ede8" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>

      <div style={{ padding:"24px 20px 14px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#888", marginBottom:"4px", fontFamily:"monospace" }}>Daily Vocabulary</div>
        <h1 style={{ margin:"0 0 3px", fontSize:"24px", fontWeight:"300", letterSpacing:"2px" }}>每日英文單字</h1>
        <div style={{ fontSize:"11px", color:"#555", fontFamily:"monospace", marginBottom:"3px" }}>{today}</div>
        <div style={{ fontSize:"11px", color:"#666" }}>今日主題：<span style={{ color:"#f5a623" }}>{GROUP_LABELS[setIndex]}</span></div>
        <div style={{ fontSize:"10px", color:"#444", marginTop:"2px", fontFamily:"monospace" }}>93個單字 · 第{setIndex+1}/31組</div>
        {learnedCount > 0 && mode === "learn" && (
          <div style={{ marginTop:"8px", display:"inline-block", background:"rgba(82,183,136,0.15)", border:"1px solid rgba(82,183,136,0.3)", borderRadius:"20px", padding:"3px 14px", fontSize:"11px", color:"#52b788" }}>
            今日已學 {learnedCount} / {words.length} 個 🎉
          </div>
        )}
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:"10px", padding:"14px 20px 0" }}>
        {[["learn","📖 學習"],["quiz","🧠 測驗"]].map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding:"8px 24px", borderRadius:"20px", border:"none",
            background: mode === m ? "#f5a623" : "rgba(255,255,255,0.08)",
            color: mode === m ? "#000" : "#999",
            fontSize:"13px", cursor:"pointer", fontWeight: mode === m ? "700":"400", transition:"all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:"420px", margin:"0 auto", padding:"16px 14px" }}>
        {mode === "quiz" && <QuizMode words={words} />}

        {mode === "learn" && (<>
          <div style={{ display:"flex", gap:"8px", marginBottom:"18px", justifyContent:"center" }}>
            {words.map((w, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                padding:"8px 18px", borderRadius:"20px", border:"none",
                background: active === i ? CARD_COLORS[i].accent : "rgba(255,255,255,0.07)",
                color: active === i ? "#fff" : "#999", fontSize:"12px", cursor:"pointer",
                fontWeight: active === i ? "600":"400", transition:"all 0.2s", position:"relative", flexShrink:0
              }}>
                {learned[i] && <span style={{ position:"absolute", top:"-4px", right:"-2px", fontSize:"9px" }}>✓</span>}
                {i+1}. {w.word}
              </button>
            ))}
          </div>

          {words.map((word, i) => {
            if (active !== i) return null;
            const c = CARD_COLORS[i];
            return (
              <div key={i} style={{ background:c.bg, borderRadius:"20px", overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05)", animation:"fadeIn 0.3s ease" }}>
                <div style={{ height:"3px", background:c.accent }} />
                <div style={{ padding:"28px 24px 20px", background:c.light, textAlign:"center" }}>
                  <div style={{ fontSize:"10px", letterSpacing:"3px", color:c.accent, textTransform:"uppercase", marginBottom:"6px", fontFamily:"monospace" }}>{word.partOfSpeech}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"6px", flexWrap:"wrap" }}>
                    <div style={{ fontSize:"34px", fontWeight:"700", color:"#fff", letterSpacing:"1px" }}>{word.word}</div>
                  </div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontFamily:"monospace", marginBottom:"12px" }}>{word.pronunciation}</div>
                  <div style={{ display:"inline-block", background:`${c.accent}22`, border:`1px solid ${c.accent}44`, borderRadius:"8px", padding:"7px 18px", fontSize:"16px", color:c.accent, fontWeight:"600" }}>
                    {word.chineseMeaning}
                  </div>
                </div>

                <div style={{ padding:"18px 22px 0" }}>
                  {/* 跟讀練習 */}
                  <SpeechPractice word={word.word} accent={c.accent} />

                  {/* 例句 */}
                  <div style={{ marginBottom:"12px", padding:"16px", background:"rgba(255,255,255,0.04)", borderRadius:"12px", borderLeft:`3px solid ${c.accent}` }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                      <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#666", textTransform:"uppercase", fontFamily:"monospace" }}>例句</div>
                      <SpeakBtn text={word.example} label="聽例句" accent={c.accent} rate={0.82} />
                    </div>
                    <div style={{ fontSize:"15px", color:"#e8e4de", lineHeight:"1.7", marginBottom:"10px", fontStyle:"italic" }}>
                      "{word.example}"
                    </div>
                    {revealed[i]
                      ? <div style={{ fontSize:"13px", color:"#888", lineHeight:"1.5" }}>{word.exampleTranslation}</div>
                      : <button onClick={() => setRevealed(r => ({...r,[i]:true}))} style={{ background:"none", border:"1px solid rgba(255,255,255,0.12)", color:"#888", borderRadius:"6px", padding:"5px 12px", fontSize:"12px", cursor:"pointer" }}>顯示翻譯</button>
                    }
                  </div>

                  {/* 小技巧 */}
                  <div style={{ padding:"14px", background:`${c.accent}11`, borderRadius:"12px", border:`1px solid ${c.accent}22`, marginBottom:"14px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"2px", color:c.accent, textTransform:"uppercase", marginBottom:"6px", fontFamily:"monospace" }}>💡 記憶小技巧</div>
                    <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.65)", lineHeight:"1.6" }}>{word.tip}</div>
                  </div>

                  <button onClick={() => setLearned(l => ({...l,[i]:!l[i]}))} style={{
                    width:"100%", padding:"12px",
                    background: learned[i] ? `${c.accent}33` : "rgba(255,255,255,0.05)",
                    border:`1px solid ${learned[i] ? c.accent : "rgba(255,255,255,0.1)"}`,
                    color: learned[i] ? c.accent : "#666",
                    borderRadius:"10px", fontSize:"13px", cursor:"pointer",
                    fontWeight: learned[i] ? "700":"400", marginBottom:"4px", transition:"all 0.2s"
                  }}>{learned[i] ? "✓ 學會了！" : "標記為已學會"}</button>
                </div>

                <div style={{ padding:"12px 22px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <button onClick={() => setActive(Math.max(0,i-1))} disabled={i===0} style={{ background:"rgba(255,255,255,0.07)", border:"none", color:i===0?"#444":"#ccc", borderRadius:"8px", padding:"9px 18px", cursor:i===0?"default":"pointer", fontSize:"12px" }}>← 上一個</button>
                  <div style={{ fontSize:"12px", color:"#555", fontFamily:"monospace" }}>{i+1} / {words.length}</div>
                  <button onClick={() => setActive(Math.min(words.length-1,i+1))} disabled={i===words.length-1} style={{ background:i===words.length-1?"rgba(255,255,255,0.03)":c.accent, border:"none", color:i===words.length-1?"#444":"#fff", borderRadius:"8px", padding:"9px 18px", cursor:i===words.length-1?"default":"pointer", fontSize:"12px", fontWeight:"600" }}>下一個 →</button>
                </div>
              </div>
            );
          })}
        </>)}

        <div style={{ textAlign:"center", marginTop:"14px", fontSize:"10px", color:"#333", fontFamily:"monospace" }}>
          前18天基礎 → 後13天口語 · 每天自動換新
        </div>
      </div>
    </div>
  );
}
