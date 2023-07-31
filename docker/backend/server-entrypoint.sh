#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done


until python manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done



python manage.py collectstatic --noinput
COPY --from=build /app/backend/static /static/
python manage.py initadmin
# python manage.py createsuperuser --noinput

gunicorn core.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4