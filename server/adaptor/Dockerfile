FROM python:3.9

WORKDIR /app

COPY ../requirements.txt .
RUN pip install -r requirements.txt

COPY shared ./shared
COPY adaptor ./adaptor

ENV PYTHONPATH="/app:${PYTHONPATH}"

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "adaptor.adaptor:app"]