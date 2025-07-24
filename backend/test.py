from datetime import date, datetime
from babel.dates import format_date

today = date.today()
formatted = date(today.year - 1, today.month, today.day)


print(formatted) 
print(today)