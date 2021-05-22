FROM python:3.7-slim

WORKDIR /app

COPY . /app

RUN pip install telethon pyyaml whoosh jieba redis requests[socks]

CMD ["python", "main.py"]
