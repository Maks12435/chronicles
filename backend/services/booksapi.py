import requests

def find_book(title=None, author=None, isbn=None, year=None, limit=1):
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {"q": "", "maxResults": limit}

    # Формируем поисковый запрос
    query_parts = []
    if title:
        query_parts.append(f"intitle:{title}")
    if author:
        query_parts.append(f"inauthor:{author}")
    if isbn:
        query_parts.append(f"isbn:{isbn}")
    if year:
        query_parts.append(f"inpublisher:{year}")  # у Google Books нет прямого фильтра по году
    if query_parts:
        params["q"] = " ".join(query_parts)
    else:
        params["q"] = "book"  # fallback

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        if "items" in data:
            results = []
            for item in data["items"][:limit]:
                volume_info = item.get("volumeInfo", {})
                sale_info = item.get("saleInfo", {})
                access_info = item.get("accessInfo", {})

                # ISBN
                isbn_val = next(
                    (i["identifier"] for i in volume_info.get("industryIdentifiers", [])
                     if i["type"] in ("ISBN_10", "ISBN_13")), "no ISBN"
                )

                # Цена
                price = None
                if "retailPrice" in sale_info:
                    price = f"{sale_info['retailPrice']['amount']} {sale_info['retailPrice']['currencyCode']}"

                results.append({
                    "title": volume_info.get("title", "unknown"),
                    "author": ", ".join(volume_info.get("authors", ["unknown"])),
                    "isbn": isbn_val,
                    "released_year": volume_info.get("publishedDate", "11-11-2005"),
                    "description": volume_info.get("description") or item.get("searchInfo", {}).get("textSnippet"),
                    "image": volume_info.get("imageLinks", {}).get("thumbnail"),
                    "language": volume_info.get("language", "unknown"),
                    "country": sale_info.get("country", "unknown"),
                    "average_rating": volume_info.get("averageRating", 0),
                    "price": price or "Not for sale",
                    "web_reader_link": access_info.get("webReaderLink", "no link")
                })
            return results if limit > 1 else results[0]
        else:
            return {"error": "book not found"}
    else:
        return {"error": f"Error {response.status_code}"}
