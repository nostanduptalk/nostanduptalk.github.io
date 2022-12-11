# API設計之hyrum's law


API使用者夠多，即使是文件沒提到的使用方法，若使用者能觀察到，就會依賴使用。
<!--more-->
``With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody
``

舉例：如果一個字串組合API每次合併都會用逗號分隔，就會有使用者發現，並自行開發以逗號作為分割的拆解用API，若有一天這個API改成以逗號與一個空格作為分隔，那拆解用的API就會產生不預期的結果。好的解決辦法是：讓拆解API也讓合併API的人負責。

這個軟體工程的現象，在草地上也會發現，明明有一條步道可以走，但大家發現步道會繞遠路，所以都直接走到草皮上，漸漸的就走出一條沒有草的捷徑。


## 參考
[hyrums-law](https://thebootstrappedfounder.com/hyrums-law/)
