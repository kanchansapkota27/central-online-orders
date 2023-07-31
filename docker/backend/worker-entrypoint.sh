until cd /app/backend
do
    echo "Waiting for server volume..."
done

# run a worker :)
python manage.py run_huey