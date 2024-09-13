FROM python:3.8.20-alpine

RUN apk add --no-cache build-base linux-headers gcc libffi-dev python3-dev
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install cffi
RUN pip install gunicorn
RUN pip install redis
RUN pip install psycopg2-binary

ADD ../backend/requirements.txt /app/
RUN pip install -r requirements.txt

ADD ../backend /app/backend
ADD ../docker /app/docker

RUN chmod +x /app/docker/backend/server-entrypoint.sh
RUN chmod +x /app/docker/backend/worker-entrypoint.sh