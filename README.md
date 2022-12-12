# aki README

search and select removable whitespaces.

文書中の本来不必要な空白文字（アキ）を検索・選択する。

![img](images/demo.png)

## Features

「下記の正規表現（にマッチする文字）に囲まれた空白文字」、もしくは「数字と非 ASCII 文字との間の空白文字」を検索する。

```
\u3001-\u30ff\u4e00-\u9fff\uff01-\uff5e
```

+ `\u3001-\u30ff`：日本語約物・ひらがな・カタカナ
+ `\u4e00-\u9fff`：CJK統合漢字（ここに含まれない漢字は見逃してしまう可能性あり）
+ `\uff01-\uff5e`：全角約物・全角英数



### `aki.selectAll`

+ 不要なアキをすべて選択する。

### `aki.selectOnCurrentLine`

+ カーソルがある行にある、不要なアキをすべて選択する。

### `aki.splitSelection`

+ 文字列を選択した状態で実行すると、範囲内の不要なアキのみ選択する。

### `aki.openSearchPanel`

+ 検索パネルを開いて不要なアキを検索する。


**Enjoy!**
