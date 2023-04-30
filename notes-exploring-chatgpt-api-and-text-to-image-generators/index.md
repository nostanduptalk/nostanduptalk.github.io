# [筆記] 探索ChatGPT API和文字轉圖像生成器



偶然的機會發現ChatGPT 官方免費線上課程，花了一天來深入了解，以下是我筆記，最後介紹三個AI文字產圖的心得。

<!--more-->
<iframe src="https://open.firstory.me/embed/story/clh3lx1m7018301yh3tf42ggs" height="180" width="99%" frameborder="0" scrolling="no"></iframe>

## 上課前後的差異
上課前，我只使用[ChatGPT 網頁版](https://chat.openai.com/)，常常輸入太多，直接顯示沒有回應。上課後，使用python 與API KEY，用電腦傳需求可以更穩定。

## 官方課程: 
[Link: ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)
介紹提示的兩個關鍵原則：**撰寫明確具體的指示，並在適當的情況下給模型思考的時間。**
同時介紹了迭代提示開發和構建自定義聊天機器人的方法。並介紹了大 型語言模型的幾種有用功能，包括**總結、推斷、轉換和擴展**。
此外，還提醒讀者使用這些工具負責任，並只構建將具有積極影響的事物。


## model="gpt-3.5-turbo"
一次執行多個任務，並設定輸出格式
``` python
import openai

# Create secret API key from https://platform.openai.com/account/api-keys
openai.api_key  = "sk-XXXXXXXXXXXXXXXX"

# response = openai.Completion.create(model="text-davinci-003", prompt="Say this is a test", temperature=0, max_tokens=7)

def get_completion(prompt, model="gpt-3.5-turbo",temperature=0):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
    total_tokens = response['usage']['total_tokens']
    print("total_tokens: " + str(total_tokens) +" temperature: "+ str(temperature))
    return response.choices[0].message["content"]

def get_completion_from_messages(messages, model="gpt-3.5-turbo", temperature=0):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
#     print(str(response.choices[0].message))
    return response.choices[0].message["content"]
text = f"""
こんにちは！私はChatGPTと申します。私は人工知能のモデルで、日本語を話すことができます。

今日は素晴らしい天気ですね。外に出かけて、新しいことを試してみるのはいかがでしょうか？例えば、新しいレストランを試す、公園でピクニックをする、あるいは博物館や美術館を訪れることができます。

また、自分のスキルを向上させるために、新しい趣味やスポーツを始めることもできます。例えば、料理、写真、ゴルフ、あるいはヨガなどです。

最近、私は日本文化について学び始めました。日本の伝統的な芸能、美術、音楽、そして食べ物について学ぶことができました。日本に旅行したことがある人たちからの話も聞きました。日本には、素晴らしい観光地がたくさんあります。

私たちは、毎日新しいことを学び、経験を積むことができます。私たちの興味や好みに合わせて、新しいことに挑戦してみましょう！
"""
prompt = f"""
請用繁體中文，執行下列動作
1 - 翻譯成繁體中文
2 - 提出300字摘要
3 - 條列全部的重點並附上說明

輸出格式為
翻譯: <1>
提出300字摘要: <2>
歸納重點: <3>
{text}
"""
response = get_completion(prompt, temperature=0)
print(response)
```

ChatGPT 回答是: 
total_tokens: 1370 temperature: 0

``` text
翻譯:
你好！我是ChatGPT，一個人工智能模型，我可以說日語。

今天天氣真好啊！不妨出門試試新事物，例如嘗試新餐廳、在公園野餐或參觀博物館和美術館等等。

此外，為了提升自己的技能，也可以開始新的嗜好或運動，例如烹飪、攝影、高爾夫或瑜伽等等。

最近，我開始學習日本文化，學習了日本的傳統藝術、美術、音樂和食物。我也聽取了曾經去過日本的人們的故事，日本有很多美麗 
的旅遊勝地。

我們每天都可以學習新事物，積累經驗。讓我們根據自己的興趣和喜好挑戰新事物吧！

提出300字摘要:
ChatGPT是一個人工智能模型，可以說日語。他建議人們可以嘗試新事物，例如嘗試新餐廳、在公園野餐或參觀博物館和美術館等等。
此外，為了提升自己的技能，也可以開始新的嗜好或運動，例如烹飪、攝影、高爾夫或瑜伽等等。最近，ChatGPT開始學習日本文化，
學習了日本的傳統藝術、美術、音樂和食物。他也聽取了曾經去過日本的人們的故事，日本有很多美麗的旅遊勝地。ChatGPT鼓勵人們
每天學習新事物，積累經驗，並根據自己的興趣和喜好挑戰新事物。

歸納重點:
- ChatGPT是一個人工智能模型，可以說日語。
- ChatGPT建議人們可以嘗試新事物，例如嘗試新餐廳、在公園野餐或參觀博物館和美術館等等。
- 為了提升自己的技能，也可以開始新的嗜好或運動，例如烹飪、攝影、高爾夫或瑜伽等等。
- ChatGPT最近開始學習日本文化，學習了日本的傳統藝術、美術、音樂和食物。
- ChatGPT鼓勵人們每天學習新事物，積累經驗，並根據自己的興趣和喜好挑戰新事物。
```

## 可以送出對話歷史，以便製作聊天機器人
``` python
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},
{'role':'user', 'content':'Hi, my name is Isa'},
{'role':'assistant', 'content': "Hi Isa! It's nice to meet you. \
Is there anything I can help you with today?"},
{'role':'user', 'content':'Yes, you can remind me, What is my name?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```
ChatGPT 回答是: Your name is Isa.

## token
但似乎只有用API方式才會算token 使用量(?)，用python 回傳的結果可以看到每次大約都要1000~4000 token 才能完成一次，以gpt-3.5-turbo價格 $0.002 / 1000 tokens來說，其實不貴，但滿三個月或是18美元的額度用完後，就不知道該怎麼辦了。

## Line Bot
原本想要串Line 機器人，但發現帳號只免費到6月，所以裝好就不到一個月就不能用了，就很沒有衝勁，等6月再看看。

## 其他發現
- 可以請他用 informal 的方式回答
- Temperature 可以提高變化度
- 更好的Prompt: proofread and correct this review:
- 比較差異的ptyhon套件: Redlines

``` python
from redlines import Redlines

diff = Redlines(text,response)
display(Markdown(diff.output_markdown))
```

## 文字產圖 "model": "image-alpha-001"
最後去研究文字產圖，目前midjourney已經沒有免費版了，所以就找看看其他的，意外發現這也可以用同樣的API KEY。但是比較貴，1024×1024，$0.020 / image，所以不敢一直做。

``` python
import requests
import json

def generate_image(prompt):
    response = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-XXXXXXXXXXX"  # API KEY
        },
        json={
            "model": "image-alpha-001",
            "prompt": prompt,
            "num_images": 1,
            "size": "1024x1024",
            "response_format": "url"
        }
    )
    image_url = json.loads(response.text)["data"][0]["url"]
    print (image_url)

prompt = """A digital illustration of office, 4k, detailed, trending in artstation, fantasy"""
generate_image(prompt)
```

回傳image_url網址，檔案3MB，我自行壓縮後如下:

<img src="ex.jpg" width="100%">

## 免費產圖 
1. [bing image creator (有限次數)](https://www.bing.com/images/create)
2. [stable-diffusion  (未限次數)](https://huggingface.co/spaces/stabilityai/stable-diffusion)

簡單的場景，還算可以
`A digital illustration of a office with people, 4k, detailed, trending in artstation, fantasy`

太難的做出來根本不能看，素材Prompt 可以上網找。

## 後記
之後的人生，肯定多離不了AI工具了，目前ChatGPT能夠幫助我整理書上的重點，重新潤飾我的心得，並且能給我創意啟發，告訴我還需要寫些甚麼，或是要怎麼開始思考一件事。會不會以後每個月都需要固定花一筆費用在這些AI費用上呢？希望還是有每個月的免費額度讓我少量使用。

