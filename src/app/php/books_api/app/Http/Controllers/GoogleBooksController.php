<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Exceptions\SearchException;

class GoogleBooksController extends BaseController
{
    /**
     * GoogleBooksAPIでの書籍情報検索
     * 
     * @param  Request  $request
     * @return Response
     */
    public function search(Request $request)
    {
        $keyword = $request->input('keyword');
        throw_if($keyword == '', new SearchException('検索ワードがありません'));

        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', 'https://www.googleapis.com/books/v1/volumes', [
            'query' => [
                'q' => $keyword,
                'startIndex' => 0,
                'maxResults' => 40,
                'fields' => 'totalItems,items(volumeInfo(title,authors,description,infoLink,imageLinks/smallThumbnail))',
            ]
        ]);
        
        throw_if($response->getStatusCode() != 200, new SearchException('書籍情報を取得できませんでした'));

        $contents = json_decode($response->getBody());
        throw_if(!property_exists($contents, 'items'), new SearchException('書籍情報を取得できませんでした'));
        
        $books = [];
        foreach ($contents->items as $item) {
            $books[] = $item->volumeInfo;
        }
        return response()->json($books);
    }
}
