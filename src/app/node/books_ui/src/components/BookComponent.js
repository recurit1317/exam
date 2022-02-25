import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useLiveQuery } from "dexie-react-hooks"

import * as Const from '../Const.js'
import * as Util from '../Util.js'

import { historyDB as db } from "../store/BookDB.js"

// style
const mainContainer = {
    borderLeft: '1px solid gray',
    borderRight: '1px solid gray',
    maxWidth: '800px',
    minHeight: '100vh',
    margin: 'auto',
    padding: '5px'
}
const searchContainer = {
    display: 'flex',
}
const historyContainer = {
    display: 'flex',
}
const historyLabel = {
    marginRight: "5px",
}
const listContainer = {
    display: 'flex',
    flexDirection: 'column',
}
const bookContainer = {
    display: 'flex',
    margin: '5px',
    alignItems: 'center',
}
const bookThumbnail = {
    height: '100px',
    width: '100px',
    objectFit: 'scale-down',
    flexShrink: '0',
}
const bookDetailContainer = {
    display: 'flex',
    flexDirection: 'column',
}
const bookDetailLabel = {
    whiteSpace: 'nowrap',
    verticalAlign: 'top'
}
const bookDetailContent = {
    wordBreak: "break-all"
}

// 表示画面
const BookComponent = () => {
    const [result, setResult] = useState(null)
    const [bookList, setBookList] = useState([])

    const setSearchResult = (keyword = null, data = []) => {
        setResult(keyword)
        setBookList(data)
    }

    const updateSearchResult = (keyword, data) => {
        (async () => {
            // 履歴が10件超えていた場合削除
            const saveList = []
            for (let i = 0; i < 10 && i < data.length; i++) {
                saveList.push(data[i])
            }
            await db.histories.put({
                keyword: keyword,
                date: new Date(),
                listData: saveList
            })
            // const keys = await db.histories.orderBy('date').primaryKeys()
            // for (let i = 0; keys.length - i > 10; i++) {
            //     await db.histories.delete(keys[i])
            // }
        })()

        setSearchResult(keyword, data)
    }

    return (
        <div style={mainContainer}>
            <BookSearch setSearchResult={setSearchResult} updateSearchResult={updateSearchResult} />
            <SearchHistory setSearchResult={setSearchResult}/>
            <SearchResult result={result} />
            <BookList bookList={bookList}/>
        </div>
    )
}

// 検索
const BookSearch = (props) => {
    const [buttonState, setButtonState] = useState(true)
    const [searchText, setSearchText] = useState("")

    const search = () => {
        setButtonState(false)
        props.setSearchResult("検索中")
        axios.get(Const.SEARCH_API, {
            params: {
                keyword: searchText
            }
        })
        .then(response => {
            console.log(response)
            props.updateSearchResult(searchText, response.data)
        })
        .catch(error => {
            props.setSearchResult(error.response.data.error.message)
        })
        .finally(() => {
            setButtonState(true)
        })
    }

    return (
        <div style={searchContainer}>
            <input id="searchText" style={{width: "100%"}} placeholder={"検索する書籍名を入力"} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <button style={{whiteSpace: "nowrap"}} onClick={search} disabled={buttonState ? "" : "disabled"}>検索</button>
        </div>
    )
}

// 履歴表示
const SearchHistory = (props) => {
    const histories = useLiveQuery(() => db.histories.toArray(), [])
    
    return (
        <div style={historyContainer}>
            <div style={{whiteSpace: "nowrap"}}>検索履歴　</div>
            <div>
                {histories ?
                    histories.sort((a, b) => {
                        return b.date - a.date
                    }).map((value, index) => {
                        const resultWord = `${value.keyword}（${Util.dateFormat(value.date)}）`
                        return (
                            <a key={"histories_" + value.keyword} style={historyLabel} href="#" onClick={(e) => props.setSearchResult(resultWord, value.listData)} >{value.keyword}</a>
                        )
                    })
                : null}
            </div>
        </div>
    )
}

// 検索ワード表示
const SearchResult = (props) => {
    return (
        <div>
            <div>検索結果　{props.result}</div>
        </div>
    )
}

// 検索結果表示部
const BookList = (props) => {
    return (
        <div style={listContainer}>
            {props.bookList.map((data, index) => {
                return (
                    <React.Fragment key={"booklist_" + index}>
                        <div style={{height: '1px', widht: '100%', margin: '5px, 0', background: 'lightgray'}}/>
                        <Book {...data}/>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

const Book = (props) => {
    return (
        <div style={bookContainer}>
            <img style={bookThumbnail} src={props.imageLinks ? props.imageLinks.smallThumbnail : ''} alt="サムネイル画像" />
            <table style={bookDetailContainer}>
                <tbody>
                    <tr>
                        <td style={bookDetailLabel}>書籍名</td>
                        <td style={bookDetailContent}>{props.title ? props.title : '不明'}</td>
                    </tr>
                    <tr>
                        <td style={bookDetailLabel}>著者</td>
                        <td style={bookDetailContent}>{props.authors ? props.authors : '不明'}</td>
                    </tr>
                    <tr>
                        <td style={bookDetailLabel}>説明</td>
                        <td style={bookDetailContent}>{props.description ? props.description : '不明'}</td>
                    </tr>
                    <tr>
                        <td style={bookDetailLabel}>リンク</td>
                        <td style={bookDetailContent}><a href={props.infoLink}>{props.infoLink ? props.infoLink : '不明'}</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default BookComponent