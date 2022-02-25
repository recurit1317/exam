## 環境構築方法
### １．docker-composeのインストール
https://www.docker.com/get-started

### ２．ファイルのダウンロード
git clone git@github.com:recurit1317/exam.git

### ３．ターミナルでexamフォルダに移動し以下コマンドを実行
cd exam
docker-compose up --build -d

### ４．ブラウザにて以下URLにアクセス
http://localhost:3000/

### ５．環境の破棄
docker-compose down --rmi all --volumes

#### ■起動確認方法
docker-compose logs -f  
↓ログの出力後、ブラウザでの動作確認頂けます  
app_node_container          | webpack 5.69.1 compiled successfully in 757 ms

#### ■動作確認環境
Windows10 Home / WSL (ubunts 20.04)
