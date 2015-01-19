# react-odp 工作報告

* 時間： 2015-01-19 17:53
* 作者： caasi Huang

本文件簡述 react-odp 版本 [8126f69](https://github.com/ChineseCubes/react-odp/tree/8126f695c4a2e772ed542cc7e2e135326fa0547d) 的功能與操作方式。

## 取得方式

請至 [GitHub](https://github.com/ChineseCubes/react-odp/releases/tag/v0.0.1) ，點選 'Source code (zip)' 下載。

## 系統概要

本系統分為兩部分： web 與 epub3 生成。前者 Rex 習慣稱為（高鐵）台中站，後者稱為高雄站。

不管操作那個部分，都得先安裝 node.js 並執行 `npm install` ， node.js 可以從[官方網站](http://nodejs.org/)下載，或者使用 [Node Version Manager](https://github.com/creationix/nvm) 以便管理不同版本的 node.js 。在 Mac OSX 上也可以在安裝 [Homebrew](http://brew.sh/) 後，執行 `brew install nodejs` 安裝。

### web

執行 `npm start` 後，以瀏覽器打開 `http://localhost:8080/` 會看到好朋友這本書。

### epub3

先執行 `npm install -g LiveScript` 安裝 [LiveScript](http://livescript.net/) ，再執行 `./src/build/pack.ls ./books/Good_Friends/Good_Friends.odp` ，就會開始生成 epub 檔。

## 使用到的技術

## 注意事項

## 已知問題

